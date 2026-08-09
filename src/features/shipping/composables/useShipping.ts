import { storeToRefs } from 'pinia'
import type { Ref } from 'vue'

import { useShippingStore } from '../store/shippingStore'

interface UseShippingReturn {
  cost: Ref<number | null>
  isCalculating: Ref<boolean>
  calculateShipping: () => void
  resetShipping: () => void
}

export function useShipping(): UseShippingReturn {
  const store = useShippingStore()
  const { cost, isCalculating } = storeToRefs(store)

  return {
    cost,
    isCalculating,
    calculateShipping: store.calculateShipping,
    resetShipping: store.resetShipping
  }
}
