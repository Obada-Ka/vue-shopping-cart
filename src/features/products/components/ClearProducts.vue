<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton'

import { useProducts } from '../composables/useProducts'

const { isLoading } = useProducts()

const emit = defineEmits<{
  clear: []
}>()
</script>

<template>
  <BaseButton :loading="isLoading" color="var(--color-brand-pink)" size="lg" @click="emit('clear')">
    Clear Cart
  </BaseButton>
</template>
