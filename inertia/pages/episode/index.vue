<!-- resources/js/Pages/Episode/Show.vue -->
<script setup lang="ts">
interface Page {
  id: number
  imageUrl: string
  pageNumber: number
}

interface ComicGenre {
  id: number
  name: string
}

interface Comic {
  id: number
  title: string
  comicGenres: ComicGenre[]
}

interface Episode {
  id: number
  title: string
  slug: string
  episodeNumber: number
  comics: Comic
  pages: Page[]
}

const props = defineProps<{ episode: Episode }>()
</script>

<template>
  <div class="flex flex-col items-center bg-gray-50 min-h-screen">
    <h1 class="text-2xl font-bold mt-6 mb-4">
      {{ props.episode.comics.title }} — Episode {{ props.episode.episodeNumber }}
    </h1>

    <div class="text-gray-500 mb-4">
      Genre:
      <span
        v-for="genre in props.episode.comics.comicGenres"
        :key="genre.id"
        class="mr-2"
      >
        {{ genre.name }}
      </span>
    </div>

    <div class="flex flex-col gap-6 w-full max-w-xl">
      <div
        v-for="page in props.episode.pages"
        :key="page.id"
        class="border rounded shadow-sm overflow-hidden"
      >
        <img
          :src="page.imageUrl"
          :alt="`Page ${page.pageNumber}`"
          class="w-full object-contain"
        />
      </div>
    </div>
  </div>
</template>
