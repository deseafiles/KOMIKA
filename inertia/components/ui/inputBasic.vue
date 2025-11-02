<script setup lang="ts">

</script>

<template>
  <div class="max-w-sm">
  <label class="block text-sm font-medium mb-2 dark:text-white">
    <slot name="label">{{ label }}</slot>
  </label>
      <input type="email" id="input-label" class="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" placeholder="you@site.com">
  </div>
</template>
