<script setup lang="ts">
interface Comic {
  id: number
  title: string
  description?: string
  coverUrl?: string
  status: string
}

const props = defineProps<{
  comic: Comic
}>()
</script>

<template>
  <div class="max-w-sm w-full lg:max-w-full lg:flex">
    <div
      class="h-48 lg:h-auto lg-w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
    >
      <div class="w-full h-full object-cover">
        <img v-if="comic.coverUrl" :src="comic.coverUrl" :alt="comic.title" />
      </div>
    </div>

    <div
      class="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal"
    >
      <div class="mb-8">
        <p class="text-sm text-violet-600 flex items-center">
          {{ comic.status }}
        </p>

        <div class="text-grey-900 font-bold text-xl mb-2">
          {{ comic.title }}
        </div>
        <p class="text-gray-700 text-base">
          {{ comic.description }}
        </p>
      </div>
    </div>
  </div>
</template>
