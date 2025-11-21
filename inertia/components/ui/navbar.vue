<script setup lang="ts">
import { usePage, Link, router } from '@inertiajs/vue3'
import type { SharedProps } from '@adonisjs/inertia/types'
import { ref } from 'vue'

// Ambil data dari Inertia shared props
const page = usePage<SharedProps>()
const user = page.props.user

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const logout = () => {
  router.post('/logout', {}, {
    onSuccess: () => {
      console.log('Logout berhasil')
      closeDropdown()
    },
  })
}


</script>

<template>
  <header
    class="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800"
  >
    <nav
      class="max-w-[85rem] w-full mx-auto px-4 flex flex-wrap basis-full items-center justify-between"
    >
      <span
        class="sm:order-1 flex-none text-xl font-bold dark:text-white focus:outline-hidden focus:opacity-80"
      >
        KOMIKA
      </span>

      <!-- Bagian kanan -->
      <div class="sm:order-3 flex items-center gap-x-2">
        <!-- Publish selalu muncul -->
        <Link
          href="/comic/create"
          class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
        >
          Publish
        </Link>

        <template v-if="!user">
          <Link
            href="/login"
            class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
          >
            Login
          </Link>
        </template>

        <template v-else>
          <div class="relative">
            <button
              @click="toggleDropdown"
              class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs dark:bg-neutral-800 dark:border-neutral-700 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-700"
            >
            {{user.username}}
            </button>

            <!-- Dropdown pakai v-if -->
            <div
              v-if="isOpen"
              @click.outside="closeDropdown"
              class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-neutral-800 dark:border-neutral-700 z-50"
            >
              <Link
                href="/profile/show"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                Lihat Profil
              </Link>

              <Link
                href="/comic/index"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                Komik Saya
              </Link>

              <button
                @click="logout"
                class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                Logout
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Navigasi -->
      <div
        id="hs-navbar-alignment"
        class="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:grow-0 sm:basis-auto sm:block sm:order-2"
      >
        <div
          class="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:mt-0 sm:ps-5"
        >
          <Link href="/" class="font-medium text-blue-500" aria-current="page">
            Home
          </Link>
          <a
            href="/search"
            class="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500"
          >
            Search
          </a>
          <a
            href="/library"
            class="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500"
          >
            Library
          </a>
        </div>
      </div>
    </nav>
  </header>
</template>
