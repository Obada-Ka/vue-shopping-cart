<script setup>
import CartHeaders from '@/components/ui/CartHeaders.vue'
import CartItemsList from '@/features/cart/components/CartItemsList.vue'
import CartListActions from '@/features/cart/components/CartListActions.vue'
import CartSummary from '@/features/cart/components/CartSummary.vue'
import ShippingCalculator from '@/features/shipping/components/ShippingCalculator.vue'
</script>
<template>
  <div class="grid grid-cols-5 grid-rows-5 gap-4">
    <CartHeaders class="col-span-4" />
    <CartItemsList class="col-span-4" />
    <CartSummary class="col-start-5" />
    <CartListActions class="col-span-4 row-start-3" />
    <ShippingCalculator class="col-start-5 row-start-3" />
  </div>
</template>
