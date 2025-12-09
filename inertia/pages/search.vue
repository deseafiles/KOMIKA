<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { ref } from 'vue'
import Navbar from '~/components/ui/navbar.vue'
import Footer from '~/components/ui/footer.vue'

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
  slug: string
  description: string
  coverUrl: string | null
  status: string
  updateDay: string
  comicGenres: Genre[]
  creators: Creator
}

const props = defineProps<{
  keyword: string
  comics: Comic[]
}>()

// isi search bar (isi keyword jika ada)
const search = ref(props.keyword ?? '')

// submit form
const submitSearch = () => {
  router.get('/search', { q: search.value })
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Head title="Pencarian Komik" />
      <Navbar />

    <main class="container mx-auto px-4 py-8 flex-grow">
      <!-- SEARCH BAR -->
      <form @submit.prevent="submitSearch" class="mb-10">
        <div class="flex gap-3">
          <input
            v-model="search"
            type="text"
            placeholder="Cari komik berdasarkan judul atau author ..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600"
          />

          <button
            type="submit"
            class="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Cari
          </button>
        </div>
      </form>

      <!-- ============================= -->
      <!--       BELUM CARI APA-APA      -->
      <!-- ============================= -->
      <div v-if="!props.keyword" class="text-center text-gray-500 mt-20">
        <h2 class="text-xl font-semibold mb-2">Silakan cari komik</h2>
        <p>Masukkan kata kunci pada kolom pencarian di atas.</p>
      </div>

      <!-- ============================= -->
      <!--        ADA PENCARIANNYA       -->
      <!-- ============================= -->
      <div v-else>
        <!-- Header -->
        <div class="mb-6 text-gray-700">
          Hasil untuk: <strong>"{{ props.keyword }}"</strong> ({{ props.comics.length }} ditemukan)
        </div>

        <!-- Jika ada hasil -->
        <div
          v-if="props.comics.length"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <div
            v-for="comic in props.comics"
            :key="comic.id"
            class="bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
          >
            <Link :href="`/comic/show/${comic.slug}`">
              <img
                :src="comic.coverUrl || '/placeholder.png'"
                class="w-full h-56 object-cover rounded-md"
              />
            </Link>

            <div class="mt-3">
              <h2 class="text-lg font-semibold">{{ comic.title }}</h2>

              <p class="text-sm text-gray-500 line-clamp-2">
                {{ comic.description || 'Tidak ada deskripsi.' }}
              </p>

              <div class="mt-2 flex flex-wrap gap-1">
                <span
                  v-for="genre in comic.comicGenres"
                  :key="genre.id"
                  class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full"
                >
                  {{ genre.name }}
                </span>
              </div>

              <div class="mt-2 text-xs text-gray-600">
                👤 {{
                  comic.creators?.users?.username ||
                  'Tidak ada creator'
                }}
              </div>
            </div>
          </div>
        </div>

        <!-- Tidak ada hasil -->
        <div v-else class="text-center text-gray-500 mt-16">
          <h3 class="text-lg font-semibold">Tidak ada hasil ditemukan</h3>
          <p>Coba gunakan kata kunci yang berbeda.</p>
        </div>
      </div>
    </main>

    <footer class="mt-auto w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
      <Footer />
    </footer>

  </div>
</template>
