<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="handleSubmit" class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>

      <label class="block mb-2">Username</label>
      <input
        v-model="form.username"
        class="w-full p-2 border rounded mb-4"
        placeholder="Username"
      />

      <label class="bloc mb-2">Password</label>
      <input
        v-model="form.password"
        class="w-full p-2 border rounded mb-4"
        placeholder="Password"
      />

      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Login
      </button>
    </form>
  </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3'
import { reactive } from 'vue'

const form = useForm({
  username: '',
  password: '',
})

const handleSubmit = () => {
  console.log('Submit clicked', form)
  form.loading = true
  form.post('/login', {
    onFinish: () => {
      form.loading = false
      form.reset('password')
    },
  })
}
</script>
