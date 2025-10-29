<script setup lang="ts">
interface DashboardProps {
  comicCount: number
  userCount: number
  totalRevenue: number
}

const props = defineProps<DashboardProps>()
</script>


<template>
  <div>
    total komik
    {{ comicCount }}
  </div>

  <div>
    total user
    {{ userCount }}
  </div>

  <div>
    total pendapatan
    {{ totalRevenue }}
  </div>
</template>
