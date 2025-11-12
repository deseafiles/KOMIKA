<script setup>
import { Link } from '@inertiajs/vue3'
import SideBar from '~/components/ui/SideBar.vue';

const props = defineProps({
  coinPackage: {
    type: Array,
  }
})
</script>

<template>
  <SideBar>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Paket Koin</h1>
      <Link
        href="/admin/coin/create"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        + Tambah Paket
      </Link>
    </div>

    <div class="bg-white shadow rounded-2xl overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama Paket</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Jumlah Koin</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Harga (Rp)</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bonus</th>
            <th class="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100">
          <tr v-for="c in coinPackage" :key="c.id" class="hover:bg-gray-50">
            <td class="px-6 py-3 font-medium text-gray-800">{{ c.name }}</td>
            <td class="px-6 py-3 text-gray-600">{{ c.coinAmount }}</td>
            <td class="px-6 py-3 text-gray-600">Rp {{ c.price.toLocaleString('id-ID') }}</td>
            <td class="px-6 py-3 text-gray-600">{{ c.bonusCoin }}</td>
            <td class="px-6 py-3 text-center space-x-2">
              <Link
                :href="`/admin/coin/edit/${c.id}`"
                class="text-indigo-600 hover:underline text-sm font-medium"
              >
                Edit
              </Link>
              <Link
                :href="`/admin/coin/destroy/${c.id}`"
                method="delete"
                as="button"
                class="text-red-600 hover:underline text-sm font-medium"
                preserve-scroll
              >
                Hapus
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  </SideBar>
</template>
