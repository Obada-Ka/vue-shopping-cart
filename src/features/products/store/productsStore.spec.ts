import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createNewProduct, fetchProducts } from '../api/productsApi'

import { useProductsStore } from './productsStore'

vi.mock('../api/productsApi', () => ({
  fetchProducts: vi.fn(),
  createNewProduct: vi.fn()
}))

const PRODUCT_A = {
  id: 1,
  title: 'Backpack',
  price: 109.95,
  description: 'd',
  category: 'c',
  image: 'i.png'
}
const PRODUCT_B = {
  id: 2,
  title: 'Shirt',
  price: 20,
  description: 'd2',
  category: 'c2',
  image: 'i2.png'
}

describe('productsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts with empty products, not loading, no error', () => {
    const store = useProductsStore()
    expect(store.products).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  describe('loadProducts', () => {
    it('populates products on success and clears isLoading', async () => {
      vi.mocked(fetchProducts).mockResolvedValue([PRODUCT_A, PRODUCT_B])
      const store = useProductsStore()

      const promise = store.loadProducts()
      expect(store.isLoading).toBe(true)
      await promise

      expect(store.isLoading).toBe(false)
      expect(store.products).toEqual([PRODUCT_A, PRODUCT_B])
      expect(store.error).toBeNull()
    })

    it('sets error message and clears isLoading on failure', async () => {
      vi.mocked(fetchProducts).mockRejectedValue(new Error('Network down'))
      const store = useProductsStore()

      await store.loadProducts()

      expect(store.isLoading).toBe(false)
      expect(store.error).toBe('Network down')
      expect(store.products).toEqual([])
    })

    it('falls back to a generic message when a non-Error is thrown', async () => {
      vi.mocked(fetchProducts).mockRejectedValue('some string failure')
      const store = useProductsStore()

      await store.loadProducts()

      expect(store.error).toBe('Failed to load products')
    })

    it('clears a previous error on a subsequent successful call', async () => {
      vi.mocked(fetchProducts).mockRejectedValueOnce(new Error('first failure'))
      const store = useProductsStore()
      await store.loadProducts()
      expect(store.error).toBe('first failure')

      vi.mocked(fetchProducts).mockResolvedValueOnce([PRODUCT_A])
      await store.loadProducts()

      expect(store.error).toBeNull()
      expect(store.products).toEqual([PRODUCT_A])
    })
  })

  describe('addProduct', () => {
    it('pushes the created product onto the list', async () => {
      vi.mocked(createNewProduct).mockResolvedValue({
        id: 21,
        title: 'New Product',
        price: 29,
        description: 'No description available',
        category: 'uncategorized',
        image: ''
      })
      const store = useProductsStore()

      await store.addProduct({ title: 'New Product', price: 29 })

      expect(store.products).toHaveLength(1)
      expect(store.products[0]).toMatchObject({ title: 'New Product', price: 29 })
    })

    it('overrides the server-returned id with a locally-generated one, so repeated adds never collide', async () => {
      vi.mocked(createNewProduct).mockResolvedValue({
        id: 21,
        title: 'New Product',
        price: 29,
        description: 'No description available',
        category: 'uncategorized',
        image: ''
      })
      const store = useProductsStore()

      await store.addProduct({ title: 'First', price: 10 })
      await store.addProduct({ title: 'Second', price: 20 })

      expect(store.products).toHaveLength(2)
      expect(store.products[0]?.id).not.toBe(store.products[1]?.id)
    })

    it('sets error and does not push a product on failure', async () => {
      vi.mocked(createNewProduct).mockRejectedValue(new Error('Create failed'))
      const store = useProductsStore()

      await store.addProduct({ title: 'X', price: 1 })

      expect(store.error).toBe('Create failed')
      expect(store.products).toEqual([])
    })

    it('clears isLoading in the finally block even on failure', async () => {
      vi.mocked(createNewProduct).mockRejectedValue(new Error('boom'))
      const store = useProductsStore()

      await store.addProduct({ title: 'X', price: 1 })

      expect(store.isLoading).toBe(false)
    })
  })

  describe('removeProduct', () => {
    it('removes only the matching product', async () => {
      vi.mocked(fetchProducts).mockResolvedValue([PRODUCT_A, PRODUCT_B])
      const store = useProductsStore()
      await store.loadProducts()

      store.removeProduct(1)

      expect(store.products).toEqual([PRODUCT_B])
    })

    it('is a no-op when the id does not exist', async () => {
      vi.mocked(fetchProducts).mockResolvedValue([PRODUCT_A])
      const store = useProductsStore()
      await store.loadProducts()

      store.removeProduct(999)

      expect(store.products).toEqual([PRODUCT_A])
    })
  })

  describe('clearProducts', () => {
    it('empties the products array', async () => {
      vi.mocked(fetchProducts).mockResolvedValue([PRODUCT_A, PRODUCT_B])
      const store = useProductsStore()
      await store.loadProducts()
      expect(store.products).toHaveLength(2)

      store.clearProducts()

      expect(store.products).toEqual([])
    })
  })
})
