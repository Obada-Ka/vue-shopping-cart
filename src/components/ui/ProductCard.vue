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
  <div
    class="grid grid-cols-[2fr_1fr_1fr_1fr] items-center gap-8 border-b border-[#E1E1E4] py-4 font-['Roboto']"
  >
    <div class="flex min-w-0 items-center gap-4">
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
          class="absolute -top-2 -right-2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-black text-xs leading-none font-semibold text-white shadow-md transition hover:bg-gray-700"
          @click="handleRemove"
        >
          <X :size="8" :stroke-width="3" :absolute-stroke-width="true" />
        </button>
      </div>

      <div class="min-w-0">
        <h3 class="truncate text-sm font-normal">
          {{ product.title }}
        </h3>

        <p class="line-clamp-2 text-sm font-normal text-[#A1A8C1]">
          {{ product.description }}
        </p>
      </div>
    </div>

    <div class="min-w-0 text-center text-sm font-normal text-[#15245E]">
      ${{ product.price.toFixed(2) }}
    </div>

    <div class="min-w-0 text-center">
      <QuantityStepper
        :model-value="product.quantity"
        @update:model-value="(qty) => emit('quantity-change', product.id, qty)"
      />
    </div>

    <div class="min-w-0 text-center text-sm font-normal text-[#15245E]">
      ${{ product.total.toFixed(2) }}
    </div>
  </div>
</template>
