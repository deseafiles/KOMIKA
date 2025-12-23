<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { router } from '@inertiajs/vue3'

const props = defineProps<{ comic: any }>()

// LOCAL STATE (INI KUNCI)
const isFavorited = ref(!!props.comic.isFavorited)
const userRating = ref(props.comic.userRating ?? 0)

// sync kalau page reload
watch(
  () => props.comic.isFavorited,
  (val) => {
    isFavorited.value = !!val
  }
)

watch(
  () => props.comic.userRating,
  (val) => {
    userRating.value = val ?? 0
  }
)
onMounted(() => {
  // Re-validate rating dari server saat component mount
  if (props.comic.userRating !== undefined && props.comic.userRating !== null) {
    userRating.value = props.comic.userRating
  }
})

const toggleFavorite = () => {
  // update UI LANGSUNG
  isFavorited.value = !isFavorited.value

  router.post(
    `/comic/favorite/${props.comic.slug}`,
    {},
    {
      preserveScroll: true,
      preserveState: true,
    }
  )
}

const rateComic = (value: number) => {
  userRating.value = value

  router.post(
    `/comic/rating/${props.comic.slug}`,
    { rating_value: value },
    {
      preserveScroll: true,
      preserveState: true,
    }
  )
}

const readEpisode = (episodeSlug: string) => {
  router.get(`/episode/${props.comic.slug}/show/${episodeSlug}`)
}

const backPage = () => {
  router.get('/')
}
</script>

<template>
  <div class="flex flex-col min-h-screen justify-center items-center py-8 px-4">

    <!-- Tombol Back -->
    <div class="w-full max-w-2xl mb-4">
      <button
        @click="backPage"
        class="px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition flex items-center gap-2"
      >
        ← Kembali
      </button>
    </div>

    <!-- Cover -->
    <img
      :src="comic.coverUrl || '/placeholder.png'"
      alt="Cover"
      class="w-72 sm:w-80 aspect-[3/4] object-cover rounded-xl shadow-md border mb-5"
    />

    <!-- Judul -->
    <h1 class="text-black dark:text-white text-3xl font-bold text-center mb-3">
      {{ comic.title }}
    </h1>

    <!-- Deskripsi -->
    <p class="max-w-xl text-center text-gray-700 dark:text-gray-300 mb-4">
      {{ comic.description }}
    </p>

    <!-- Status -->
    <div class="text-purple-500 font-semibold mb-4 capitalize">
      {{ comic.status }}
    </div>

    <!-- Genre -->
    <div class="flex flex-wrap justify-center gap-2 mb-6">
      <span
        v-for="genre in comic.comicGenres"
        :key="genre.id"
        class="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full text-sm"
      >
        {{ genre.name }}
      </span>
    </div>

    <!-- Favorite dan Rating -->
    <div class="flex flex-col sm:flex-row items-center gap-4 mb-8">
      <button
        @click="toggleFavorite"
        class="flex items-center gap-1 text-lg font-medium transition hover:scale-105"
      >
        <span :class="isFavorited ? 'text-red-500' : 'text-gray-400'">❤️</span>
        <span class="text-gray-700 dark:text-gray-300">
          {{ isFavorited ? 'Favorited' : 'Add to Favorite' }}
        </span>
      </button>

      <div class="flex items-center">
        <button
          v-for="star in 5"
          :key="star"
          @click="rateComic(star)"
          class="text-2xl focus:outline-none transition-transform hover:scale-110"
        >
          <span :class="star <= userRating ? 'text-yellow-400' : 'text-gray-400'">★</span>
        </button>
      </div>
    </div>

    <!-- Episode List -->
    <div class="w-full max-w-2xl border-t border-gray-300 dark:border-gray-600 pt-4">
      <h3 class="text-lg font-semibold mb-3 text-black dark:text-white">
        Episode List
      </h3>
      <div
        v-for="episode in comic.episodes"
        :key="episode.id"
        class="border-b border-gray-200 dark:border-gray-700 py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 px-3 rounded transition"
      >
        <div class="flex items-center gap-3">
          <img
            v-if="episode.thumbnailUrl"
            :src="episode.thumbnailUrl"
            alt="Thumbnail"
            class="w-16 h-20 object-cover rounded"
          />
          <div v-else class="w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-sm text-gray-500">
            No Image
          </div>

          <div>
            <button
              @click="readEpisode(episode.slug)"
              class="text-left text-black dark:text-white font-medium hover:underline"
            >
              {{ episode.title }}
            </button>
            <div class="text-sm text-gray-500">
              {{ new Date(episode.publishedAt).toLocaleDateString() }}
            </div>
          </div>
        </div>

        <div class="text-gray-700 dark:text-gray-300 text-sm">
          {{ episode.coinPrice }} 💰
        </div>
      </div>
    </div>

  </div>
</template>
