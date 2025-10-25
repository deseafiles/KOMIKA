<template>
  <div>
    <h1>List Comic</h1>
    <ComicCard
      v-for="comic in props.listComicByCreator"
      :key="comic.id"
      :comic="comic"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import ComicCard from '~/components/comic/comicCard.vue'

interface Comic {
  id: number
  title: string
  description?: string
  coverUrl?: string
}

const props = defineProps<{
  listComicByCreator: Comic[]
}>()

function handleEdit(id: number) {
  console.log('Edit comic', id)
}

function handleDelete(id: number) {
  console.log('Delete comic', id)
}
</script>
