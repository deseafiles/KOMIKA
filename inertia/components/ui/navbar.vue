<script setup lang="ts">
import { ref } from 'vue'
import { usePage, Link, router } from '@inertiajs/vue3'
import type { SharedProps } from '@adonisjs/inertia/types'

const page = usePage<SharedProps>()
const user = page.props.user

const isDropdownOpen = ref(false)
const isMobileMenuOpen = ref(false)

const toggleDropdown = () => { isDropdownOpen.value = !isDropdownOpen.value }
const closeDropdown = () => { isDropdownOpen.value = false }

const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value }

const logout = () => {
  router.post('/logout', {}, {
    onSuccess: () => {
      closeDropdown()
    },
  })
}
</script>

<template>
  <header class="bg-white dark:bg-neutral-800 shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <Link href="/" class="text-xl font-bold dark:text-white">KOMIKA</Link>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-4">
          <Link href="/" class="text-gray-600 dark:text-neutral-300 hover:text-blue-500">Home</Link>
          <Link href="/search" class="text-gray-600 dark:text-neutral-300 hover:text-blue-500">Search</Link>
          <Link href="/library" class="text-gray-600 dark:text-neutral-300 hover:text-blue-500">Library</Link>

          <!-- Publish desktop only -->
          <Link
            v-if="user"
            href="/comic/create"
            class="py-2 px-3 items-center text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
          >
            Publish
          </Link>

          <!-- User Dropdown -->
          <div v-if="user" class="relative">
            <button @click="toggleDropdown" class="px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
              {{ user.username }}
            </button>

            <div
              v-if="isDropdownOpen"
              @click.outside="closeDropdown"
              class="absolute right-0 mt-2 w-44 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-lg z-50"
            >
              <Link href="/profile/show" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700">Lihat Profil</Link>

              <!-- Komik Saya / Statistik Platform -->
              <Link
                :href="user.isAdmin ? '/admin/statistik' : '/comic/index'"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                {{ user.isAdmin ? 'Statistik Platform' : 'Komik Saya' }}
              </Link>

              <button @click="logout" class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-neutral-700">Logout</button>
            </div>
          </div>

          <template v-else>
            <Link href="/login" class="px-3 py-2 rounded-lg border border-gray-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">Login</Link>
          </template>
        </div>

        <!-- Mobile menu button -->
        <div class="flex items-center md:hidden">
          <button @click="toggleMobileMenu" class="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-neutral-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-700">
            <span v-if="!isMobileMenuOpen">☰</span>
            <span v-else>✕</span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden mt-2 space-y-1 bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-lg">
        <Link href="/" class="block px-2 py-1 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded">Home</Link>
        <Link href="/search" class="block px-2 py-1 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded">Search</Link>
        <Link href="/library" class="block px-2 py-1 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded">Library</Link>

        <template v-if="user">
          <Link href="/profile/show" class="block px-2 py-1 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded">Profil</Link>

          <Link
            :href="user.isAdmin ? '/admin/statistik' : '/comic/index'"
            class="block px-2 py-1 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded"
          >
            {{ user.isAdmin ? 'Statistik Platform' : 'Komik Saya' }}
          </Link>

          <button @click="logout" class="w-full text-left px-2 py-1 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded">Logout</button>
        </template>

        <template v-else>
          <Link href="/login" class="block px-2 py-1 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded">Login</Link>
        </template>
      </div>
    </nav>
  </header>
</template>
