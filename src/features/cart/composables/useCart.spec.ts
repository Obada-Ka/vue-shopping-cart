import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useCart } from './useCart'

const PRODUCT = { productId: 1, name: 'Backpack', price: 100 }

describe('useCart', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('exposes initial empty state', () => {
    const { items, itemCount, cartTotal } = useCart()
    expect(items.value).toEqual([])
    expect(itemCount.value).toBe(0)
    expect(cartTotal.value).toBe(0)
  })

  it('items/itemCount/cartTotal stay reactive after destructuring', () => {
    const { items, itemCount, cartTotal, updateQuantity } = useCart()

    updateQuantity(PRODUCT, 2)

    expect(items.value).toHaveLength(1)
    expect(itemCount.value).toBe(2)
    expect(cartTotal.value).toBe(200)
  })

  it("removeFromCart delegates to the store's removeItem action", () => {
    const { items, updateQuantity, removeFromCart } = useCart()
    updateQuantity(PRODUCT, 1)
    expect(items.value).toHaveLength(1)

    removeFromCart(1)

    expect(items.value).toEqual([])
  })

  it('clearCart delegates to the store and empties items', () => {
    const { items, updateQuantity, clearCart } = useCart()
    updateQuantity(PRODUCT, 1)
    updateQuantity({ productId: 2, name: 'Shirt', price: 20 }, 1)

    clearCart()

    expect(items.value).toEqual([])
  })

  it('multiple calls to useCart() share the same underlying store', () => {
    const first = useCart()
    const second = useCart()

    first.updateQuantity(PRODUCT, 3)

    expect(second.items.value).toEqual(first.items.value)
    expect(second.cartTotal.value).toBe(first.cartTotal.value)
  })
})
