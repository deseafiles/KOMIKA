<script setup lang="ts">
import { useForm, Link } from '@inertiajs/vue3'

const props = defineProps({
  coin: {
    type: Object,
  }
})

const form = useForm({
  name: props.coin.name,
  coinAmount: props.coin.coinAmount,
  price: props.coin.price,
  bonusCoin: props.coin.bonusCoin,
})

const submit = () => {
  form.put(`/admin/coin/update/${props.coin.id}`)
}

const goBack = () => {
  window.history.back()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Edit Paket Koin</h1>

    <div class="bg-white shadow rounded-2xl p-6 max-w-lg">
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium mb-1">Nama Paket</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border-gray-300 rounded-lg p-2 focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Jumlah Koin</label>
          <input
            v-model="form.coinAmount"
            type="number"
            class="w-full border-gray-300 rounded-lg p-2 focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Harga (Rp)</label>
          <input
            v-model="form.price"
            type="number"
            class="w-full border-gray-300 rounded-lg p-2 focus:ring focus:ring-indigo-200"
          />
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Bonus Koin</label>
          <input
            v-model="form.bonusCoin"
            type="number"
            class="w-full border-gray-300 rounded-lg p-2 focus:ring focus:ring-indigo-200"
          />
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button
            @click="goBack"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Perbarui
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

