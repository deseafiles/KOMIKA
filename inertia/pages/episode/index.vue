<!-- resources/js/Pages/Episode/Index.vue -->
<script setup lang="ts">
import { Link } from '@inertiajs/vue3'

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
  comic: Comic,
  episodes: Episode[]
}>()
console.log(props.comic.slug)
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">

    <!-- Judul komik dan tombol tambah -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">
        Episode — {{ props.comic.title }}
      </h1>

      <Link
        :href="`/episode/${props.comic.slug}/create`"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Tambah Episode
      </Link>
    </div>

    <!-- Table card -->
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
            <!-- Nomor Episode -->
            <td class="p-3 font-medium text-gray-800">
              #{{ ep.episodeNumber }}
            </td>

            <!-- Judul Episode -->
            <td class="p-3">
              {{ ep.title }}
            </td>

            <!-- Tanggal rilis -->
            <td class="p-3 text-gray-700">
              <span v-if="ep.publishedAt">
                {{ new Date(ep.publishedAt).toLocaleDateString() }}
              </span>
              <span v-else class="text-gray-400">Belum rilis</span>
            </td>

            <!-- Harga -->
            <td class="p-3 text-gray-700">
              {{ ep.coinPrice }} Coin
            </td>

            <!-- Status -->
            <td class="p-3">
              <span
                :class="{
                  'text-green-600 font-medium': ep.isPublished,
                  'text-yellow-600 font-medium': !ep.isPublished,
                }"
              >
                {{ ep.isPublished ? 'Published' : 'Draft' }}
              </span>
            </td>

            <!-- Aksi -->
            <td class="p-3 text-right">
              <div class="inline-flex gap-3">

                <!-- View Episode -->
                <Link
                  :href="`/pages/${props.comic.slug}/create/${ep.slug}`"
                  class="text-indigo-600 hover:underline text-sm font-medium"
                >
                  Tambah Chapter
                </Link>

                <!-- Edit Episode -->
                <Link
                  :href="`/episode/edit/${ep.slug}`"
                  class="text-gray-700 hover:underline text-sm font-medium"
                >
                  Edit
                </Link>

              </div>
            </td>

          </tr>
        </tbody>
      </table>

      <!-- Jika belum ada episode -->
      <div
        v-if="props.episodes.length === 0"
        class="text-center py-10 text-gray-500"
      >
        Belum ada episode.
        <Link
          :href="`/episode/create/${props.comic.slug}`"
          class="text-indigo-600 underline ml-1"
        >
          Buat sekarang
        </Link>
      </div>

    </div>
  </div>
</template>
