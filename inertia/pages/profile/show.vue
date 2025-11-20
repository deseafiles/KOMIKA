<script setup lang="ts">
import { usePage } from '@inertiajs/vue3'

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

</script>

<template>
  <div class="p-6">
    <h1 class="text-xl font-semibold">Profil Pengguna</h1>

    <div class="mt-4">
      <p><strong>Username:</strong> {{ userData.username }}</p>
      <p><strong>Saldo:</strong> {{ userData.userWallet?.coinBalance }} koin</p>
    </div>

    <!-- Tampilkan hanya jika user punya data creator -->
    <div v-if="userData.creator" class="mt-6 border-t pt-4">
      <h2 class="text-lg font-medium">Informasi Bank (Kreator)</h2>
      <p><strong>Nama Bank:</strong> {{ userData.creator.bankName }}</p>
      <p><strong>Nama Rekening:</strong> {{ userData.creator.bankAccountName }}</p>
      <p><strong>Nomor Rekening:</strong> {{ userData.creator.bankAccountNumber }}</p>
    </div>

    <div>
      <button class="bg-purple-300 text-white p-2 m-20 rounded-lg">Edit Data</button>
    </div>
  </div>
</template>
