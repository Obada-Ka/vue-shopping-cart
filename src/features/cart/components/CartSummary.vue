<script setup lang="ts">
import { computed } from 'vue'

import BaseButton from '@/components/ui/BaseButton.vue'
import { useCart } from '@/features/cart'

const { cartTotal } = useCart()

const tax = computed(() => cartTotal.value * 0.2)

const total = computed(() => {
  if (cartTotal.value) {
    return cartTotal.value + tax.value + 100
  }
  return 0
})
</script>

<template>
  <div class="flex flex-col gap-4 rounded-lg bg-[#F4F4FC] p-4 font-['Lato'] text-[#1D3178]">
    <div class="cart-row">
      <span>Subtotals</span>
      <span>${{ cartTotal.toFixed(2) }}</span>
    </div>
    <div class="cart-row">
      <span>Shipping</span>
      <span>$100</span>
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
        color="#19D16F"
        size="md"
        font="Lato"
        font-weight="700"
        :disabled="cartTotal === 0"
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
  @apply flex justify-between border-b border-[#E8E6F1] pb-2 text-base font-normal text-[#1D3178];
}

.cart-row span:first-child {
  @apply text-lg font-semibold text-[#1D3178];
}
</style>
