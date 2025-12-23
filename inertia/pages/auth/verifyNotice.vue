<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
</script>

<template>
  <Head title="Verify Your Email" />

  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white p-6 rounded-lg shadow text-center space-y-4">
      <h1 class="text-2xl font-semibold text-gray-900">
        Verify your email address
      </h1>

      <p class="text-gray-600">
        Kami sudah mengirimkan email verifikasi ke alamat email Anda.
        Silakan cek inbox dan klik link verifikasi untuk mengaktifkan akun.
      </p>

      <p class="text-sm text-gray-500">
        Jika tidak menemukan email, periksa folder spam atau junk.
      </p>

      <div class="pt-4">
        <Link
          href="/login"
          class="inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
        >
          Kembali ke Login
        </Link>
      </div>
    </div>
  </div>
</template>
