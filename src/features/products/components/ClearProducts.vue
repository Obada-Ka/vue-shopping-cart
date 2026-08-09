<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import { useCart } from '@/features/cart'

import { useProducts } from '../composables/useProducts'

const { clearProducts, isLoading } = useProducts()
const { clearCart } = useCart()

function handleClearAll(): void {
  clearProducts()
  clearCart()
}
</script>

<template>
  <BaseButton :loading="isLoading" color="#FB2E86" size="lg" @click="handleClearAll">
    Clear Cart
  </BaseButton>
</template>
