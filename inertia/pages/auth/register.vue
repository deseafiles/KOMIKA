<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 dark:from-neutral-900 dark:to-neutral-800 px-4">

    <div class="w-full max-w-md bg-white dark:bg-neutral-900 rounded-xl shadow-xl p-8 animate-fadeIn">
      <h2 class="text-3xl font-bold text-center text-purple-600 dark:text-purple-300 mb-2">Buat Akun</h2>
      <p class="text-center text-gray-500 dark:text-gray-400 mb-6">Daftar untuk mulai membaca webcomic</p>

      <form @submit.prevent="handleSubmit" class="space-y-5">

        <!-- Email -->
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            v-model="form.email"
            class="w-full p-3 bg-gray-50 dark:bg-neutral-800 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Masukkan email"
          />
          <p v-if="form.errors.email" class="text-red-500 text-sm mt-1">
            {{ form.errors.email }}
          </p>
        </div>

        <!-- Username -->
        <div>
          <label class="block text-gray-700 dark:text-gray-300 mb-1">Username</label>
          <input
            v-model="form.username"
            class="w-full p-3 bg-gray-50 dark:bg-neutral-800 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
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
            class="w-full p-3 bg-gray-50 dark:bg-neutral-800 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
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
          class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-3 rounded-lg font-semibold transition"
        >
          <span v-if="!form.processing">Buat Akun</span>
          <span v-else class="animate-pulse">Memproses...</span>
        </button>

        <!-- Back to login -->
        <p class="text-center text-sm mt-4 text-gray-600 dark:text-gray-400">
          Sudah punya akun?
          <a href="/login" class="text-purple-600 hover:underline">Login</a>
        </p>

      </form>

    </div>

  </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({
  email: '',
  username: '',
  password: '',
})

const handleSubmit = () => {
  form.post('/register', {
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
