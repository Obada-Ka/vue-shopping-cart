<script setup lang="ts">
import { computed, watch } from 'vue'
import { ref } from 'vue'

import BaseButton from '@/components/ui/BaseButton.vue'

import { useShipping } from '../composables/useShipping'

const { cost, isCalculating, calculateShipping, resetShipping } = useShipping()

const city = ref('')
const street = ref('')
const zipCode = ref('')

const isCityValid = computed(() => city.value.trim().length > 0)
const isStreetValid = computed(() => street.value.trim().length > 0)
const isZipValid = computed(() => zipCode.value.trim().length > 0)

const isFormValid = computed(() => isCityValid.value && isStreetValid.value && isZipValid.value)

const isFormEmpty = computed(
  () => !city.value.trim() && !street.value.trim() && !zipCode.value.trim()
)

// Reset the calculated cost the moment the user clears every field —
// stale shipping cost shouldn't persist once the address it was based on
// has been wiped out.
watch(isFormEmpty, (empty) => {
  if (empty) {
    resetShipping()
  }
})

function handleSubmit(): void {
  if (!isFormValid.value) return
  calculateShipping()
}
</script>

<template>
  <form
    class="flex flex-col gap-4 rounded-lg bg-[#F4F4FC] p-4 font-['Lato'] text-[#1D3178]"
    @submit.prevent="handleSubmit"
  >
    <div class="cart-row flex-col items-start gap-1 border-none pb-0">
      <input
        v-model="city"
        type="text"
        placeholder="City"
        class="w-full rounded rounded-b-none border-b p-2 text-base font-normal text-[#1D3178] outline-none!"
        :class="!isCityValid && city.length === 0 ? 'border-[#0843FC]' : 'border-[#0843FC]'"
        required
      />
    </div>

    <div class="cart-row flex-col items-start gap-1 border-none pb-0">
      <input
        v-model="street"
        type="text"
        placeholder="Street"
        class="w-full rounded rounded-b-none border-b border-[#0843FC] p-2 text-base font-normal text-[#1D3178] outline-none!"
        required
      />
    </div>

    <div class="cart-row flex-col items-start gap-1 border-none pb-0">
      <input
        v-model="zipCode"
        type="text"
        placeholder="Zip Code"
        class="w-full rounded rounded-b-none border-b border-[#0843FC] p-2 text-base font-normal text-[#1D3178] outline-none!"
        required
      />
    </div>

    <div v-if="cost !== null" class="cart-row">
      <span>Shipping cost</span>
      <span>${{ cost.toFixed(2) }}</span>
    </div>

    <div class="flex justify-center">
      <BaseButton color="#FB2E86" type="submit" :disabled="!isFormValid || isCalculating">
        {{ isCalculating ? 'Calculating…' : 'Calculate Shipping' }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
@reference "@/assets/styles/main.css";

.cart-row {
  @apply flex justify-between pb-2 text-base font-normal text-[#1D3178];
}

.cart-row span:first-child {
  @apply text-lg font-semibold text-[#1D3178];
}
</style>
