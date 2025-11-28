<script setup lang="ts">
import {Link, useForm, Head, router } from '@inertiajs/vue3'
import { ref } from 'vue'

const props = defineProps({
  listComicByCreator: {
    type: Object,
  }
})

const form = useForm({})
const isOpen = ref<number | null>(null)

const toggleDropdown = (id: number) => {
  isOpen.value = isOpen.value === id ? null : id
}

const closeDropdown = () => {
  isOpen.value = null
}

const deleteComic = (slug: string) => {
  form.delete(`/comic/destroy/${slug}`)
  closeDropdown()
}

const goBack = () => {
  router.get('/')
}
</script>

<template>
    <Head title="Komik Saya" />

  <div class="min-h-screen bg-gray-50 p-6">
    <header
      class="sticky top-0 z-10 bg-white/80 dark:bg-black/70 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 py-4 shadow-sm mb-6"
    >
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-center justify-between">
          <!-- Tombol Back -->
          <button
            @click="goBack"
            class="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium
                   hover:text-gray-900 dark:hover:text-white transition"
          >
            ← Kembali
          </button>

          <!-- Judul -->
          <h1 class="text-3xl font-bold text-gray-800">Daftar Komik Saya</h1>

          <!-- Tombol Tambah -->
          <Link href="/comic/create" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition">
            + Tambah Komik
          </Link>
        </div>
      </div>
    </header>

    <div class="max-w-6xl mx-auto">
      <div class="bg-white shadow rounded-2xl p-6">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b text-gray-600">
              <th class="p-3">Cover</th>
              <th class="p-3">Nama Komik</th>
              <th class="p-3">Deskripsi</th>
              <th class="p-3">Genre</th>
              <th class="p-3">Status</th>
              <th class="p-3 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="c in listComicByCreator"
              :key="c.id"
              class="border-b hover:bg-gray-50 transition"
            >
              <!-- Cover -->
              <td class="p-3">
                <img
                  v-if="c.coverUrl"
                  :src="c.coverUrl"
                  alt="Cover"
                  class="w-20 h-20 object-cover rounded"
                />

                <div
                  v-else
                  class="w-20 h-20 flex items-center justify-center text-center bg-gray-200 text-gray-600 text-sm rounded"
                >
                  Tidak ada cover
                </div>
              </td>

              <!-- Judul -->
              <td class="p-3 font-medium text-gray-800">
                {{ c.title }}
              </td>

              <!-- Deskripsi -->
              <td class="p-3 text-gray-700 max-w-xs">
                {{ c.description }}
              </td>

              <!-- Genre -->
              <td class="p-3 text-gray-700">
                <span
                  v-if="c.comicGenres?.length"
                  class="flex flex-wrap gap-1"
                >
                  <span
                    v-for="g in c.comicGenres"
                    :key="g.id"
                    class="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs"
                  >
                    {{ g.name }}
                  </span>
                </span>

                <span v-else class="text-gray-400 text-sm">
                  Tidak ada genre
                </span>
              </td>

              <!-- Status -->
              <td class="p-3">
                <span
                  :class="{
                    'text-green-600 font-medium': c.status === 'Ongoing',
                    'text-yellow-600 font-medium': c.status === 'Hiatus',
                    'text-red-600 font-medium': c.status === 'Completed',
                  }"
                >
                  {{ c.status }}
                </span>
              </td>

              <!-- Aksi -->
              <td class="p-3 text-right relative">

                <!-- Trigger -->
                <button
                  @click="toggleDropdown(c.id)"
                  class="flex justify-center items-center size-9 rounded-lg border bg-white hover:bg-gray-100"
                >
                  <svg class="size-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>

                <!-- Dropdown -->
                <div
                  v-if="isOpen === c.id"
                  class="absolute right-0 mt-2 w-44 bg-white shadow-lg border border-gray-200 rounded-lg p-1 z-50"
                >
                  <Link
                    :href="`/comic/edit/${c.slug}`"
                    class="block px-4 py-2 text-sm hover:bg-gray-100"
                    @click="closeDropdown()"
                  >
                    Edit Komik
                  </Link>

                  <Link
                      :href="`/episode/${c.slug}/index`"
                    class="block px-4 py-2 text-sm hover:bg-gray-100"
                    @click="closeDropdown()"
                  >
                    Lihat Chapter
                  </Link>

                  <button
                    @click="deleteComic(c.slug)"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Hapus Komik
                  </button>
                </div>

              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
