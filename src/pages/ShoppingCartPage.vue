<script setup lang="ts">
import { computed, onMounted } from 'vue'

import CartHeaders from '@/components/ui/CartHeaders.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton.vue'
import { useCart } from '@/features/cart'
import CartSummary from '@/features/cart/components/CartSummary.vue'
import { useProducts } from '@/features/products'
import AddProduct from '@/features/products/components/AddProduct.vue'
import ClearProducts from '@/features/products/components/ClearProducts.vue'
import ShippingCalculator from '@/features/shipping/components/ShippingCalculator.vue'

const { products, isLoading, loadProducts, removeProduct } = useProducts()
const { items, updateQuantity, removeFromCart } = useCart()

onMounted(loadProducts)

const listItems = computed(() =>
  products.value.map((product) => {
    const cartItem = items.value.find((item) => item.productId === product.id)
    return {
      ...product,
      quantity: cartItem?.quantity ?? 0,
      total: cartItem?.total ?? 0
    }
  })
)

function handleQuantityChange(productId: number, quantity: number): void {
  const product = products.value.find((p) => p.id === productId)
  if (!product) return

  updateQuantity({ productId: product.id, name: product.title, price: product.price }, quantity)
}

function removeProductHandling(productId: number): void {
  removeFromCart(productId)
  removeProduct(productId)
}
</script>

<template>
  <div class="grid grid-cols-5 items-start gap-4">
    <div class="col-span-4">
      <div class="pb-10"><CartHeaders /></div>

      <template v-if="isLoading">
        <ProductCardSkeleton v-for="n in 5" :key="n" />
      </template>

      <template v-else>
        <ProductCard
          v-for="product in listItems"
          :key="product.id"
          :product="product"
          @remove="removeProductHandling"
          @quantity-change="handleQuantityChange"
        />
      </template>

      <div class="mt-4 flex gap-4">
        <AddProduct />
        <ClearProducts />
      </div>
    </div>

    <div class="flex flex-col gap-8">
      <div class="py-3 font-['Roboto'] text-xl font-bold text-[#1D3178]">Cart Totals</div>
      <CartSummary />
      <ShippingCalculator />
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
</style>
