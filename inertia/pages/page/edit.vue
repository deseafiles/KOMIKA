<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm, Link } from '@inertiajs/vue3'

const props = defineProps<{
  pages: { id: number; pageNumber: number; imageUrl: string }[]
  episode: { id: number; episodeNumber: number; comicSlug: string }
}>()

const previews = ref<{ id: number; page: number; url: string; file?: File }[]>(
  props.pages.map(p => ({
    id: p.id,
    page: p.pageNumber,
    url: p.imageUrl
  }))
)

const form = useForm({
  pages: [] as { id: number; pageNumber: number; file?: File }[]
})

const getPreview = (item: { file?: File; url: string }) => {
  return item.file ? URL.createObjectURL(item.file) : item.url
}

const handleFileUpload = (e: Event, index: number) => {
  const target = e.target as HTMLInputElement
  if (!target.files?.[0]) return
  previews.value[index].file = target.files[0]
}

const updateOrder = () => {
  previews.value.sort((a, b) => a.page - b.page)
}

const submit = () => {
  updateOrder()

  form.pages = previews.value.map(p => ({
    id: p.id,
    pageNumber: p.page,
    file: p.file
  }))

  form.put(`/pages/${props.episode.id}/update`, {
    forceFormData: true,
    onSuccess: () => console.log('Pages updated!'),
    onError: (errors) => console.error(errors)
  })
}

const goBack = () => {
  window.history.back()
}
</script>

<template>
  <div class="max-w-4xl mx-auto py-10">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        Edit Pages • Episode {{ props.episode.episodeNumber }}
      </h1>
      <button @click="goBack" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
        Kembali
      </button>
    </div>

    <form @submit.prevent="submit" class="space-y-6">
      <div v-if="previews.length" class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="(item, index) in previews" :key="item.id" class="border rounded-md overflow-hidden shadow-sm p-2 bg-white">
          <img :src="getPreview(item)" class="w-full h-48 object-cover" alt="Page Preview" />

          <div class="flex items-center justify-between mt-2 gap-2">
            <p class="text-xs truncate flex-1">{{ item.file?.name || 'Existing Image' }}</p>
            <input type="number" v-model.number="item.page" min="1" class="w-16 border px-2 py-1 text-sm rounded" @input="updateOrder" />
          </div>

          <input type="file" accept="image/*" @change="(e) => handleFileUpload(e as Event, index)" class="mt-2 w-full border px-2 py-1 rounded text-sm" />
        </div>
      </div>

      <div v-if="previews.length === 0" class="text-center py-10 text-gray-500">
        Belum ada halaman untuk episode ini.
      </div>

      <button type="submit" :disabled="form.processing || previews.length === 0" class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
        {{ form.processing ? 'Updating...' : 'Simpan Perubahan' }}
      </button>
    </form>
  </div>
</template>
