<script setup lang="ts">
import { toast } from 'vue-sonner'

import BaseButton from '@/components/ui/BaseButton'

const props = defineProps<{
  subtotal: number
  shipping: number
  tax: number
  total: number
}>()
const emit = defineEmits<{
  checkout: []
}>()

const handleCheckout = (): void => {
  if (props.shipping === 0) {
    toast.warning('Proceeding without a calculated shipping cost')
  } else {
    toast.success('Proceeding to checkout!')
  }
  emit('checkout')
}
</script>

<template>
  <div class="text-brand bg-background flex flex-col gap-4 rounded-lg p-4 font-['Lato']">
    <div class="cart-row">
      <span>Subtotals</span>
      <span>${{ subtotal.toFixed(2) }}</span>
    </div>

    <div class="cart-row">
      <span>Shipping</span>
      <span>${{ shipping.toFixed(2) }}</span>
    </div>

    <div class="cart-row">
      <span>Tax (20%)</span>
      <span>${{ tax.toFixed(2) }}</span>
    </div>

    <div class="cart-row pt-4">
      <span>Totals</span>
      <span>${{ total.toFixed(2) }}</span>
    </div>

    <div class="flex justify-center">
      <BaseButton
        color="var(--color-brand-green)"
        size="md"
        font="Lato"
        font-weight="700"
        :disabled="subtotal === 0"
        @click="handleCheckout"
      >
        Proceed To Checkout
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
@reference "@/assets/styles/main.css";

@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

.cart-row {
  @apply text-brand border-divider flex justify-between border-b pb-2 text-base font-normal;
}

.cart-row span:first-child {
  @apply text-brand text-lg font-semibold;
}
</style>
