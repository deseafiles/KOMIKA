<script setup lang="ts">
import { useForm, Link } from '@inertiajs/vue3'
import { ref } from 'vue'

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

const preview = ref<string | null>(null)

const handleThumbnailChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0] || null
  form.thumbnailUrl = file
  preview.value = file ? URL.createObjectURL(file) : null
}

const submit = () => {
  form.clearErrors()

  if (form.episodeNumber !== null && Number(form.episodeNumber) < 1) {
    form.setError('episodeNumber', 'Number cannot be negative')
    return
  }

  if (form.coinPrice !== null && Number(form.coinPrice) < 0) {
    form.setError('coinPrice', 'Coin price cannot be negative')
    return
  }

  form.post(`/episode/${props.comic.slug}/store`, {
    forceFormData: true,
    onSuccess: () => {
      console.log('Episode berhasil disimpan')
      form.reset()
      preview.value = null
    },
    onError: (errors) => console.error(errors)
  })
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">Tambah Episode</h1>

    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      <form @submit.prevent="submit" class="space-y-5">

        <!-- Judul Episode -->
        <div>
          <label class="block font-medium text-gray-700 mb-1">Judul Episode</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Masukkan judul episode"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
          />
          <span v-if="form.errors.title" class="text-red-500 text-sm">{{ form.errors.title }}</span>
        </div>

        <!-- Nomor Episode -->
        <div>
          <label class="block font-medium text-gray-700 mb-1">Nomor Episode</label>
          <input
            v-model="form.episodeNumber"
            type="number"
            placeholder="Misal: 1"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
          />
          <span v-if="form.errors.episodeNumber" class="text-red-500 text-sm">{{ form.errors.episodeNumber }}</span>
        </div>

        <!-- Tanggal Publish -->
        <div>
          <label class="block font-medium text-gray-700 mb-1">Tanggal Publish</label>
          <input
            v-model="form.publishedAt"
            type="date"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
          />
          <span v-if="form.errors.publishedAt" class="text-red-500 text-sm">{{ form.errors.publishedAt }}</span>
        </div>

        <!-- Thumbnail Episode -->
        <div>
          <label class="block font-medium text-gray-700 mb-1">Thumbnail Episode</label>

          <div v-if="preview" class="mb-2">
            <img :src="preview" alt="Thumbnail Preview" class="w-32 h-32 object-cover rounded-lg border"/>
          </div>

          <input
            type="file"
            accept="image/*"
            @change="handleThumbnailChange"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
          />
          <span v-if="form.errors.thumbnailUrl" class="text-red-500 text-sm">{{ form.errors.thumbnailUrl }}</span>
        </div>

        <!-- Harga Koin -->
        <div>
          <label class="block font-medium text-gray-700 mb-1">Harga Koin</label>
          <input
            v-model="form.coinPrice"
            type="number"
            placeholder="Masukkan harga koin"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
          />
          <span v-if="form.errors.coinPrice" class="text-red-500 text-sm">{{ form.errors.coinPrice }}</span>
        </div>

        <!-- Tombol Aksi -->
        <div class="flex justify-end gap-3 mt-6">
          <Link
            :href="`/episode/${props.comic.slug}/index`"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Simpan
          </button>
        </div>

      </form>
    </div>
  </div>
</template>
