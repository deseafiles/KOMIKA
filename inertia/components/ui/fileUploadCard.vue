<script setup lang="ts">
import {router, useForm} from '@inertiajs/vue3';

const form = useForm({
  image: null as File | null,
})

function submit() {
  form.post('/comic/store', {
   forceFormData: true,
  })
}
</script>

<template>
  <div class="container">
    <form @submit.prevent="submit">
      <div>
        <label><slot>Upload Image</slot>
<input
  type="file"
  @change="form.image = ($event.target as HTMLInputElement).files?.[0]"
/>
          <progress v-if="form.progress" :value="form.progress.percentage" max="100">
            {{ form.progress.percentage}}%</progress>
          <button type="submit">Submit</button>
        </label>
      </div>
    </form>
  </div>
</template>
