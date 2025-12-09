<script setup>
import { useForm, Link } from '@inertiajs/vue3'

const form = useForm({
  name: '',
  coinAmount: '',
  price: '',
  bonusCoin: '',
})

const submit = () => {
  console.log("Dipencet")
  form.post('/admin/coin/store')
}

const goBack = () => {
  window.history.back()
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
    <!-- Judul -->
    <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Tambah Paket Koin</h1>

      <p v-if="form.errors.name" class="text-red-600 text-sm mt-1">
        {{ form.errors.name }}
      </p>

    <!-- Form Card -->
    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
      <form @submit.prevent="submit" class="space-y-5">
        <!-- Nama Paket -->
        <div>
          <label class="block font-medium text-gray-700 mb-1">Nama Paket</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Misal: Paket Besar"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
          />
        </div>

        <!-- Jumlah Koin -->
        <div>
          <label class="block font-medium text-gray-700 mb-1">Jumlah Koin</label>
          <input
            v-model="form.coinAmount"
            type="number"
            placeholder="Masukkan jumlah koin"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
          />
        </div>

        <!-- Harga -->
        <div>
          <label class="block font-medium text-gray-700 mb-1">Harga (Rp)</label>
          <input
            v-model="form.price"
            type="number"
            placeholder="Masukkan harga"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
          />
        </div>

        <!-- Bonus Koin -->
        <div>
          <label class="block font-medium text-gray-700 mb-1">Bonus Koin</label>
          <input
            v-model="form.bonusCoin"
            type="number"
            placeholder="Masukkan bonus koin (opsional)"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
          />
        </div>

        <!-- Tombol Aksi -->
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="goBack"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
