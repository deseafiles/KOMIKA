<script setup lang="ts">
import ComicCard from '~/components/comic/comicCard.vue'
import { Head, Link } from '@inertiajs/vue3'

interface Comic {
  userId: number,
  id: number
  title: string
  description?: string
  coverUrl?: string
  status: string
}

const props = defineProps<{
  listComicByCreator: Comic[]
}>()

function handleEdit(id: number) {
  console.log('Edit comic', id)
  // nanti bisa diarahkan ke router.visit(`/comic/${id}/edit`)
}

function handleDelete(id: number) {
  console.log('Delete comic', id)
  // nanti bisa tambahkan konfirmasi + delete request ke backend
}
</script>

<template>
  <Head title="My Comics" />

  <section class="max-w-7xl mx-auto px-6 py-10">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">My Comics</h1>
      <Link
        href="/comic/create"
        class="inline-block bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200"
      >
        + Add Comic
      </Link>
    </div>

    <!-- Daftar Komik -->
    <div
      v-if="props.listComicByCreator && props.listComicByCreator.length"
      class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      <ComicCard
        v-for="comic in props.listComicByCreator"
        :key="comic.id"
        :comic="comic"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- State Kosong -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50"
    >
      <p class="text-lg text-gray-600 mb-3">Belum ada komik yang kamu buat.</p>
      <Link
        href="/comic/create"
        class="text-violet-600 font-semibold hover:underline"
      >
        Tambah sekarang
      </Link>
    </div>
  </section>
</template>
