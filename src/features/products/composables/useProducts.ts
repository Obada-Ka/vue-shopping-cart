import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'

import type { Product } from '@/domain/product/product.schema'

import { useProductsStore } from '../store/productsStore'
import type { CreateProductInput } from '../types'

interface UseProductReturn {
  products: Ref<Product[]>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  loadProducts: () => Promise<void>
  addProduct: (productInput: CreateProductInput) => Promise<void>
  removeProduct: (productId: number) => void
  clearProducts: () => void
}

export function useProducts(): UseProductReturn {
  const store = useProductsStore()
  const { products, isLoading, error } = storeToRefs(store)

  return {
    products,
    isLoading,
    error,
    loadProducts: store.loadProducts,
    addProduct: store.addProduct,
    removeProduct: store.removeProduct,
    clearProducts: store.clearProducts
  }
}
