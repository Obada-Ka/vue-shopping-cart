<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { computed, onMounted } from 'vue'
import { ref } from 'vue'

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

const isSummaryOpen = ref(false)

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
  <div class="relative grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
    <div class="lg:col-span-4">
      <div class="hidden pb-10 lg:block"><CartHeaders /></div>

      <div class="max-h-[480px] overflow-y-auto">
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
      </div>

      <div v-if="!isLoading && !listItems.length">
        <div class="flex flex-col items-center justify-center gap-4 rounded-md bg-[#D6D6D6] py-20">
          <h2 class="text-2xl font-bold text-[#1D3178]">Your cart is empty</h2>
          <p class="text-lg text-[#1D3178]">Please try again later, or add an item.</p>
        </div>
      </div>

      <div class="mt-8 flex gap-4 lg:justify-between">
        <AddProduct class="flex-1 lg:flex-none" />
        <template v-if="listItems.length">
          <ClearProducts class="flex-1 lg:flex-none" />
        </template>
      </div>

      <button
        type="button"
        class="mt-4 w-full rounded-md bg-[#1D3178] py-3 text-white lg:hidden"
        @click="isSummaryOpen = true"
      >
        View cart summary
      </button>
    </div>

    <div
      v-if="isSummaryOpen"
      class="fixed inset-0 z-40 bg-black/40 lg:hidden"
      @click="isSummaryOpen = false"
    ></div>

    <div
      class="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-4 overflow-y-auto rounded-t-2xl bg-white p-4 transition-transform duration-300 ease-out lg:static lg:z-auto lg:max-h-none lg:translate-y-0 lg:overflow-visible lg:rounded-none lg:bg-transparent lg:p-0 lg:transition-none"
      :class="isSummaryOpen ? 'translate-y-0' : 'translate-y-full'"
    >
      <button
        type="button"
        class="self-end text-sm text-[#1D3178] lg:hidden"
        @click="isSummaryOpen = false"
      >
        <X :size="16" :stroke-width="3" :absolute-stroke-width="true" />
      </button>

      <div class="py-3 text-center font-['Roboto'] text-xl font-bold text-[#1D3178]">
        Cart Totals
      </div>
      <CartSummary />
      <ShippingCalculator />
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
</style>
