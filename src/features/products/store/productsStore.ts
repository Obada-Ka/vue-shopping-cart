import { defineStore } from 'pinia'
import { ref } from 'vue'

import { fetchProducts } from '../api/productsApi'
import type { Product } from '../types'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function loadProducts(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      products.value = await fetchProducts()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load products'
    } finally {
      isLoading.value = false
    }
  }

  return {
    products,
    isLoading,
    error,
    loadProducts
  }
})
