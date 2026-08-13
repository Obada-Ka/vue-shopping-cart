<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import CartHeaders from '@/components/ui/CartHeaders'
import ProductCard from '@/components/ui/ProductCard'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton'
import { useCart } from '@/features/cart'
import CartSummary from '@/features/cart/components/CartSummary.vue'
import { useProducts } from '@/features/products'
import AddProduct from '@/features/products/components/AddProduct.vue'
import ClearProducts from '@/features/products/components/ClearProducts.vue'
import { useShipping } from '@/features/shipping'
import ShippingCalculator from '@/features/shipping/components/ShippingCalculator.vue'

const VAT_RATE = 0.2

const { products, isLoading, loadProducts, removeProduct, clearProducts } = useProducts()
const { items, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart()
const { cost: shippingCost, resetShipping } = useShipping()

const isSummaryOpen = ref(false)

onMounted(loadProducts)

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden')
})

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

const vat = computed(() => cartTotal.value * VAT_RATE)

const grandTotal = computed(() => cartTotal.value + (shippingCost.value ?? 0) + vat.value)

function handleQuantityChange(productId: number, quantity: number): void {
  const product = products.value.find((p) => p.id === productId)
  if (!product) return

  updateQuantity({ productId: product.id, name: product.title, price: product.price }, quantity)
}

function removeProductHandling(productId: number): void {
  removeFromCart(productId)
  removeProduct(productId)
}

function handleClearAll(): void {
  clearProducts()
  clearCart()
  resetShipping()
}

watch(isSummaryOpen, (open) => {
  document.body.classList.toggle('overflow-hidden', open)
})
</script>

<template>
  <div class="relative grid grid-cols-1 items-start gap-4 lg:grid-cols-5">
    <!--
  Accessibility note: I used pointer-events-none + scroll-lock here rather
  than the native `inert` attribute. This blocks all mouse/touch interaction
  with the background while the drawer is open, but does NOT prevent
  keyboard Tab navigation from reaching background elements — a known,
  accepted gap given this project's scope
  -->
    <div
      class="lg:col-span-4"
      :class="
        isSummaryOpen && 'pointer-events-none select-none lg:pointer-events-auto lg:select-auto'
      "
    >
      <div class="sticky top-0 z-10 block border-b border-gray-300 bg-white py-4 lg:hidden">
        <span class="text-brand text-xl font-bold"> Products </span>
      </div>

      <div class="min-h-fit overflow-y-auto lg:max-h-[625px] lg:min-h-0">
        <div class="hidden bg-white pb-4 lg:sticky lg:top-0 lg:z-10 lg:block">
          <CartHeaders :titles="['Product', 'Price', 'Quantity', 'Total']" />
        </div>
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
          <h2 class="text-brand text-2xl font-bold">Your cart is empty</h2>
          <p class="text-brand text-lg">Please try again later, or add an item.</p>
        </div>
      </div>

      <div class="sticky bottom-0 z-10 flex flex-col gap-4 bg-white py-4 lg:static lg:z-auto">
        <div class="flex gap-4 lg:justify-between">
          <AddProduct class="flex-1 lg:flex-none" />
          <template v-if="listItems.length">
            <ClearProducts class="flex-1 lg:flex-none" @clear="handleClearAll" />
          </template>
        </div>

        <button
          type="button"
          class="w-full rounded-md bg-[#1D3178] py-3 text-white lg:hidden"
          @click="isSummaryOpen = true"
        >
          View Cart Summary
        </button>
      </div>
    </div>

    <div
      v-if="isSummaryOpen"
      class="fixed inset-0 z-40 bg-black/40 lg:hidden"
      @click="isSummaryOpen = false"
    ></div>

    <div
      class="fixed inset-x-0 bottom-0 z-50 flex flex-col overflow-y-auto rounded-t-2xl bg-white p-4 transition-transform duration-300 ease-out lg:static lg:z-auto lg:max-h-none lg:translate-y-0 lg:overflow-visible lg:rounded-none lg:bg-transparent lg:p-0 lg:transition-none"
      :class="isSummaryOpen ? 'translate-y-0' : 'translate-y-full'"
    >
      <button
        type="button"
        class="text-brand self-end text-sm lg:hidden"
        @click="isSummaryOpen = false"
      >
        <X :size="16" :stroke-width="3" :absolute-stroke-width="true" />
      </button>

      <div class="text-brand py-3 text-center font-['Roboto'] text-xl font-bold">Cart Totals</div>
      <div class="flex flex-col gap-5">
        <CartSummary
          :subtotal="cartTotal"
          :shipping="shippingCost ?? 0"
          :tax="vat"
          :total="grandTotal"
        />
        <ShippingCalculator />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
</style>
