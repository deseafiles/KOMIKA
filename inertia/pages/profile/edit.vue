<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import { ref } from 'vue'

interface Creator {
  id: number
  username: string
  bankName: string | null
  bankAccountName: string | null
  bankAccountNumber: string | null
}

const props = defineProps<{
  creator?: Creator
}>()

const creator = props.creator ?? {
  id: 0,
  username: '',
  bankName: '',
  bankAccountName: '',
  bankAccountNumber: ''
}

const errorMessage = ref('')

const form = useForm({
  bankName: creator.bankName ?? '',
  bankAccountName: creator.bankAccountName ?? '',
  bankAccountNumber: creator.bankAccountNumber ?? ''
})

function validate(): boolean {
  errorMessage.value = ''

  if (!form.bankName.trim()) {
    errorMessage.value = 'Nama bank wajib diisi'
    return false
  }

  if (!form.bankAccountName.trim()) {
    errorMessage.value = 'Nama pemilik rekening wajib diisi'
    return false
  }

  if (!form.bankAccountNumber.trim()) {
    errorMessage.value = 'Nomor rekening wajib diisi'
    return false
  }

  const numberRegex = /^[0-9]{8,20}$/
  if (!numberRegex.test(form.bankAccountNumber)) {
    errorMessage.value = 'Nomor rekening hanya boleh angka dan terdiri dari 8-20 angka'
    return false
  }

  return true
}

// Submit form
function submit() {
  if (!validate()) return

  form.put(`/profile/update`, {
    onSuccess: () => {
      errorMessage.value = ''
      window.history.back()
    },
    onError: () => {
      errorMessage.value = 'Gagal memperbarui data creator'
    }
  })
}

const goBack = () => {
  window.history.back()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
    <div class="bg-white shadow-md rounded-2xl p-6 w-full max-w-lg">
      <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">Edit Data Creator</h1>

      <form @submit.prevent="submit" class="space-y-4">
        <!-- Error -->
        <div v-if="errorMessage" class="p-2 bg-red-100 text-red-700 rounded text-sm">
          {{ errorMessage }}
        </div>

        <!-- Bank Name -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Nama Bank</label>
          <input
            v-model="form.bankName"
            type="text"
            class="w-full border-gray-300 rounded-lg p-2"
            placeholder="Masukkan nama bank"
          />
          <p v-if="form.errors.bankName" class="text-red-500 text-sm mt-1">{{ form.errors.bankName }}</p>
        </div>

        <!-- Account Name -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Nama Pemilik Rekening</label>
          <input
            v-model="form.bankAccountName"
            type="text"
            class="w-full border-gray-300 rounded-lg p-2"
            placeholder="Masukkan nama pemilik rekening"
          />
          <p v-if="form.errors.bankAccountName" class="text-red-500 text-sm mt-1">{{ form.errors.bankAccountName }}</p>
        </div>

        <!-- Account Number -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Nomor Rekening</label>
          <input
            v-model="form.bankAccountNumber"
            type="text"
            class="w-full border-gray-300 rounded-lg p-2"
            placeholder="Masukkan nomor rekening"
          />
          <p v-if="form.errors.bankAccountNumber" class="text-red-500 text-sm mt-1">{{ form.errors.bankAccountNumber }}</p>
        </div>

        <!-- Tombol -->
        <div class="flex justify-end gap-3 mt-6">
          <button type="button" @click="goBack" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Batal</button>
          <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Perbarui
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
