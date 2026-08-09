import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'

import type { Product } from '@/domain/product/product.schema'

import { useProductsStore } from '../store/productsStore'

interface UseProductReturn {
  products: Ref<Product[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  loadProducts: () => Promise<void>
  removeProduct: (productId: number) => void
}

export function useProducts(): UseProductReturn {
  const store = useProductsStore()
  const { products, isLoading, error } = storeToRefs(store)

  return {
    products,
    isLoading,
    error,
    loadProducts: store.loadProducts,
    removeProduct: store.removeProduct
  }
}
