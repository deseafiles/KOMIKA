<script setup lang="ts">
  interface episode {
  id: number

  }

interface comic {
  id: number
  title: string
  episode
}

const props = defineProps<{ episodes: any }>()
console.log(props.episodes)
</script>

<template>
  <div>
    {{ props.episodes }}
  </div>
</template>
