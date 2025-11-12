<script setup lang="ts">
import SideBar from '~/components/ui/SideBar.vue';

interface DashboardProps {
  comicCount: number
  userCount: number
  totalRevenue: number
}

const props = defineProps<DashboardProps>()
</script>


<template>
  <SideBar>
  <div class="min-h-screen bg-gray-50 p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Dashboard Admin</h1>

    <div class="grid md:grid-cols-3 gap-6">
      <div class="bg-white rounded-2xl shadow p-6">
        <h2 class="text-gray-600 font-semibold">Total Komik Dibuat</h2>
        <p class="text-4xl font-bold mt-2 text-indigo-600">{{ comicCount }}</p>
      </div>

      <div class="bg-white rounded-2xl shadow p-6">
        <h2 class="text-gray-600 font-semibold">Total Pengguna</h2>
        <p class="text-4xl font-bold mt-2 text-red-500">{{ userCount }}</p>
      </div>

      <div class="bg-white rounded-2xl shadow p-6">
        <h2 class="text-gray-600 font-semibold">Total Pendapatan</h2>
        <p class="text-4xl font-bold mt-2 text-yellow-500">{{ totalRevenue }} </p>
      </div>
    </div>

    <div class="mt-10 bg-white rounded-2xl shadow p-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">Aktivitas Terbaru</h2>
      <ul class="divide-y divide-gray-100">
        <li v-for="i in 5" :key="i" class="py-3 flex justify-between text-gray-600">
          <span>Pengguna #{{ i }} membuat komik</span>
          <span class="text-sm text-gray-400">5 menit lalu</span>
        </li>
      </ul>
    </div>
  </div>
  </SideBar>
</template>

