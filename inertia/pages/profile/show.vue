<script setup lang="ts">
import { Link, router, usePage } from '@inertiajs/vue3'

interface UserWallet {
  coinBalance: number
}

interface Creator {
  bankName?: string
  bankAccountName?: string
  bankAccountNumber?: string
}

interface UserData {
  username: string
  userWallet: UserWallet
  creator?: Creator | null
}

const page = usePage<{ userData: UserData }>()
const userData = page.props.userData

const logout = () => {
  router.post('/logout')
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        Profil Pengguna
      </h1>

      <button
        @click="logout"
        class="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>

    <!-- Card User -->
    <div class="bg-white shadow-md rounded-xl p-6 border border-gray-100">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Informasi Akun</h2>

      <div class="space-y-2 text-gray-700">
        <p>
          <span class="font-medium">Username:</span>
          {{ userData.username }}
        </p>

        <p>
          <span class="font-medium">Saldo Koin:</span>
          <span class="text-purple-600 font-semibold">
            {{ userData.userWallet?.coinBalance }} koin
          </span>
        </p>
      </div>
    </div>

    <!-- Card Creator -->
    <div
      v-if="userData.creator"
      class="bg-white shadow-md rounded-xl p-6 border border-gray-100 mt-6"
    >
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Informasi Bank Kreator</h2>

      <div class="space-y-2 text-gray-700">
        <p>
          <span class="font-medium">Nama Bank:</span>
          {{ userData.creator.bankName }}
        </p>

        <p>
          <span class="font-medium">Nama Rekening:</span>
          {{ userData.creator.bankAccountName }}
        </p>

        <p>
          <span class="font-medium">Nomor Rekening:</span>
          {{ userData.creator.bankAccountNumber }}
        </p>
      </div>
    </div>

    <!-- Tombol Edit -->
    <div class="flex justify-end mt-8">
      <Link
          :href="`/profile/edit/${userData.username}`"
        class="px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition font-medium"
      >
        Edit Data
      </Link>
    </div>

  </div>
</template>
