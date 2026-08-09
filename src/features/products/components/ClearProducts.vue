<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'

import { useProducts } from '../composables/useProducts'

const { clearProducts, isLoading } = useProducts()

function handleAdd(): void {
  clearProducts()
}
</script>

<template>
  <BaseButton :loading="isLoading" color="#FB2E86" size="lg" @click="handleAdd">
    Clear Cart
  </BaseButton>
</template>
