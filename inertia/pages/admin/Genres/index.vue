<script setup lang="ts">
interface Genre {
  name: string
}

interface GenreProps {
  genre: Genre[]
}

const props = defineProps<GenreProps>()
</script>

<template>
  <div>
    <span
      v-for="(genre, index) in props.genre"
      :key="index"
    >
      {{ genre.name }}
    </span>
  </div>
</template>
