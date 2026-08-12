<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton'

import { useProducts } from '../composables/useProducts'

const { addProduct, isLoading } = useProducts()

async function handleAdd(): Promise<void> {
  await addProduct({
    title: 'New Product',
    price: 29
  })
}
</script>

<template>
  <BaseButton :loading="isLoading" color="var(--color-brand-green)" size="lg" @click="handleAdd">
    Add Item
  </BaseButton>
</template>
