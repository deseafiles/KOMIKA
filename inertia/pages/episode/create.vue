<script setup lang="ts">
import { useForm, Link } from '@inertiajs/vue3'

const props = defineProps({
  comic: {
    type: Object,
    required: true
  }
})

const form = useForm({
  comicId: props.comic.id,
  title: '',
  episodeNumber: '',
  publishedAt: '',
  thumbnailUrl: null,
  coinPrice: '',
})

const submit = () => {
  form.post(`/episode/${props.comic.slug}/store`, {
    forceFormData: true,
    onSuccess: () => {
      console.log('Episode berhasil disimpan')
    }
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Tambah Episode</h1>

    <div class="bg-white shadow rounded-2xl p-6 max-w-lg">
      <form @submit.prevent="submit" class="space-y-4">

        <!-- Judul -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Judul Episode</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full border-gray-300 rounded-lg p-2"
          />
        </div>

        <!-- Episode Number -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Nomor Episode</label>
          <input
            v-model="form.episodeNumber"
            type="number"
            class="w-full border-gray-300 rounded-lg p-2"
          />
        </div>

        <!-- Published At -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Tanggal Publish</label>
          <input
            v-model="form.publishedAt"
            type="date"
            class="w-full border-gray-300 rounded-lg p-2"
          />
        </div>

        <!-- Thumbnail -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Thumbnail Episode</label>
          <input
            type="file"
            @change="form.thumbnailUrl = $event.target.files[0]"
            class="w-full border-gray-300 rounded-lg p-2"
          />
        </div>

        <!-- Coin Price -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Harga Koin</label>
          <input
            v-model="form.coinPrice"
            type="number"
            class="w-full border-gray-300 rounded-lg p-2"
          />
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <Link :href="`/episode/${comic.slug}/index`" class="px-4 py-2 bg-gray-200 rounded-lg">
            Batal
          </Link>

          <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
