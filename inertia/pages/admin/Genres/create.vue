<script setup>
  import { useForm, Link } from '@inertiajs/vue3';

  const form = useForm({
    name: '',
  })

  const submit = () => {
  console.log("Dipencet")
  form.post('/admin/genres/store')
  }

  const goBack = () => {
    window.history.back()
  }
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="bg-white shadow rounded-2xl p-6 w-full max-w-lg">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        Tambah Genre Komik
      </h1>

      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium mb-1">Nama Genre</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border-gray-300 rounded-lg p-2 focus:ring focus:ring-indigo-200"
            placeholder="Misal: Aksi, Komedi, Drama..."
          />
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button
            @click="goBack"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

