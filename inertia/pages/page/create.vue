
<script setup lang="ts">
import { useForm, Link, router } from '@inertiajs/vue3'
import { ref } from 'vue'

const props = defineProps({
  episode: {
    type: Object,
    required: true
  }
})
const previews = ref<File[]>([])
const getPreview = (file: File) => URL.createObjectURL(file)

const form = useForm({
  imageUrl: [] as File[],
  pageNumber: 1
})

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files) return

  const files = Array.from(target.files)
  form.imageUrl = files
  previews.value = files
}

const submit = () => {
  form.post(`/pages/${props.episode.comicSlug}/store/${props.episode.episodeSlug}`, {
    forceFormData: true,
  })
  console.log('berhasil')
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-10">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        Upload Pages • Episode {{ props.episode.episodeNumber }}
      </h1>

      <Link
        :href="`/episode/${props.episode.comicSlug}/index`"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
      >
        Kembali
      </Link>
    </div>

    <!-- Form -->
    <form @submit.prevent="submit" class="space-y-6">

      <!-- File Input -->
      <div>
        <label class="block text-sm font-medium mb-1">Upload Pages</label>

        <input
          type="file"
          multiple
          accept="image/*"
          class="block w-full border border-gray-300 rounded-md p-2"
          @change="handleFileUpload"
        />

        <p class="text-xs text-gray-500 mt-1">
          Kamu bisa upload banyak gambar sekaligus. Urutannya mengikuti urutan file yang dipilih.
        </p>

        <!-- Preview -->
        <div v-if="previews.length" class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div
            v-for="(file, index) in previews"
            :key="index"
            class="border rounded-md overflow-hidden shadow-sm"
          >
          <img
            :src="getPreview(file)"
            class="w-full h-48 object-cover"
          />
          <p class="text-xs p-2 truncate">{{ file.name }}</p>
          </div>
        </div>

      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        :disabled="form.processing"
      >
        {{ form.processing ? 'Uploading...' : 'Upload Pages' }}
      </button>

    </form>
  </div>
</template>


