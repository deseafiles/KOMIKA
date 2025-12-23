<script setup lang="ts">
defineProps<{
  sticky?: boolean
}>()
</script>

<template>
  <header
    :class="[
      sticky ? 'sticky top-0 z-10' : '',
      'bg-white/80 dark:bg-black/70 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 py-4 shadow-sm'
    ]"
  >
    <div class="max-w-3xl mx-auto flex items-center justify-between px-4">

      <!-- Slot untuk Back Button atau area kiri -->
      <div class="flex items-center">
        <slot name="left"></slot>
      </div>

      <!-- Slot untuk Title -->
      <div class="flex-1 text-center">
        <slot name="title">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-200 truncate">
            Default Title
          </h1>
        </slot>
      </div>

      <!-- Slot untuk area kanan -->
      <div class="flex items-center justify-end w-20">
        <slot name="right"></slot>
      </div>
    </div>
  </header>
</template>

