```vue
<script setup lang="ts">
interface Props {
  titles: string[]
}

defineProps<Props>()
</script>

<template>
  <div
    class="text-brand grid gap-8 py-2 pr-2 text-xl font-bold"
    :style="{
      gridTemplateColumns: `2fr ${'1fr '.repeat(titles.length - 1)}`
    }"
  >
    <div v-for="(title, index) in titles" :key="index" :class="{ 'text-center': index !== 0 }">
      {{ title }}
    </div>
  </div>
</template>
```
