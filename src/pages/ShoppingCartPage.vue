<script setup lang="ts">
import { onMounted } from 'vue'

import CartHeaders from '@/components/ui/CartHeaders.vue'
import CartSummary from '@/features/cart/components/CartSummary.vue'
import { useProducts } from '@/features/products'
import AddProduct from '@/features/products/components/AddProduct.vue'
import ClearProducts from '@/features/products/components/ClearProducts.vue'
import ShippingCalculator from '@/features/shipping/components/ShippingCalculator.vue'

const { products, loadProducts } = useProducts()
onMounted(loadProducts)
</script>
<template>
  <div class="grid grid-cols-5 items-start gap-4">
    <!-- Left: Cart -->
    <div class="col-span-4">
      <CartHeaders />

      <div v-for="product in products" :key="product.id" class="grid grid-cols-4 gap-4 py-3">
        <span>{{ product.category }}</span>
        <span>{{ product.price }}</span>
      </div>

      <div class="mt-4 flex gap-4">
        <AddProduct />
        <ClearProducts />
      </div>
    </div>

    <!-- Right: Cart totals column -->
    <div class="flex flex-col gap-4">
      <div class="py-3 font-semibold">Cart Totals</div>

      <CartSummary />

      <ShippingCalculator />
    </div>
  </div>
</template>
