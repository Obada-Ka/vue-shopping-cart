import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { CartItem } from '../types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isLoading = ref(false)
  const isError = ref<string | null>(null)

  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  return {
    items,
    isLoading,
    isError,
    itemCount
  }
})
