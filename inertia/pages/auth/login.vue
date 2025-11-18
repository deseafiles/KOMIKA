<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-neutral-900 dark:to-neutral-800 px-4">

    <div class="w-full max-w-md bg-white dark:bg-neutral-900 rounded-xl shadow-xl p-8 animate-fadeIn">
      <h2 class="text-3xl font-bold text-center text-blue-600 dark:text-blue-300 mb-2">KOMIKA</h2>
      <p class="text-center text-gray-500 dark:text-gray-400 mb-6">Masuk untuk melanjutkan membaca</p>

      <form @submit.prevent="handleSubmit" class="space-y-5">

        <!-- Username -->
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1">Username</label>
          <input
            v-model="form.username"
            class="w-full p-3 bg-gray-50 dark:bg-neutral-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Masukkan username"
          />
          <p v-if="form.errors.username" class="text-red-500 text-sm mt-1">
            {{ form.errors.username }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            type="password"
            v-model="form.password"
            class="w-full p-3 bg-gray-50 dark:bg-neutral-800 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Masukkan password"
          />
          <p v-if="form.errors.password" class="text-red-500 text-sm mt-1">
            {{ form.errors.password }}
          </p>
        </div>

        <!-- Button -->
        <button
          type="submit"
          :disabled="form.processing"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition"
        >
          <span v-if="!form.processing">Login</span>
          <span v-else class="animate-pulse">Loading...</span>
        </button>

        <!-- Go to register -->
        <p class="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
          Belum punya akun?
          <a href="/register" class="text-blue-600 hover:underline">Daftar</a>
        </p>

      </form>

    </div>

  </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({
  username: '',
  password: '',
})

const handleSubmit = () => {
  form.post('/login', {
    onFinish: () => form.reset('password'),
  })
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
