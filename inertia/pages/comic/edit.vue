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
  <div class="min-h-screen bg-gray-50 p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Edit Komik</h1>

    <div class="bg-white shadow rounded-2xl p-6 max-w-2xl">
      <form @submit.prevent="submit" class="space-y-4">

        <!-- Judul -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Judul</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full border-gray-300 rounded-lg p-2"
          />
        </div>

        <!-- Deskripsi -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Deskripsi</label>
          <textarea
            v-model="form.description"
            class="w-full border-gray-300 rounded-lg p-2"
            rows="4"
          ></textarea>
        </div>

        <!-- Cover -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Cover Komik</label>

          <!-- Preview -->
          <img
            v-if="coverPreview"
            :src="coverPreview"
            class="w-32 h-32 rounded border object-cover"
          />
          <div
            v-else
            class="w-32 h-32 bg-gray-300 rounded flex items-center justify-center text-gray-600"
          >
            Tidak ada cover
          </div>

          <!-- File Input -->
          <input
            type="file"
            accept="image/*"
            @change="onCoverChange"
            class="mt-2 w-full border-gray-300 rounded-lg p-2"
          />
        </div>

        <!-- Status -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Status</label>
          <select v-model="form.status" class="w-full border-gray-300 rounded-lg p-2">
            <option value="Ongoing">Ongoing</option>
            <option value="Hiatus">Hiatus</option>
            <option value="Completed">Completed</option>
          </select>
        </div>


        <!-- Genre -->
        <div>
          <label class="block text-gray-700 font-medium mb-1">Genre</label>

          <div class="grid grid-cols-2 gap-2">
            <label
              v-for="g in genres"
              :key="g.id"
              class="flex items-center gap-2 p-2 border rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                :value="g.id"
                v-model="form.genreIds"
              />
              {{ g.name }}
            </label>
          </div>
        </div>

        <!-- Tombol -->
        <div class="flex justify-end gap-2 mt-6">
          <Link
            href="/comic/index"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
          >
            Batal
          </Link>

          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Perbarui Komik
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
