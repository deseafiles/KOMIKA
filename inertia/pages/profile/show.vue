<script setup lang="ts">
import { ref, computed } from 'vue'
import { Link, router, usePage } from '@inertiajs/vue3'
import CoinPurchaseModal from '~/components/CoinPurchaseModal.vue'

interface UserWallet {
  coinBalance: number
}

interface Creator {
  bankName?: string
  bankAccountName?: string
  bankAccountNumber?: string
}

interface UserData {
  id: number
  username: string
  userWallet: UserWallet
  creator?: Creator | null
}

interface CoinPackage {
  id: number
  name: string
  coinAmount: number
  price: number
  bonusCoin?: number | null
}

const page = usePage()
const userData = computed(() => page.props.userData as UserData)
const coinPackages = computed(() => {
  const packages = page.props.coinPackage as CoinPackage[] | undefined
  return packages && Array.isArray(packages) ? packages : []
})

const showCoinModal = ref(false)
const successMessage = ref('')

console.log('Profile Props:', {
  userData: userData.value,
  coinPackages: coinPackages.value,
})

const logout = () => {
  router.post('/logout')
}

const closeCoinModal = () => {
  showCoinModal.value = false
}

const handlePurchaseSuccess = (message: string) => {
  successMessage.value = message
  showCoinModal.value = false

  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}
</script>

<template>
  <div class="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
    <div
      v-if="successMessage"
      class="p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg animate-pulse"
    >
      ✅ {{ successMessage }}
    </div>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
        Profil Pengguna
      </h1>
    </div>

    <!-- Card User -->
    <div class="bg-white dark:bg-neutral-900 shadow-md rounded-xl p-6 border border-gray-100 dark:border-neutral-800">
      <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Informasi Akun</h2>

      <div class="space-y-4 text-gray-700 dark:text-gray-400">
        <p>
          <span class="font-medium">Username:</span>
          <span class="text-gray-900 dark:text-white ml-2">{{ userData?.username }}</span>
        </p>

        <div class="flex items-center justify-between bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div>
            <p class="font-medium">Saldo Koin Anda:</p>
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
              {{ userData?.userWallet?.coinBalance || 0 }} 💰
            </p>
          </div>
          <button
            @click="showCoinModal = true"
            class="px-6 py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold rounded-lg transition shadow-lg hover:shadow-xl"
          >
            + Beli Koin
          </button>
        </div>
      </div>
    </div>

    <!-- Card Creator -->
    <div
      v-if="userData?.creator"
      class="bg-white dark:bg-neutral-900 shadow-md rounded-xl p-6 border border-gray-100 dark:border-neutral-800"
    >
      <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Informasi Bank Kreator</h2>

      <div class="space-y-2 text-gray-700 dark:text-gray-400">
        <p>
          <span class="font-medium">Nama Bank:</span>
          {{ userData.creator?.bankName || '-' }}
        </p>

        <p>
          <span class="font-medium">Nama Rekening:</span>
          {{ userData.creator?.bankAccountName || '-' }}
        </p>

        <p>
          <span class="font-medium">Nomor Rekening:</span>
          {{ userData.creator?.bankAccountNumber || '-' }}
        </p>
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex flex-col sm:flex-row sm:justify-between gap-4">
      <button
        @click="logout"
        class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition w-full sm:w-auto font-medium"
      >
        Logout
      </button>

      <Link
        :href="`/profile/edit/${userData?.username}`"
        class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition font-medium w-full sm:w-auto text-center"
      >
        Edit Data
      </Link>
    </div>

    <!-- Coin Packages List (untuk referensi tanpa modal) -->
    <div v-if="coinPackages.length > 0" class="bg-white dark:bg-neutral-900 shadow-md rounded-xl p-6 border border-gray-100 dark:border-neutral-800">
      <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Paket Koin Tersedia</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="pack in coinPackages"
          :key="pack.id"
          class="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 transition"
        >
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {{ pack.name }}
          </h3>

          <p class="text-gray-700 dark:text-gray-400 mb-3">
            <span class="text-yellow-500 font-semibold">{{ pack.coinAmount }}</span> koin
            <span v-if="pack.bonusCoin" class="text-green-600 dark:text-green-400 ml-2">
              +{{ pack.bonusCoin }} bonus
            </span>
          </p>

          <p class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
            Rp {{ pack.price?.toLocaleString('id-ID') || 0 }}
          </p>

          <button
            @click="showCoinModal = true"
            class="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium text-sm"
          >
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>

    <!-- Coin Purchase Modal -->
    <CoinPurchaseModal
      v-if="showCoinModal && coinPackages.length > 0"
      :coin-packages="coinPackages"
      @close="closeCoinModal"
      @success="handlePurchaseSuccess"
    />

  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>
