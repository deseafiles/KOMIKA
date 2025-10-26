<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'

interface Genre {
  id: number
  name: string
}

interface User {
  id: number
  username: string
}

interface Creator {
  id: number
  users: User
}

interface Comic {
  id: number
  title: string
  description: string
  coverUrl: string | null
  status: string
  updateDay: string
  comicGenres: Genre[]
  creators: Creator
}

const props = defineProps<{
  allComic: Comic[]
}>()
</script>

<template>
  <Head title="Home" />
    <!--<pre>{{ props.allComic }}</pre> -->

  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Daftar Komik</h1>

    <div
      v-if="props.allComic.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="comic in props.allComic"
        :key="comic.id"
        class="bg-white dark:bg-zinc-800 rounded-xl shadow p-4 hover:shadow-lg transition"
      >
        <Link
          :href="`/comic/${comic.id}`"
          class="block overflow-hidden rounded-lg"
        >
          <img
            :src="comic.coverUrl || '/placeholder.png'"
            alt="Cover"
            class="w-full h-56 object-cover rounded-md"
          />
        </Link>

        <div class="mt-3">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {{ comic.title }}
          </h2>

          <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {{ comic.description || 'Tidak ada deskripsi.' }}
          </p>

          <div class="mt-2 flex flex-wrap gap-1">
            <span
              v-for="genre in comic.comicGenres"
              :key="genre.id"
              class="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded-full"
            >
              {{ genre.name }}
            </span>
          </div>

          <div class="mt-2 text-xs text-gray-600 dark:text-gray-300">
            <span>👤 {{ comic.creators?.users?.username }}</span>
          </div>

          <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>Status: {{ comic.status }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-500 dark:text-gray-300 text-center">
      Belum ada komik tersedia.
    </div>
  </div>
</template>
