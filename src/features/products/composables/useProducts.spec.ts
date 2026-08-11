import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchProducts } from '../api/productsApi'

import { useProducts } from './useProducts'

vi.mock('../api/productsApi', () => ({
  fetchProducts: vi.fn(),
  createNewProduct: vi.fn()
}))

describe('useProducts', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes initial state', () => {
    const { products, isLoading, error } = useProducts()
    expect(products.value).toEqual([])
    expect(isLoading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('products/isLoading/error stay reactive after destructuring', async () => {
    vi.mocked(fetchProducts).mockResolvedValue([
      { id: 1, title: 'A', price: 1, description: 'd', category: 'c', image: 'i' }
    ])
    const { products, isLoading, loadProducts } = useProducts()

    const promise = loadProducts()
    expect(isLoading.value).toBe(true)
    await promise

    expect(isLoading.value).toBe(false)
    expect(products.value).toHaveLength(1)
  })

  it('clearProducts empties the reactive products ref', async () => {
    vi.mocked(fetchProducts).mockResolvedValue([
      { id: 1, title: 'A', price: 1, description: 'd', category: 'c', image: 'i' }
    ])
    const { products, loadProducts, clearProducts } = useProducts()
    await loadProducts()
    expect(products.value).toHaveLength(1)

    clearProducts()

    expect(products.value).toEqual([])
  })

  it('removeProduct removes the matching item from the reactive ref', async () => {
    vi.mocked(fetchProducts).mockResolvedValue([
      { id: 1, title: 'A', price: 1, description: 'd', category: 'c', image: 'i' },
      { id: 2, title: 'B', price: 2, description: 'd', category: 'c', image: 'i' }
    ])
    const { products, loadProducts, removeProduct } = useProducts()
    await loadProducts()

    removeProduct(1)

    expect(products.value).toHaveLength(1)
    expect(products?.value[0]?.id).toBe(2)
  })

  it('multiple calls to useProducts() share the same underlying store', async () => {
    vi.mocked(fetchProducts).mockResolvedValue([
      { id: 1, title: 'A', price: 1, description: 'd', category: 'c', image: 'i' }
    ])
    const first = useProducts()
    const second = useProducts()

    await first.loadProducts()

    expect(second.products.value).toEqual(first.products.value)
  })
})
