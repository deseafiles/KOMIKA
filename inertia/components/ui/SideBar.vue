<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import { router } from '@inertiajs/vue3'

const navItems = [
  { name: 'Dashboard', href: '/admin/', icon: '🏠' },
  { name: 'Manajemen Koin', href: '/admin/coin/index', icon: '🪙' },
  { name: 'Genre Komik', href: '/admin/genres/index', icon: '📚' },
  { name: 'Laporan Pengguna', href: '/admin/users', icon: '🚫' },
  {name: 'Laporan Komik', href: '/admin/comics', icon:'✏️'}
]

const logout = () => {
  router.post('/logout', {}, {
    onSuccess: () => {
      router.get('/login')
    },
    onError: (errors) => {
      console.error('Logout gagal:', errors)
    },
  })
}
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 h-screen bg-white shadow-md flex flex-col">
      <div class="h-16 flex items-center justify-center border-b border-gray-100">
        <h1 class="text-xl font-bold text-indigo-600">Webcomic Admin</h1>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <Link
          v-for="(item, i) in navItems"
          :key="i"
          :href="item.href"
          class="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
          :class="{ 'bg-indigo-100 text-indigo-700 font-medium': $page.url===(item.href) }"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span>{{ item.name }}</span>
        </Link>
      </nav>

      <div class="border-t border-gray-100 p-4">
        <button @click="logout"
          class="w-full flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
        >
          🚪 Keluar
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8">
      <slot />
    </main>
  </div>
</template>

