<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="handleSubmit" class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Registration Form</h2>
      <h4 class="text-center mb-4">Welcome to KOMIKA</h4>

      <label class="block mb-2">Email</label>
      <input
        v-model="form.email"
        type="email"
        class="w-full p-2 border rounded mb-4"
        placeholder="Email"
      />

      <label class="block mb-2">Username</label>
      <input
        v-model="form.username"
        type="text"
        class="w-full p-2 border rounded mb-6"
        placeholder="Username"
      />

      <label class="block mb-2">Password</label>
      <input
        v-model="form.password"
        type="password"
        class="w-full p-2 border rounded mb-6"
        placeholder="Password"
      />

      <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Create Account
      </button>
    </form>
  </div>
</template>

<script setup>
import { useForm } from '@inertiajs/vue3'
import { reactive } from 'vue'

const form = useForm({
  email: '',
  username: '',
  password: '',
})

const handleSubmit = () => {
  console.log('Submit clicked', form) // debug
  form.loading = true
  form.post('/register', {
    onFinish: () => {
      form.loading = false
      form.reset('password')
    },
  })
}
</script>
