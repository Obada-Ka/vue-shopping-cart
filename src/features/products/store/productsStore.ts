import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Product } from '@/domain/product/product.schema'

import { fetchProducts, createNewProduct } from '../api/productsApi'
import type { CreateProductInput } from '../types'

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

  async function addProduct(productInput: CreateProductInput): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      products.value = [...products.value, await createNewProduct(productInput)]
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load products'
    } finally {
      isLoading.value = false
    }
  }

  function removeProduct(productId: number): void {
    products.value = products.value.filter((product) => product.id !== productId)
  }

  function clearProducts(): void {
    products.value = []
  }

  return {
    products,
    addProduct,
    isLoading,
    error,
    removeProduct,
    clearProducts,
    loadProducts
  }
})
