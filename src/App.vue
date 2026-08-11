<script setup lang="ts">
import { Toaster } from 'vue-sonner'
</script>

<template>
  <Toaster position="top-right" rich-colors />
  <main class="mx-auto min-h-fit w-full flex-1 px-10 lg:my-8 lg:px-20">
    <router-view />
  </main>
</template>
