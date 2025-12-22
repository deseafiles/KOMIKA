<script setup lang="ts">
import { useForm, usePage, Head } from '@inertiajs/vue3'
import { ref, computed } from 'vue'

interface Genre {
  id: number
  name: string
}

const page = usePage()

const genres = computed<Genre[]>(() => {
  return Array.isArray(page.props.genres) ? (page.props.genres as Genre[]) : []
})

const form = useForm({
  title: '',
  description: '',
  genreIds: [] as number[],
  coverUrl: null as File | null,
})

const preview = ref<string | null>(null)
const errorMessage = ref('')

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0] || null
  form.coverUrl = file
  preview.value = file ? URL.createObjectURL(file) : null
}

const submit = () => {
  errorMessage.value = ''

  if (!form.title || !form.description || !form.genreIds[0]) {
    errorMessage.value = 'Lengkapi semua data wajib'
    return
  }

  form.post('/comic/store', {
    forceFormData: true,
    onSuccess: () => {
      form.reset()
      preview.value = null
    },
    onError: () => {
      errorMessage.value = 'Gagal membuat komik'
    }
  })
}

const goBack = () => {
  window.history.back()
}

</script>
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
    <Head title="Publish Komik" />

    <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">
      Publish Komik
    </h1>

    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      <form @submit.prevent="submit" class="space-y-5">

        <!-- Error -->
        <div
          v-if="errorMessage"
          class="p-3 rounded-lg bg-red-100 text-red-700 text-sm"
        >
          {{ errorMessage }}
        </div>

        <!-- Judul -->
        <div>
          <label class="block font-medium text-gray-700 mb-1">
            Judul Komik
          </label>
          <input
            v-model="form.title"
            type="text"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-200"
            placeholder="Masukkan judul komik"
          />
        </div>

        <!-- Deskripsi -->
        <div>
          <label class="block font-medium text-gray-700 mb-1">
            Deskripsi Komik
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-200"
            placeholder="Masukkan deskripsi komik"
          />
        </div>

        <!-- Genre -->
        <div>
          <label class="block font-medium text-gray-700 mb-1">
            Genre Komik
          </label>
          <div class="flex gap-3">
            <select
              v-model="form.genreIds[0]"
              class="w-1/2 rounded-lg border border-gray-300 px-4 py-2"
            >
              <option value="">Genre 1</option>
              <option v-for="g in genres" :key="g.id" :value="g.id">
                {{ g.name }}
              </option>
            </select>

            <select
              v-model="form.genreIds[1]"
              class="w-1/2 rounded-lg border border-gray-300 px-4 py-2"
            >
              <option value="">Genre 2</option>
              <option v-for="g in genres" :key="g.id" :value="g.id">
                {{ g.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Cover -->
        <div>
          <label class="block font-medium text-gray-700 mb-1">
            Cover Komik
          </label>

          <div v-if="preview" class="mb-2">
            <img
              :src="preview"
              class="w-32 h-40 object-cover rounded-lg border"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>

        <!-- Tombol -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="goBack"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Batal
          </button>

          <button
            type="submit"
            :disabled="form.processing"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            Simpan
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

