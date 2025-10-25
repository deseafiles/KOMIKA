<script setup lang="ts">
  interface Comic {
  id: number,
  title: string,
  description?: string,
  coverUrl?:string,
  status: string,
  genre: string,
  episodes: [],
  }

const props = defineProps<{
  comic: Comic
}>()
</script>

<template>
  <p class="text-3xl font-bold">{{ comic.title }}</p>
</template>
