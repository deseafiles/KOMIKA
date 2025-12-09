<script setup lang="ts">
import { useForm, Link } from '@inertiajs/vue3'
import { ref } from 'vue'

const props = defineProps({
  comic: Object,
  genres: Array,
})

const coverPreview = ref(props.comic.coverUrl)

const form = useForm({
  title: props.comic.title,
  description: props.comic.description,
  status: props.comic.status,
  genreIds: props.comic.genreIds ?? [],
  cover: null,
})

/* Preview image */
const onCoverChange = (e: any) => {
  const file = e.target.files[0]
  if (!file) return
  form.cover = file
  coverPreview.value = URL.createObjectURL(file)
}

const submit = () => {
  form.put(`/comic/update/${props.comic.slug}`, {
    forceFormData: true,
  })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div class="bg-white shadow-md rounded-2xl p-6 w-full max-w-2xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">✏️ Edit Komik</h1>

      <form @submit.prevent="submit" class="space-y-5">
        <!-- Judul -->
        <div>
          <label class="block font-semibold text-gray-800 mb-1">Judul</label>
          <input v-model="form.title" type="text" class="w-full border-gray-300 rounded-lg p-2" />
          <p v-if="form.errors.title" class="text-red-500 text-sm mt-1">{{ form.errors.title }}</p>
        </div>

        <!-- Deskripsi -->
        <div>
          <label class="block font-semibold text-gray-800 mb-1">Deskripsi</label>
          <textarea v-model="form.description" rows="4" class="w-full border-gray-300 rounded-lg p-2"></textarea>
          <p v-if="form.errors.description" class="text-red-500 text-sm mt-1">{{ form.errors.description }}</p>
        </div>

        <!-- Cover -->
        <div>
          <label class="block font-semibold text-gray-800 mb-1">Cover Komik</label>
          <img v-if="coverPreview" :src="coverPreview" class="w-32 h-32 mb-2 rounded border object-cover mx-auto" />
          <input type="file" accept="image/*" @change="onCoverChange" class="w-full border-gray-300 rounded-lg p-2" />
        </div>

        <!-- Status -->
        <div>
          <label class="block font-semibold text-gray-800 mb-1">Status</label>
          <select v-model="form.status" class="w-full border-gray-300 rounded-lg p-2">
            <option value="Ongoing">Ongoing</option>
            <option value="Hiatus">Hiatus</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <!-- Genre -->
        <div>
          <label class="block font-semibold text-gray-800 mb-2">Genre</label>
          <div class="grid grid-cols-2 gap-2">
            <label v-for="g in genres" :key="g.id" class="flex items-center gap-2 p-2 border rounded-lg cursor-pointer">
              <input type="checkbox" :value="g.id" v-model="form.genreIds" />
              {{ g.name }}
            </label>
          </div>
        </div>

        <!-- Tombol -->
        <div class="flex justify-center gap-3 mt-6">
          <Link href="/comic/index" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Batal</Link>
          <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition" :disabled="form.processing">
            <span v-if="form.processing">Menyimpan...</span>
            <span v-else>Perbarui Komik</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
