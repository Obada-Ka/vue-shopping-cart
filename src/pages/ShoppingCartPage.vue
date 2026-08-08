<script setup lang="ts">
import { onMounted } from 'vue'

import CartHeaders from '@/components/ui/CartHeaders.vue'
import CartListActions from '@/features/cart/components/CartListActions.vue'
import CartSummary from '@/features/cart/components/CartSummary.vue'
import { useProducts } from '@/features/products'
import ShippingCalculator from '@/features/shipping/components/ShippingCalculator.vue'

const { products, loadProducts } = useProducts()
onMounted(loadProducts)
</script>
<template>
  <div class="grid grid-cols-5 grid-rows-5 gap-4">
    <CartHeaders class="col-span-4" />
    <div class="col-span-4">
      <div v-for="product in products" :key="product.id">
        <span>{{ product.category }} </span>
      </div>
    </div>
    <CartSummary class="col-start-5" />
    <CartListActions class="col-span-4 row-start-3" />
    <ShippingCalculator class="col-start-5 row-start-3" />
  </div>
</template>
