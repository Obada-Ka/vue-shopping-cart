import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'

import { useProductsStore } from '../store/productsStore'
import type { Product } from '../types'

interface UseProductReturn {
  products: Ref<Product[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  loadProducts: () => Promise<void>
}

export function useProducts(): UseProductReturn {
  const store = useProductsStore()
  const { products, isLoading, error } = storeToRefs(store)

  return {
    products,
    isLoading,
    error,
    loadProducts: store.loadProducts
  }
}
