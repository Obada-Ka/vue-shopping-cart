import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useCartStore } from './cartStore'

const PRODUCT = { productId: 1, name: 'Backpack', price: 100 }

describe('cartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts empty', () => {
    const store = useCartStore()
    expect(store.items).toEqual([])
    expect(store.itemCount).toBe(0)
    expect(store.cartTotal).toBe(0)
  })

  describe('updateQuantity', () => {
    it('adds a new CartItem with the correct total when the item is not yet in the cart', () => {
      const store = useCartStore()

      store.updateQuantity(PRODUCT, 2)

      expect(store.items).toEqual([
        { productId: 1, name: 'Backpack', price: 100, quantity: 2, total: 200 }
      ])
    })

    it('updates quantity and recalculates total for an existing item', () => {
      const store = useCartStore()
      store.updateQuantity(PRODUCT, 2)

      store.updateQuantity(PRODUCT, 5)

      expect(store.items).toHaveLength(1)
      expect(store.items[0]).toMatchObject({ quantity: 5, total: 500 })
    })

    it('removes the item entirely when quantity is set to 0', () => {
      const store = useCartStore()
      store.updateQuantity(PRODUCT, 2)

      store.updateQuantity(PRODUCT, 0)

      expect(store.items).toEqual([])
    })

    it('removes the item when quantity is negative', () => {
      const store = useCartStore()
      store.updateQuantity(PRODUCT, 2)

      store.updateQuantity(PRODUCT, -1)

      expect(store.items).toEqual([])
    })

    it('calling with quantity 0 on an item never in the cart is a safe no-op', () => {
      const store = useCartStore()

      store.updateQuantity(PRODUCT, 0)

      expect(store.items).toEqual([])
    })

    it('tracks multiple distinct products independently', () => {
      const store = useCartStore()

      store.updateQuantity(PRODUCT, 1)
      store.updateQuantity({ productId: 2, name: 'Shirt', price: 20 }, 3)

      expect(store.items).toHaveLength(2)
      expect(store.itemCount).toBe(4)
      expect(store.cartTotal).toBe(100 + 60)
    })
  })

  describe('removeItem', () => {
    it('removes only the matching item', () => {
      const store = useCartStore()
      store.updateQuantity(PRODUCT, 1)
      store.updateQuantity({ productId: 2, name: 'Shirt', price: 20 }, 1)

      store.removeItem(1)

      expect(store.items).toHaveLength(1)
      expect(store.items[0]?.productId).toBe(2)
    })

    it('is a no-op when the productId does not exist', () => {
      const store = useCartStore()
      store.updateQuantity(PRODUCT, 1)

      store.removeItem(999)

      expect(store.items).toHaveLength(1)
    })
  })

  describe('clearCart', () => {
    it('empties all items', () => {
      const store = useCartStore()
      store.updateQuantity(PRODUCT, 1)
      store.updateQuantity({ productId: 2, name: 'Shirt', price: 20 }, 1)

      store.clearCart()

      expect(store.items).toEqual([])
      expect(store.itemCount).toBe(0)
      expect(store.cartTotal).toBe(0)
    })
  })

  describe('computed values', () => {
    it('itemCount sums quantities across all items', () => {
      const store = useCartStore()
      store.updateQuantity(PRODUCT, 3)
      store.updateQuantity({ productId: 2, name: 'Shirt', price: 20 }, 4)

      expect(store.itemCount).toBe(7)
    })

    it("cartTotal sums each item's total, not price * itemCount", () => {
      const store = useCartStore()
      store.updateQuantity(PRODUCT, 2) // total 200
      store.updateQuantity({ productId: 2, name: 'Shirt', price: 20 }, 3) // total 60

      expect(store.cartTotal).toBe(260)
    })
  })
})
