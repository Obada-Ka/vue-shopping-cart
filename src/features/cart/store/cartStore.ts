import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { CartItem } from '../types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const isLoading = ref(false)
  const isError = ref<string | null>(null)

  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  const cartTotal = computed(() => items.value.reduce((sum, item) => sum + item.total, 0))

  function updateQuantity(
    product: { productId: number; name: string; price: number },
    quantity: number
  ): void {
    if (quantity <= 0) {
      removeItem(product.productId)
      return
    }

    const existing = items.value.find((item) => item.productId === product.productId)

    if (existing) {
      existing.quantity = quantity
      existing.total = existing.price * existing.quantity
    } else {
      items.value.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        quantity,
        total: product.price * quantity
      })
    }
  }

  function removeItem(productId: number): void {
    items.value = items.value.filter((item) => item.productId !== productId)
  }

  function clearCart(): void {
    items.value = []
  }

  return {
    items,
    isLoading,
    isError,
    itemCount,
    cartTotal,
    updateQuantity,
    removeItem,
    clearCart
  }
})
