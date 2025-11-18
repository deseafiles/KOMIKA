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

interface CoinPackage {
 name: string,
 coinAmount: number,
 price: number,
 bonusCoin?: number
}

const page = usePage<{ userData: UserData, coinPackage: CoinPackage[] }>()
const userData = page.props.userData
console.log(page.props.coinPackage)
const logout = () => {
  router.post('/logout')
}
</script>

<template>
<div class="max-w-4xl mx-auto p-4 sm:p-6">

  <!-- Header -->
  <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
    <h1 class="text-2xl font-bold text-gray-800">
      Profil Pengguna
    </h1>

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

  <button
      @click="logout"
      class="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition w-full sm:w-auto"
    >
      Logout
    </button>

  <!-- Tombol Edit -->
  <div class="flex justify-end mt-8">
    <Link
      :href="`/profile/edit/${userData.username}`"
      class="px-6 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition font-medium w-full sm:w-auto text-center"
    >
      Edit Data
    </Link>
  </div>

  <!-- Coin Packages -->
  <div
    v-if="page.props.coinPackage && page.props.coinPackage.length > 0"
    class="bg-white shadow-md rounded-xl p-6 border border-gray-100 mt-6"
  >
    <h2 class="text-lg font-semibold text-gray-700 mb-4">Paket Koin</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="pack in page.props.coinPackage"
        :key="pack.name"
        class="p-4 border rounded-lg shadow hover:shadow-md transition cursor-pointer flex flex-col justify-between"
      >
        <div>
          <h3 class="text-lg font-bold text-gray-800 mb-1">
            {{ pack.name }}
          </h3>

          <p class="text-gray-700">
            {{ pack.coinAmount }} koin
            <span
              v-if="pack.bonusCoin"
              class="text-green-600 font-semibold"
            >
              +{{ pack.bonusCoin }} bonus
            </span>
          </p>

          <p class="text-purple-600 font-bold mt-3 text-lg">
            Rp {{ pack.price.toLocaleString() }}
          </p>
        </div>

        <button
          class="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          @click="router.post('/coin/topup', { packageName: pack.name })"
        >
          Beli
        </button>
      </div>
    </div>
  </div>

</div>
</template>
