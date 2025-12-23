<script setup lang="ts">
import { Link, router, useForm } from '@inertiajs/vue3'
import { ref } from 'vue'

interface Episode {
  id: number
  title: string
  slug: string
  episodeNumber: number
  publishedAt: string | null
  isPublished: boolean
  coinPrice: number
}

interface Comic {
  id: number
  title: string
  slug: string
}

const props = defineProps<{
  comic: Comic
  episodes: Episode[]
}>()

const form = useForm({})
const openDropdown = ref<number | null>(null)

const toggleDropdown = (id: number) => {
  openDropdown.value = openDropdown.value === id ? null : id
}

const closeDropdown = () => {
  openDropdown.value = null
}

const deleteEpisode = (slug: string) => {
  form.delete(`/episode/delete/${slug}`)
  closeDropdown()
}

const goBack = () => {
  router.get('/comic/index')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="flex justify-between items-center mb-6">
      <button @click="goBack" class="">
        Kembali
      </button>
      <h1 class="text-3xl font-bold text-gray-800">Episode — {{ props.comic.title }}</h1>
      <Link
        :href="`/episode/${props.comic.slug}/create`"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Tambah Episode
      </Link>
    </div>

    <div class="bg-white shadow rounded-2xl p-6">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b text-gray-600">
            <th class="p-3">Episode</th>
            <th class="p-3">Judul</th>
            <th class="p-3">Rilis</th>
            <th class="p-3">Harga</th>
            <th class="p-3">Status</th>
            <th class="p-3 text-right">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="ep in props.episodes"
            :key="ep.id"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="p-3 font-medium text-gray-800">#{{ ep.episodeNumber }}</td>
            <td class="p-3">{{ ep.title }}</td>
            <td class="p-3 text-gray-700">
              <span v-if="ep.publishedAt">{{ new Date(ep.publishedAt).toLocaleDateString() }}</span>
              <span v-else class="text-gray-400">Belum rilis</span>
            </td>
            <td class="p-3 text-gray-700">{{ ep.coinPrice }} Coin</td>
            <td class="p-3">
              <span :class="{
                'text-green-600 font-medium': ep.isPublished,
                'text-yellow-600 font-medium': !ep.isPublished
              }">
                {{ ep.isPublished ? 'Published' : 'Draft' }}
              </span>
            </td>

            <td class="p-3 text-right relative">
              <!-- Trigger -->
              <button
                @click="toggleDropdown(ep.id)"
                class="flex justify-center items-center size-9 rounded-lg border bg-white hover:bg-gray-100"
              >
                ⋮
              </button>

              <!-- Dropdown -->
              <div
                v-if="openDropdown === ep.id"
                class="absolute right-0 mt-2 w-44 bg-white shadow-lg border border-gray-200 rounded-lg p-1 z-50"
              >
                <Link
                  :href="`/episode/edit/${ep.slug}`"
                  class="block px-4 py-2 text-sm hover:bg-gray-100"
                  @click="closeDropdown"
                >
                  Edit Episode
                </Link>

                <Link
                  :href="`/pages/${props.episodes[0].id}/edit`"
                  class="block px-4 py-2 text-sm hover:bg-gray-100"
                  @click="closeDropdown"
                >
                  Edit Chapter
                </Link>

                <Link
                  :href="`/pages/${props.comic.slug}/create/${ep.slug}`"
                  class="block px-4 py-2 text-sm hover:bg-gray-100"
                  @click="closeDropdown"
                >
                  Tambah Chapter
                </Link>

                <button
                  @click="deleteEpisode(ep.slug)"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Hapus Episode
                </button>
              </div>
            </td>

          </tr>
        </tbody>
      </table>

      <div v-if="props.episodes.length === 0" class="text-center py-10 text-gray-500">
        Belum ada episode.
      <Link
        :href="`/episode/${props.comic.slug}/create`"
        class="text-indigo-600 underline ml-1">
          Buat sekarang
        </Link>
      </div>
    </div>
  </div>
</template>
