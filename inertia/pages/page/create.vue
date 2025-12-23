<script setup lang="ts">
import { useForm, Link, router } from '@inertiajs/vue3'
import { ref } from 'vue'

const props = defineProps({
  episode: {
    type: Object,
    required: true
  }
})

const previews = ref<{ file: File; page: number; id?: number }[]>([])

const form = useForm({
  imageUrl: [] as File[],
  pageNumber: 1
})

const getPreview = (file: File) => URL.createObjectURL(file)

// Upload file baru
const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files) return

  const files = Array.from(target.files)

  const startIndex = previews.value.length
  previews.value.push(
    ...files.map((file, index) => ({
      file,
      page: startIndex + index + 1
    }))
  )

  form.imageUrl = previews.value.map((p) => p.file)
}

// Update urutan halaman
const updateOrder = () => {
  previews.value.sort((a, b) => a.page - b.page)
  form.imageUrl = previews.value.map((p) => p.file)
}

// Hapus page (local atau server)
const removePage = (item: { file: File; page: number; id?: number }, index: number) => {
  // Kalau page sudah tersimpan di server
  if (item.id) {
    router.delete(`/pages/destroy/${item.id}`, {
      onSuccess: () => {
        previews.value.splice(index, 1)
      }
    })
  } else {
    // Hapus file baru
    previews.value.splice(index, 1)
    form.imageUrl = previews.value.map((p) => p.file)
  }
}

// Submit form
const submit = () => {
  updateOrder()

  form.post(`/pages/${props.episode.comicSlug}/store/${props.episode.episodeSlug}`, {
    forceFormData: true,
    onSuccess: () => console.log('Pages berhasil diupload'),
  })
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

    <form @submit.prevent="submit" class="space-y-6">
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
          Kamu bisa upload banyak gambar sekaligus. Urutannya mengikuti urutan file yang dipilih atau diubah oleh kamu.
        </p>

        <!-- Preview -->
        <div v-if="previews.length" class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div
            v-for="(item, index) in previews"
            :key="index"
            class="border rounded-md overflow-hidden shadow-sm p-2 bg-white"
          >
            <img
              :src="getPreview(item.file)"
              class="w-full h-48 object-cover"
            />

            <div class="flex items-center justify-between mt-2">
              <p class="text-xs truncate">{{ item.file.name }}</p>
              <input
                type="number"
                v-model.number="item.page"
                min="1"
                class="w-16 border px-2 py-1 text-sm rounded"
                @input="updateOrder"
              />
            </div>

            <button
              type="button"
              class="mt-2 w-full text-red-600 text-sm border border-red-200 rounded px-2 py-1 hover:bg-red-50"
              @click="removePage(item, index)"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>

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
