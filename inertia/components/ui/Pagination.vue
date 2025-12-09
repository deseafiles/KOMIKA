<script setup>
import { Link } from '@inertiajs/vue3'

const props = defineProps({
  meta: Object
})

const getPageNumbers = () => {
  const current = props.meta.currentPage
  const last = props.meta.lastPage
  const pages = []

  const startPage = Math.max(1, current - 2)
  const endPage = Math.min(last, current + 2)

  if (startPage > 1) {
    pages.push(1)
    if (startPage > 2) pages.push('...')
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (endPage < last) {
    if (endPage < last - 1) pages.push('...')
    pages.push(last)
  }

  return pages
}
</script>

<template>
  <nav class="flex justify-center items-center gap-2 my-10 flex-wrap">
    <!-- Prev Button -->
    <Link
      :href="props.meta.currentPage > 1 ? props.meta.previousPageUrl : '#'"
      class="px-3 py-2 rounded bg-gray-200 dark:bg-zinc-700 transition hover:bg-gray-300 dark:hover:bg-zinc-600"
      :class="{
        'opacity-40 pointer-events-none cursor-not-allowed': props.meta.currentPage <= 1
      }"
    >
      ← Prev
    </Link>

    <!-- Page Numbers -->
    <div class="flex gap-1">
      <template v-for="page in getPageNumbers()" :key="page">
        <span v-if="page === '...'" class="px-2 py-2">...</span>
        <Link
          v-else
          :href="`${page === 1 ? props.meta.firstPageUrl : (page === props.meta.lastPage ? props.meta.lastPageUrl : `/?page=${page}`)}`"
          class="px-3 py-2 rounded transition"
          :class="{
            'bg-indigo-600 text-white dark:bg-indigo-500': props.meta.currentPage === page,
            'bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600': props.meta.currentPage !== page
          }"
        >
          {{ page }}
        </Link>
      </template>
    </div>

    <!-- Next Button -->
    <Link
      :href="props.meta.currentPage < props.meta.lastPage ? props.meta.nextPageUrl : '#'"
      class="px-3 py-2 rounded bg-gray-200 dark:bg-zinc-700 transition hover:bg-gray-300 dark:hover:bg-zinc-600"
      :class="{
        'opacity-40 pointer-events-none cursor-not-allowed': props.meta.currentPage >= props.meta.lastPage
      }"
    >
      Next →
    </Link>

    <!-- Info Text -->
    <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">
      {{ props.meta.currentPage }} / {{ props.meta.lastPage }}
    </span>
  </nav>
</template>
