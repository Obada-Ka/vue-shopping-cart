<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'

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
  <BaseButton :loading="isLoading" color="#19D16F" size="lg" @click="handleAdd">
    Add Item
  </BaseButton>
</template>
