<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3'
import { SharedProps } from '@adonisjs/inertia/types'

const props = defineProps<{
  episode: any,
  mustLogin?: boolean,
  purchased?: boolean
}>()

const page = usePage<SharedProps>()
const user = page.props.user
const emit = defineEmits(['close'])

const submit = () => {
  router.post(`/episodes/${props.episode.id}/buy`, {}, {
    onSuccess: () => {
      emit('close')
    }
  })
}
</script>

<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-scale">

      <button
        @click="emit('close')"
        class="absolute right-4 top-4 text-gray-500 hover:text-black text-xl"
      >
        ×
      </button>

      <div class="text-center space-y-4">
        <h1 class="text-xl font-bold">Episode Premium</h1>

        <p class="text-gray-600">{{ episode.title }}</p>

        <template v-if="mustLogin">
          <p class="text-gray-700">Kamu harus login untuk membeli episode ini.</p>

          <Link
            href="/login"
            class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg"
          >
            Login Sekarang
          </Link>
        </template>

        <template v-else-if="purchased === false">
          <p class="text-gray-700">Kamu belum membeli episode ini.</p>

<button
  @click="submit"
  class="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg"
>
  Beli Episode (Rp {{ episode.price }})
</button>
        </template>

        <template v-else>
          <p class="text-gray-500">Tidak ada data pembelian.</p>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scale {
  from { transform: scale(.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scale {
  animation: scale .2s ease-out;
}
</style>
