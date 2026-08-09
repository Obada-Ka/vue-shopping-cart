<script setup lang="ts">
import { X } from 'lucide-vue-next'

import QuantityStepper from '@/components/ui/QuantityStepper.vue'

interface Props {
  product: {
    id: number
    title: string
    description: string
    image: string
    price: number
    quantity: number
    total: number
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  remove: [productId: number]
  'quantity-change': [productId: number, quantity: number]
}>()

function handleRemove(): void {
  emit('remove', props.product.id)
}
</script>

<template>
  <div class="product-card border-b border-[#E1E1E4] px-2 py-4 font-['Roboto']">
    <div class="product-area flex min-w-0 items-center gap-4">
      <div class="relative h-20 w-20 shrink-0">
        <div class="h-full w-full overflow-hidden rounded-md border border-gray-300 bg-white p-2">
          <img
            v-if="product.image"
            :src="product.image"
            :alt="product.title"
            class="h-full w-full object-contain p-2"
          />

          <span v-else class="text-center text-sm text-gray-400"> No image available </span>
        </div>
        <button
          type="button"
          aria-label="Remove product"
          class="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-semibold text-white shadow-md transition hover:bg-gray-700 lg:-right-2 lg:left-auto"
          @click="handleRemove"
        >
          <X :size="12" :stroke-width="3" :absolute-stroke-width="true" />
        </button>
      </div>

      <div class="min-w-0">
        <h3 class="truncate text-sm font-normal">{{ product.title }}</h3>
        <p class="line-clamp-2 text-sm font-normal text-[#A1A8C1]">{{ product.description }}</p>
      </div>
    </div>

    <span class="price-label label">Price</span>
    <span class="price-value value">${{ product.price.toFixed(2) }}</span>

    <span class="qty-label label">Quantity</span>
    <div class="qty-value value flex">
      <QuantityStepper
        :model-value="product.quantity"
        @update:model-value="(qty) => emit('quantity-change', product.id, qty)"
      />
    </div>

    <span class="total-label label">Total</span>
    <span class="total-value value">${{ product.total.toFixed(2) }}</span>
  </div>
</template>

<style scoped>
@reference "@/assets/styles/main.css";

.label {
  @apply text-sm font-semibold text-[#1D3178];
}
.value {
  @apply text-sm text-[#15245E];
}

.product-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'product product'
    'price-label price-value'
    'qty-label qty-value'
    'total-label total-value';
  row-gap: 0.75rem;
  column-gap: 1rem;
}
.product-area {
  grid-area: product;
}
.price-label {
  grid-area: price-label;
  align-self: center;
}
.price-value {
  grid-area: price-value;
  align-self: center;
  justify-self: end;
}
.qty-label {
  grid-area: qty-label;
  align-self: center;
}
.qty-value {
  grid-area: qty-value;
  justify-content: flex-end;
}
.total-label {
  grid-area: total-label;
  align-self: center;
}
.total-value {
  grid-area: total-value;
  align-self: center;
  justify-self: end;
}

@media (min-width: 768px) and (max-width: 1023.98px) {
  .product-card {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      'product product product'
      'price-label qty-label total-label'
      'price-value qty-value total-value';
    column-gap: 2rem;
    row-gap: 0.5rem;
  }
  .label,
  .value {
    justify-self: center;
    text-align: center;
  }
  .qty-value {
    justify-content: center;
  }
}

@media (min-width: 1024px) {
  .product-card {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    grid-template-areas: 'product price-value qty-value total-value';
    align-items: center;
    column-gap: 2rem;
    row-gap: 0;
  }
  .label {
    display: none;
  }
  .value {
    justify-self: center;
  }
  .qty-value {
    justify-content: center;
  }
}
</style>
