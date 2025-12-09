<script setup lang="ts">
import {SharedProps} from '@adonisjs/inertia/types'
import { Head, Link, router, useForm, usePage } from '@inertiajs/vue3'
import { ref } from 'vue'

interface Episode {
  id: number
  title: string
  slug: string
}

interface User {
  id: number
  username: string
  avatarUrl?: string | null
}

interface Comment {
  id: number
  content: string
  createdAt: string
  user: User
  isLike: boolean
  episodes: Episode[]
}

const props = defineProps<{
  episode: Episode,
  comment: Comment[]
}>()

const form = useForm({
  content: '',
  episodeId: props.episode.id,
  parentCommentId: null
})
const likes = ref<Record<number, boolean>>({})

// Inisialisasi likes
props.comment.forEach((c) => {
  likes.value[c.id] = c.isLike
})

// Ambil user login
const page = usePage<SharedProps>()
const user = page.props.user

const likeComment = async (commentId: number) => {
  try {
    router.post(`/comment/like/${commentId}`)
    likes.value[commentId] = !likes.value[commentId]
  } catch (error) {
    console.log('Gagal menyukai komentar', error)
  }
}

const deleteComment = async (commentId: number) => {
  try {
    router.delete(`/comment/${commentId}/destroy`)
  } catch (error) {
    console.log('Gagal menghapus komentar', error)
  }
}

const submit = (e: Event) => {
  e.preventDefault()
  form.post(`/comment/episode/${props.episode.slug}/store`, {
    onSuccess: () => {
      form.reset('content')
    },
    onError: (errors) => {
      console.error(errors)
    }
  })
}

const goBack = () => {
  window.history.back()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Head title="Komentar" />

    <!-- Header -->
    <header
      class="sticky top-0 z-10 bg-white/80 dark:bg-black/70 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 py-4 shadow-sm"
    >
      <div class="max-w-3xl mx-auto flex items-center justify-between px-4">
        <!-- Tombol Back -->
        <button
          @click="goBack"
          class="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium
                 hover:text-gray-900 dark:hover:text-white transition"
        >
          ← Kembali
        </button>

        <!-- Judul -->
        <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-200 truncate">
          Komentar: {{ props.episode.title }}
        </h1>

        <div class="w-20"></div>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 py-10">
      <div
        v-if="!props.comment || props.comment.length === 0"
        class="text-center text-gray-500 py-16"
      >
        <p class="text-lg font-semibold">Belum ada komentar.</p>
      </div>

      <!-- LIST KOMENTAR -->
      <div v-else class="space-y-4">
        <div
          v-for="c in props.comment"
          :key="c.id"
          class="bg-white shadow rounded-lg p-5"
        >
          <!-- USER INFO -->
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="font-semibold text-gray-800">{{ c.user.username }}</p>
              <p class="text-xs text-gray-500">
                {{ new Date(c.createdAt).toLocaleString() }}
              </p>
              <p class="text-gray-700 whitespace-pre-line">{{ c.content }}</p>
            </div>

            <!-- Tombol aksi: Like & Hapus -->
            <div class="flex flex-col items-end gap-2">
              <!-- Hapus hanya untuk user pembuat -->
              <button
                v-if="user.id === c.user.id"
                @click="deleteComment(c.id)"
                class="text-red-500 text-sm hover:underline"
              >
                Hapus
              </button>

              <!-- Like -->
              <button
                @click="likeComment(c.id)"
                class="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500"
              >
                <span :class="likes[c.id] ? 'text-red-500' : 'text-gray-400'">❤️</span>
                <span>{{ likes[c.id] ? 'Liked' : 'Like' }}</span>
                <span class="text-gray-500 ml-1">({{ c.likeCount || 0 }})</span>
              </button>
            </div>
          </div>

          <!-- RELATED EPISODE -->
          <div v-if="c.episodes.length" class="mt-4 text-sm text-gray-600">
            <span class="font-medium">Episode:</span>
            <span v-for="(ep, index) in c.episodes" :key="ep.id">
              <Link
                :href="`/episode/show/${ep.id}`"
                class="text-purple-600 hover:underline"
              >
                {{ ep.title || `Episode ${ep.id}` }}
              </Link>
              <span v-if="index < c.episodes.length - 1">, </span>
            </span>
          </div>
        </div>
      </div>

      <!-- FORM KOMENTAR -->
      <div class="mt-10">
        <form
          class="max-w-2xl bg-white rounded-lg border p-4 mx-auto"
          @submit="submit"
        >
          <div class="px-3 mb-2">
            <textarea
              v-model="form.content"
              placeholder="Tulis komentar..."
              class="w-full bg-gray-100 rounded border border-gray-400 leading-normal resize-none h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
            ></textarea>
          </div>
          <div class="flex justify-end px-4">
            <button
              type="submit"
              class="px-3 py-1.5 rounded-md text-white text-sm bg-indigo-500 hover:bg-indigo-600 cursor-pointer"
            >
              Kirim Komentar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
