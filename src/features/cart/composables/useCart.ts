import { storeToRefs } from 'pinia'
import type { ComputedRef, Ref } from 'vue'

import { useCartStore } from '../store/cartStore'
import type { CartItem } from '../types'

interface UpdateQuantityInput {
  productId: number
  name: string
  price: number
}

interface UseCartReturn {
  items: Ref<CartItem[]>
  itemCount: ComputedRef<number>
  cartTotal: ComputedRef<number>
  updateQuantity: (product: UpdateQuantityInput, quantity: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
}

export function useCart(): UseCartReturn {
  const store = useCartStore()
  const { items, itemCount, cartTotal } = storeToRefs(store)

  return {
    items,
    itemCount,
    cartTotal,
    updateQuantity: store.updateQuantity,
    removeFromCart: store.removeItem,
    clearCart: store.clearCart
  }
}
