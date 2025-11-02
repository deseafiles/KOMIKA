<script setup lang="ts">
interface Comic {
  id: number
  title: string
  slug: string
  description: string
  coverUrl: string
}

const props = defineProps<{
  listComicByCreator: Comic[]
}>()
</script>

<template>
  <div class="flex flex-col min-h-screen justify-start items-center pt-24 bg-purple-50 dark:bg-neutral-900">
    <h1 class="border-y-2 text-2xl font-bold text-black dark:text-white py-2">
      Daftar Komik Kamu
    </h1>

    <!-- Jika belum ada komik -->
    <div v-if="!props.listComicByCreator.length" class="py-10 text-gray-600 dark:text-gray-300">
      Belum ada komik yang kamu buat.
    </div>

    <!-- Jika ada komik -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-10 w-11/12 max-w-6xl"
    >
      <div
        v-for="comic in props.listComicByCreator"
        :key="comic.id"
        class="bg-white dark:bg-neutral-800 border-2 border-black dark:border-neutral-700 rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden"
      >
        <!-- Gambar cover -->
        <img
          v-if="comic.coverUrl"
          :src="comic.coverUrl"
          alt="Cover Komik"
          class="w-full h-56 object-cover"
        />
        <div
          v-else
          class="w-full h-56 bg-gray-200 dark:bg-neutral-700 flex items-center justify-center text-gray-500"
        >
          Tidak ada cover
        </div>

        <!-- Info komik -->
        <div class="p-4">
          <h2 class="text-xl font-semibold text-purple-700 dark:text-purple-300">
            {{ comic.title }}
          </h2>
          <p class="text-gray-700 dark:text-gray-300 text-sm mt-2 line-clamp-3">
            {{ comic.description }}
          </p>
          <a
            :href="`/comic/show/${comic.slug}`"
            class="inline-block mt-4 px-4 py-1.5 text-sm bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          >
            Lihat Detail
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
