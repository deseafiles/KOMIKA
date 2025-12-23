<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { router } from '@inertiajs/vue3'

interface CoinPackage {
  id: number
  name: string
  coinAmount: number
  price: number
  bonusCoin?: number | null
}

const props = defineProps<{
  coinPackages: CoinPackage[]
}>()

const emit = defineEmits<{
  close: []
  success: [message: string]
}>()

const selectedPackage = ref<CoinPackage | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')
const midtransLoaded = ref(false)

onMounted(() => {
  if ((window as any).snap) {
    midtransLoaded.value = true
    return
  }

  const script = document.createElement('script')
  script.src = 'https://app.midtrans.com/snap/snap.js'
  script.setAttribute(
    'data-client-key',
    import.meta.env.VITE_MIDTRANS_CLIENT_KEY || ''
  )
  script.onload = () => {
    midtransLoaded.value = true
    console.log('✅ Midtrans Snap loaded')
  }
  script.onerror = () => {
    console.error('❌ Failed to load Midtrans Snap')
    errorMessage.value = 'Gagal memuat sistem pembayaran'
  }
  document.body.appendChild(script)
})

async function handlePurchase(coinPackage: CoinPackage) {
  if (!midtransLoaded.value) {
    errorMessage.value = 'Sistem pembayaran sedang dimuat. Silakan coba lagi.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  selectedPackage.value = coinPackage

  try {
    const url = '/transaction/create'
    const createResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        coinPackageId: coinPackage.id,
      }),
    })

    if (!createResponse.ok) {
      const error = await createResponse.json()
      throw new Error(error.message || 'Gagal membuat transaksi')
    }

    const result = await createResponse.json()
    const { data } = result
    const { snapToken, orderId } = data

    if (!snapToken) {
      throw new Error('Token pembayaran tidak diterima')
    }

    ;(window as any).snap.pay(snapToken, {
      onSuccess: (result: any) => {
        console.log('✅ Payment success:', result)
        handlePaymentSuccess(result, orderId)
      },
      onPending: (result: any) => {
        console.log('⏳ Payment pending:', result)
        handlePaymentPending(result, orderId)
      },
      onError: (result: any) => {
        console.error('❌ Payment error:', result)
        handlePaymentError(result, orderId)
      },
      onClose: () => {
        console.log('🚪 Payment modal closed')
        isLoading.value = false
        errorMessage.value = 'Pembayaran dibatalkan'
      },
    })
  } catch (error) {
    console.error('❌ Error:', error)
    errorMessage.value =
      error instanceof Error ? error.message : 'Terjadi kesalahan'
    isLoading.value = false
  }
}

async function handlePaymentSuccess(result: any, orderId: string) {
  try {
    let isVerified = false
    let attempts = 0
    const maxAttempts = 30

    while (!isVerified && attempts < maxAttempts) {
      attempts++

      if (attempts > 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      console.log(`📡 Status check attempt ${attempts}/${maxAttempts}...`)

      const statusResponse = await fetch(`/transaction/status/${orderId}`)

      if (!statusResponse.ok) {
        console.warn(`⚠️ Status check failed: ${statusResponse.status}`)
        continue
      }

      const responseText = await statusResponse.text()

      if (!responseText || responseText.trim() === '') {
        console.warn('⚠️ Empty response')
        continue
      }

      let statusData
      try {
        statusData = JSON.parse(responseText)
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError)
        continue
      }

      const { data } = statusData

      if (!data) {
        console.warn('⚠️ No data in response')
        continue
      }

      console.log(`📊 Status: ${data.status}, Paid: ${data.isPaid}`)

      if (data.isPaid || data.status === 'completed' || data.status === 'settlement' || data.status === 'capture') {
        console.log('✅ Payment verified!')
        isVerified = true
        emit('success', `Berhasil membeli ${selectedPackage.value?.name}! Koin sudah ditambahkan.`)

        setTimeout(() => {
          router.reload()
        }, 2000)
        return
      } else if (data.status === 'failed' || data.status === 'deny' || data.status === 'cancel' || data.status === 'expire') {
        throw new Error(`Pembayaran gagal: ${data.status}`)
      }
    }

    if (!isVerified) {
      throw new Error('Pembayaran masih dalam proses. Silakan tunggu dan coba lagi.')
    }
  } catch (error) {
    console.error('❌ Verification error:', error)
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Pembayaran berhasil tapi verifikasi gagal'
    isLoading.value = false
  }
}

function handlePaymentPending(result: any, orderId: string) {
  isLoading.value = false
  errorMessage.value =
    'Pembayaran masih dalam proses. Silakan tunggu beberapa saat...'
  console.log('Payment pending:', result)
}

function handlePaymentError(result: any, orderId: string) {
  isLoading.value = false
  errorMessage.value = 'Pembayaran gagal. Silakan coba lagi.'
  console.error('Payment error:', result)
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div
      class="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in"
    >
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Beli Koin
        </h2>
        <button
          @click="emit('close')"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
        >
          ✕
        </button>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm animate-shake"
      >
        ⚠️ {{ errorMessage }}
      </div>

      <!-- Coin Packages -->
      <div class="space-y-3 mb-6">
        <button
          v-for="pkg in coinPackages"
          :key="pkg.id"
          @click="handlePurchase(pkg)"
          :disabled="isLoading"
          class="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed text-left"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white">
                {{ pkg.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span class="font-semibold text-lg">{{ pkg.coinAmount }}</span>
                <span class="text-yellow-500 ml-1">💰</span>
                <span v-if="pkg.bonusCoin" class="text-green-600 dark:text-green-400 ml-2">
                  +{{ pkg.bonusCoin }} bonus
                </span>
              </p>
            </div>
            <div class="text-right">
              <p class="font-bold text-purple-600 dark:text-purple-400 text-lg">
                Rp {{ pkg.price.toLocaleString('id-ID') }}
              </p>
            </div>
          </div>
        </button>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="text-center py-8 text-gray-600 dark:text-gray-400"
      >
        <div class="flex justify-center mb-3">
          <div class="animate-spin inline-block w-6 h-6 border-3 border-purple-600 border-t-transparent rounded-full"></div>
        </div>
        <p class="font-medium">Memproses pembayaran...</p>
        <p class="text-xs mt-1">Jangan tutup halaman ini</p>
      </div>

      <!-- Footer -->
      <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
        <p>💳 Pembayaran aman menggunakan Midtrans</p>
        <p class="mt-1">Mendukung kartu kredit, transfer bank & e-wallet</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}

::-webkit-scrollbar-thumb {
  background: #555;
}

::-webkit-scrollbar-thumb:hover {
  background: #777;
}
</style>
