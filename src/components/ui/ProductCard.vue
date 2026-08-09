<script setup lang="ts">
import { X } from 'lucide-vue-next'

import type { Product } from '@/domain/product/product.schema'
const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  remove: [productId: number]
}>()

const handleRemove = (): void => {
  emit('remove', props.product.id)
}
</script>

<template>
  <div class="grid grid-cols-4 items-center gap-4 border-b py-4 font-['Roboto']">
    <div class="flex items-center gap-4">
      <div class="relative h-20 w-20 shrink-0">
        <div class="h-full w-full overflow-hidden rounded-md border border-gray-300 bg-white p-2">
          <img :src="product.image" :alt="product.title" class="h-full w-full object-contain" />
        </div>

        <button
          type="button"
          aria-label="Remove product"
          class="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs leading-none font-semibold text-white shadow-md transition hover:bg-gray-700"
          @click="handleRemove"
        >
          <X :size="16" :stroke-width="3" :absolute-stroke-width="true" />
        </button>
      </div>

      <div class="min-w-0">
        <h3 class="truncate font-medium">
          {{ product.title }}
        </h3>

        <p class="line-clamp-2 text-sm text-gray-500">
          {{ product.description }}
        </p>
      </div>
    </div>

    <div>€{{ product.price.toFixed(2) }}</div>

    <div>quantity</div>

    <div class="font-semibold">€Total</div>
  </div>
</template>
