<script setup lang="ts">
import { WhenVisible, Link, usePage } from '@inertiajs/vue3';
import { SimplePaginatorDtoMetaContract } from '@adocasts.com/dto/types';
import ModalPurchaseEpisode from './ModalPurchaseEpisode.vue'
import Page from '#models/page';
import { ref, computed, watchEffect } from 'vue';
import { router } from '@inertiajs/vue3'

const props = defineProps<{
  episode: any,
  pages?: Page[]
  pagesMeta?: SimplePaginatorDtoMetaContract,
  showPurchaseModal: boolean,
  mustLogin?: boolean,
  purchased?: boolean
}>()

const pages = ref(props.pages ?? [])
const hasMorePages = computed(() => {
  if (!props.pagesMeta) return false
  const { currentPage, lastPage } = props.pagesMeta
  return currentPage < lastPage
})

watchEffect(() => (pages.value = props.pages ?? []))

const WhenVisibleParams = computed(() => ({
  only: ['pages', 'pagesMeta'],
  preserveUrl: true,
  data: {
    page: props.pagesMeta?.currentPage + 1,
  },
}))

const ScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// Tombol back
const backPage = () => {
  router.get(`/comic/show/${props.episode.comics.slug}`)
}
</script>

<template>
  <div class="relative min-h-screen w-full bg-gray-100 dark:bg-black pb-20">

    <!-- Modal -->
    <ModalPurchaseEpisode
      v-if="showPurchaseModal"
      :episode="episode"
      :mustLogin="mustLogin"
      :purchased="purchased"
    />

    <!-- Header dengan Back -->
    <header
      class="w-full sticky top-0 z-10 bg-white/80 dark:bg-black/70 backdrop-blur-md
             border-b border-gray-200 dark:border-neutral-800 py-4 shadow-sm"
    >
      <div class="max-w-3xl mx-auto flex items-center justify-between px-4">
        <!-- Tombol Back -->
        <button
          @click="backPage"
          class="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium
                 hover:text-gray-900 dark:hover:text-white transition"
        >
          ← Kembali
        </button>
        <!-- Episode Title -->
        <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-200 truncate">
          {{ episode.title }}
        </h1>
        <!-- Placeholder untuk keseimbangan flex -->
        <div class="w-20"></div>
      </div>
    </header>

    <!-- Pages -->
    <div class="w-full flex flex-col justify-center items-center max-w-3xl mx-auto px-4 mt-6 space-y-8">
      <div
        v-for="page in pages"
        :key="page.id"
        class="w-full flex justify-center"
      >
        <div class="w-full overflow-hidden rounded-xl shadow-lg bg-white dark:bg-neutral-800">
          <img
            :src="encodeURI(page.imageUrl)"
            class="w-full h-auto object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <!-- Scroll To Top Button -->
    <button
      @click="ScrollToTop"
      class="fixed bottom-6 left-6 bg-white dark:bg-neutral-900 p-3 rounded-full shadow-lg border border-gray-200 dark:border-neutral-700 hover:scale-105 transition"
    >
      <img
        src="/inertia/assets/scrollToTopButton.png"
        class="w-6 h-6 object-contain"
        alt="Button Scroll To Top"
      />
    </button>

    <!-- Infinite Scroll -->
    <div v-if="hasMorePages" class="w-full flex justify-center py-10">
      <WhenVisible :params="WhenVisibleParams">
        <template #fallback>
          <div class="animate-spin w-6 h-6 text-gray-500">⟳</div>
        </template>
      </WhenVisible>
    </div>

    <!-- Comment Button -->
    <Link
      :href="`/comment/index/comic/${episode.comics.slug}/episode/${episode.slug}`"
      class="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
    >
      💬
    </Link>
  </div>
</template>
