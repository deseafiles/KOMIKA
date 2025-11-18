<script setup lang="ts">
  import { WhenVisible } from '@inertiajs/vue3';
  import { SimplePaginatorDtoMetaContract } from '@adocasts.com/dto/types';
  import { Loader2 } from 'lucide-vue-next'
import Page from '#models/page';
import {computed, ref, watchEffect} from 'vue';

const props = defineProps<{
    pages: Page[]
    pagesMeta: SimplePaginatorDtoMetaContract
  }>()

const pages = ref(props.pages)
const hasMorePages = computed(() => {
  const { currentPage, lastPage } = props.pagesMeta
  return currentPage < lastPage
})

watchEffect(() => (pages.value = props.pages))

const WhenVisibleParams = computed(() => {
  const params = {
    only: ['pages', 'pagesMeta'],
    preserveUrl: true,
    data: {
      page: props.pagesMeta.currentPage + 1,
    },
  }
  console.log('WhenVisibleParams:', params)
  return params
})
console.log(pages)
</script>

<template>
  <div class="min-h-screen w-full flex flex-col items-center bg-gray-100 dark:bg-black pb-20">
    <header
      class="w-full sticky top-0 z-10 bg-white/80 dark:bg-black/70 backdrop-blur-md
             border-b border-gray-200 dark:border-neutral-800 py-4 shadow-sm"
    >
      <div class="max-w-3xl mx-auto text-center px-4">
        <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-200">
          Episode
        </h1>
      </div>
    </header>

    <div class="w-full max-w-3xl px-4 mt-6 space-y-8">
      <div
        v-for="(page, index) in pages"
        :key="index"
        class="w-full flex justify-center"
      >
        <div class="w-full overflow-hidden rounded-xl shadow-lg bg-white dark:bg-neutral-800">
          <img
            :src="encodeURI(page.imageUrl)"
            class="w-full h-auto object-contain transition-opacity duration-300"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <div v-if="hasMorePages" class="w-full flex justify-center py-10">
      <WhenVisible :params="WhenVisibleParams">
        <template #fallback>
          <Loader2 class="animate-spin w-6 h-6 text-gray-500" />
        </template>
      </WhenVisible>
    </div>
  <Link
    :href="`#`"
    class="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-all"
  >
  💬
</Link>
    <div class="text-center text-gray-400 dark:text-gray-600 py-10 text-sm">
      Halaman {{ pagesMeta.currentPage }} dari {{ pagesMeta.lastPage }} - Selesai
    </div>
  </div>
</template>
