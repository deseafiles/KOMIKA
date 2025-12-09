<script setup lang="ts">
import SideBar from '~/components/ui/SideBar.vue';

interface DashboardProps {
  comicCount: number
  userCount: number,
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
        <h2 class="text-gray-600 font-semibold">Total Pendapatan Koin</h2>
        <p class="text-4xl font-bold mt-2 text-yellow-500">{{ totalRevenue }} </p>
      </div>
    </div>

  </div>
  </SideBar>
</template>

