<script setup lang="ts">
import { useForm, usePage } from '@inertiajs/vue3'
import { ref, computed } from 'vue'

interface Genre {
  id: number
  name: string
}

const page = usePage()

const genres = computed<Genre[]>(() => {
  return Array.isArray(page.props.genres) ? (page.props.genres as Genre[]) : []
})

const loading = ref(false)
const errorMessage = ref('')

const form = useForm({
  title: '',
  description: '',
  genreIds: [] as number[],
  coverUrl: null as File | null,
})

const preview = ref<string | null>(null)

// Handle preview cover
function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0] || null
  form.coverUrl = file

  if (file) {
    preview.value = URL.createObjectURL(file)
  } else {
    preview.value = null
  }
}

// Validasi form sebelum submit
function validate(): boolean {
  errorMessage.value = ''

  if (!form.title.trim()) {
    errorMessage.value = 'Judul komik wajib diisi'
    return false
  }

  if (!form.description.trim()) {
    errorMessage.value = 'Deskripsi komik wajib diisi'
    return false
  }

  if (!form.genreIds[0]) {
    errorMessage.value = 'Pilih minimal 1 genre'
    return false
  }

  return true
}

// Submit ke server
function submit() {
  if (!validate()) return

  loading.value = true

  form.post('/comic/store', {
    forceFormData: true,
    onSuccess: () => {
      form.reset()
      preview.value = null
      loading.value = false
      errorMessage.value = ''
    },
    onError: (errors) => {
      console.error(errors)
      loading.value = false
      errorMessage.value = 'Gagal membuat komik'
    },
  })
}

// Tombol Back
const goBack = () => {
  window.history.back()
}
</script>

<template>
  <div class="flex min-h-screen items-start justify-center bg-white dark:bg-black p-4">
    <Head title="Publish Komik"/>

    <div class="w-full max-w-4xl">

      <!-- Header dengan Back -->
      <div class="flex items-center justify-between mb-6">
        <button
          @click="goBack"
          class="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white transition"
        >
          ← Kembali
        </button>

        <h1 class="text-2xl font-bold text-gray-800 dark:text-white text-center flex-1">
          Publish Komik
        </h1>

        <div class="w-20"></div> <!-- Spacer kanan -->
      </div>

      <!-- Card Publish -->
      <div class="flex flex-col md:flex-row rounded-2xl bg-purple-100 dark:bg-purple-900 shadow-xl overflow-hidden">

        <!-- Kiri: Cover Komik -->
        <div class="flex flex-col items-center justify-start bg-purple-200 dark:bg-purple-800 p-6 w-full md:w-1/3">
          <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-white">Cover Komik</label>
          <input
            type="file"
            accept="image/*"
            @change="handleFileChange"
            class="block w-full cursor-pointer rounded-lg border border-gray-300 text-sm text-gray-900 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-400"
          />
          <img
            v-if="preview"
            :src="preview"
            alt="Preview Gambar"
            class="mt-4 rounded-lg object-cover w-full max-h-60"
          />
        </div>

        <!-- Kanan: Form -->
        <div class="flex flex-col p-8 w-full md:w-2/3 gap-4">

          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 text-sm"
          >
            {{ errorMessage }}
          </div>

          <!-- Judul Komik -->
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-white">Judul Komik</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full rounded-xl bg-white px-5 py-1.5 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-neutral-800 dark:text-white"
              placeholder="Masukkan Judul Komik"
            />
            <p v-if="form.errors.title" class="text-red-500 text-xs mt-1">
              {{ form.errors.title }}
            </p>
          </div>

          <!-- Deskripsi Komik -->
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-white">Deskripsi Komik</label>
            <textarea
              v-model="form.description"
              class="w-full rounded-xl bg-white px-5 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-neutral-800 dark:text-white"
              placeholder="Masukkan Deskripsi Komik"
              rows="4"
            ></textarea>
            <p v-if="form.errors.description" class="text-red-500 text-xs mt-1">
              {{ form.errors.description }}
            </p>
          </div>

          <!-- Genre Komik -->
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-white">Genre Komik</label>
            <div class="flex w-full gap-4">
              <select
                v-model="form.genreIds[0]"
                class="w-1/2 rounded-xl bg-white px-5 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-neutral-800 dark:text-white"
              >
                <option value="">Pilih Genre 1</option>
                <option v-for="genre in genres" :key="genre.id" :value="genre.id">
                  {{ genre.name }}
                </option>
              </select>

              <select
                v-model="form.genreIds[1]"
                class="w-1/2 rounded-xl bg-white px-5 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:bg-neutral-800 dark:text-white"
              >
                <option value="">Pilih Genre 2</option>
                <option v-for="genre in genres" :key="genre.id" :value="genre.id">
                  {{ genre.name }}
                </option>
              </select>
            </div>
            <p v-if="form.errors.genreIds" class="text-red-500 text-xs mt-1">
              {{ form.errors.genreIds }}
            </p>
          </div>

          <!-- Tombol Submit -->
          <button
            @click="submit"
            :disabled="loading || form.processing"
            class="mt-4 rounded-2xl bg-purple-700 px-5 py-2 text-white transition-all hover:bg-purple-800 disabled:bg-purple-400 disabled:cursor-not-allowed"
          >
            {{ loading || form.processing ? 'Mengirim...' : 'Kirim Komik' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animasi sederhana jika mau ditambahkan */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>
