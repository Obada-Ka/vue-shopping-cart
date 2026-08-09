<script setup lang="ts">
interface Props {
  modelValue: number
  min?: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: Infinity
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function decrement(): void {
  if (props.modelValue > props.min) {
    emit('update:modelValue', props.modelValue - 1)
  }
}

function increment(): void {
  if (props.modelValue < props.max) {
    emit('update:modelValue', props.modelValue + 1)
  }
}
</script>

<template>
  <div class="inline-flex h-1/2 w-1/2 overflow-hidden rounded-lg bg-indigo-50">
    <button
      type="button"
      aria-label="Decrease quantity"
      class="flex w-1/3 cursor-pointer items-center justify-center bg-indigo-100 text-lg font-medium text-gray-400 transition hover:bg-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="modelValue <= min"
      @click="decrement"
    >
      &minus;
    </button>

    <div class="flex w-1/3 items-center justify-center text-lg text-gray-400">
      {{ modelValue }}
    </div>

    <button
      type="button"
      aria-label="Increase quantity"
      class="flex w-1/3 cursor-pointer items-center justify-center bg-indigo-100 text-lg font-medium text-gray-400 transition hover:bg-indigo-200 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="modelValue >= max"
      @click="increment"
    >
      +
    </button>
  </div>
</template>
