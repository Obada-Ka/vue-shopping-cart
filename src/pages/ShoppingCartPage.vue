<script setup lang="ts">
import { onMounted } from 'vue'

import CartHeaders from '@/components/ui/CartHeaders.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import CartSummary from '@/features/cart/components/CartSummary.vue'
import { useProducts } from '@/features/products'
import AddProduct from '@/features/products/components/AddProduct.vue'
import ClearProducts from '@/features/products/components/ClearProducts.vue'
import ShippingCalculator from '@/features/shipping/components/ShippingCalculator.vue'

const { products, loadProducts } = useProducts()
onMounted(loadProducts)

const removeProduct = (productId: number): void => {
  void productId
}
</script>
<template>
  <div class="grid grid-cols-5 items-start gap-4">
    <div class="col-span-4">
      <CartHeaders />

      <ProductCard
        v-for="product in products"
        :key="product.id"
        class="grid grid-cols-4 gap-4 py-3"
        :product="product"
        @remove="removeProduct"
      />

      <div class="mt-4 flex gap-4">
        <AddProduct />
        <ClearProducts />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="py-3 font-['Roboto'] font-semibold">Cart Totals</div>

      <CartSummary />

      <ShippingCalculator />
    </div>
  </div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
</style>
