<script setup lang="ts">
import { Link, useForm } from '@inertiajs/vue3'
import SideBar from '~/components/ui/SideBar.vue'

const props = defineProps({
  genres: {
  type: Array,
  }
})

const form = useForm({})

const deleteGenre = (id: number) => {
    form.delete(`/admin/genres/destroy/${id}`)
}
</script>

<template>
  <SideBar>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Daftar Genre</h1>
      <Link
        href="/admin/genres/create"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Tambah Genre
      </Link>
    </div>

    <div class="bg-white shadow rounded-2xl p-6">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b text-gray-600">
            <th class="p-3">Nama Genre</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="g in genres" :key="g.id"
            class="border-b hover:bg-gray-50 transition"
          >
            <td class="p-3 font-medium text-gray-800">{{ g.name }}</td>
            <td class="p-3 text-right space-x-2">
              <Link
                :href="`/admin/genres/edit/${g.id}`"
                class="text-indigo-600 hover:underline"
              >
                Edit
              </Link>

              <button
                @click="deleteGenre(g.id)"
                class="text-red-600 hover:underline"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

    </div>
  </div>
  </SideBar>
</template>
