<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from '@inertiajs/vue3'
import SideBar from '~/components/ui/SideBar.vue';

const props = defineProps<{
  users: {
    id: number
    username: string
    email: string
    isBanned: boolean
  }[]
}>()

const isOpen = ref<number | null>(null)

const toggleDropdown = (id: number) => {
  isOpen.value = isOpen.value === id ? null : id
}

const closeDropdown = () => {
  isOpen.value = null
}

const form = useForm({})

const banUser = async (id: number) => {
  try {
    form.post(`/users/${id}/ban`)
    const user = props.users.find(u => u.id === id)
    if (user) user.isBanned = true
    closeDropdown()
  } catch (error) {
    console.error(error)
  }
}

const unbanUser = async (id: number) => {
  try {
    form.post(`/users/${id}/unban`)
    const user = props.users.find(u => u.id === id)
    if (user) user.isBanned = false
    closeDropdown()
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
<SideBar>
  <div class="min-h-screen bg-gray-50 p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Daftar Pengguna</h1>

    <div class="bg-white shadow rounded-2xl p-6">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b text-gray-600">
            <th class="p-3">ID</th>
            <th class="p-3">Username</th>
            <th class="p-3">Email</th>
            <th class="p-3">Status</th>
            <th class="p-3 text-right">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in props.users" :key="user.id" class="border-b hover:bg-gray-50 transition">
            <td class="p-3">{{ user.id }}</td>
            <td class="p-3 font-medium text-gray-800">{{ user.username }}</td>
            <td class="p-3 text-gray-700">{{ user.email }}</td>
            <td class="p-3">
              <span :class="user.isBanned ? 'text-red-600 font-medium' : 'text-green-600 font-medium'">
                {{ user.isBanned ? 'Banned' : 'Active' }}
              </span>
            </td>
            <td class="p-3 text-right relative">

              <!-- Trigger Dropdown -->
              <button @click="toggleDropdown(user.id)" class="flex justify-center items-center w-8 h-8 rounded-lg border bg-white hover:bg-gray-100">
                <svg class="w-4 h-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"/>
                  <circle cx="12" cy="5" r="1"/>
                  <circle cx="12" cy="19" r="1"/>
                </svg>
              </button>

              <!-- Dropdown -->
              <div v-if="isOpen === user.id" class="absolute right-0 mt-2 w-40 bg-white shadow-lg border border-gray-200 rounded-lg p-1 z-50">
                <button
                  v-if="!user.isBanned"
                  @click="banUser(user.id)"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Ban User
                </button>

                <button
                  v-else
                  @click="unbanUser(user.id)"
                  class="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                >
                  Unban User
                </button>
              </div>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</SideBar>
</template>
