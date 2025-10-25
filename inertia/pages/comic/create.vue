<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'
import { ref } from 'vue'

const form = useForm({
  title: '',
  description: '',
  image: null as File | null,
})

const preview = ref<string | null>(null)

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0] || null
  form.image = file

  if (file) {
    preview.value = URL.createObjectURL(file)
  } else {
    preview.value = null
  }
}

function submit() {
  form.post('/comic/store', {
    forceFormData: true,
    onSuccess: () => {
      form.reset()
      preview.value = null
    },
  })
}
</script>

<template>
  <div class="max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
    <h1 class="text-2xl font-bold mb-4">Create Comic</h1>

    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block text-sm font-semibold mb-1">Title</label>
        <input
          type="text"
          v-model="form.title"
          class="w-full border border-gray-300 rounded-lg p-2 focus:ring-violet-400"
          placeholder="Enter comic title"
        />
        <p v-if="form.errors.title" class="text-red-500 text-sm mt-1">
          {{ form.errors.title }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-semibold mb-1">Description</label>
        <textarea
          v-model="form.description"
          class="w-full border border-gray-300 rounded-lg p-2 focus:ring-violet-400"
          rows="3"
          placeholder="Short description..."
        />
        <p v-if="form.errors.description" class="text-red-500 text-sm mt-1">
          {{ form.errors.description }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-semibold mb-1">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          @change="handleFileChange"
          class="w-full text-sm border border-gray-300 rounded-lg cursor-pointer"
        />

        <div v-if="preview" class="mt-3">
          <img :src="preview" class="rounded-lg shadow" alt="Preview" />
        </div>

        <div v-if="form.progress" class="mt-3">
          <progress
            :value="form.progress.percentage"
            max="100"
            class="w-full h-2 rounded bg-gray-200"
          ></progress>
          <p class="text-sm text-gray-500 mt-1">
            {{ form.progress.percentage }}%
          </p>
        </div>
      </div>

      <button
        type="submit"
        class="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
        :disabled="form.processing"
      >
        {{ form.processing ? 'Uploading...' : 'Submit' }}
      </button>
    </form>
  </div>
</template>
