<script setup lang="ts">
  import {Link, useForm } from '@inertiajs/vue3'

  const props = defineProps({
  listComicByCreator: {
    type: Object,
  }
  })

  const form = useForm({})
console.log(props.listComicByCreator)
  const deleteComic = (slug: string) => {
    form.delete(`/comic/destroy/${slug}`)
  }
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800"> Daftar Komik Saya </h1>
      <Link href="/comic/create" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        Tambah Komik
      </Link>
    </div>

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
            <td class="p-3 text-right space-x-2">
              <Link
                :href="`/comic/edit/${c.slug}`"
                class="text-indigo-600 hover:underline"
              >
                Edit
              </Link>

              <button
                @click="deleteComic(c.slug)"
                class="text-red-600 hover:underline"
              >
                Hapus
              </button>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
