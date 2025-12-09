<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'

const form = useForm({
  username: '',
  password: '',
  errors: {},
})

// Submit login
const handleSubmit = () => {
  form.post('/login', {
    onFinish: () => form.reset('password'),
    onError: (errors) => {
      Object.assign(form.errors, errors)
    },
  })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 px-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-xl p-8 animate-fadeIn">
      <!-- Judul -->
      <h2 class="text-3xl font-bold text-center text-blue-600 mb-2">KOMIKA</h2>
      <p class="text-center text-gray-500 mb-6">Masuk untuk melanjutkan membaca</p>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Username -->
        <div>
          <label class="block text-gray-700 mb-1 font-medium">Username</label>
          <input
            v-model="form.username"
            class="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Masukkan username"
          />
          <p v-if="form.errors.username" class="text-red-500 text-sm mt-1">
            {{ form.errors.username }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-gray-700 mb-1 font-medium">Password</label>
          <input
            type="password"
            v-model="form.password"
            class="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Masukkan password"
          />
          <p v-if="form.errors.password" class="text-red-500 text-sm mt-1">
            {{ form.errors.password }}
          </p>
        </div>

        <!-- General error -->
        <p v-if="form.errors.E_INVALID_CREDENTIALS || form.errors.E_BANNED || form.errors.general"
           class="text-red-500 text-sm mt-1">
          {{ form.errors.E_INVALID_CREDENTIALS || form.errors.E_BANNED || form.errors.general }}
        </p>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="form.processing"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition flex justify-center items-center gap-2"
        >
          <span v-if="form.processing" class="animate-pulse">Memproses...</span>
          <span v-else>Login</span>
        </button>

        <!-- Link ke register -->
        <p class="text-center text-sm mt-4 text-gray-600">
          Belum punya akun?
          <a href="/register" class="text-blue-600 hover:underline">Daftar</a>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
