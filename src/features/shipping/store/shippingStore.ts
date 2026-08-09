import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useShippingStore = defineStore('shipping', () => {
  const cost = ref<number | null>(null)
  const isCalculating = ref(false)

  function calculateShipping(): void {
    isCalculating.value = true

    setTimeout(() => {
      cost.value = Math.round((Math.random() * 20 + 5) * 100) / 100
      isCalculating.value = false
    }, 500)
  }

  function resetShipping(): void {
    cost.value = null
  }

  return { cost, isCalculating, calculateShipping, resetShipping }
})
