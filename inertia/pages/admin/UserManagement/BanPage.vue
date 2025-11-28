<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white rounded-xl shadow-xl p-6 sm:p-10 max-w-lg w-full text-center">
      <!-- Icon -->
      <div class="text-7xl mb-4 sm:mb-6">🚫</div>

      <!-- Judul -->
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
        Akun Anda Diblokir
      </h1>

      <!-- Deskripsi -->
      <p class="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
        Pengguna telah di-ban. Silakan hubungi tim support untuk informasi lebih lanjut.
      </p>

      <!-- Alasan -->
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-6 text-left rounded">
        <p class="text-sm sm:text-base text-yellow-700">
          <strong>Alasan:</strong> Pelanggaran terhadap syarat dan ketentuan penggunaan
        </p>
      </div>

      <!-- Tombol aksi -->
      <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href="/"
          class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center"
        >
          Kembali ke Beranda
        </a>
        <a
          href="mailto:support@example.com"
          class="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition text-center"
        >
          Hubungi Support
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Bisa tambahkan style khusus di sini kalau mau */
</style>
