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
  <div class="inline-flex h-9 w-32 overflow-hidden rounded-lg bg-indigo-50 lg:h-11 lg:w-44">
    <button
      type="button"
      aria-label="Decrease quantity"
      class="flex w-1/3 cursor-pointer items-center justify-center bg-indigo-100 text-base font-medium text-gray-400 transition hover:bg-indigo-200 disabled:cursor-not-allowed disabled:opacity-50 lg:text-lg"
      :disabled="modelValue <= min"
      @click="decrement"
    >
      &minus;
    </button>

    <div class="flex w-1/3 items-center justify-center text-base text-gray-400 lg:text-lg">
      {{ modelValue }}
    </div>

    <button
      type="button"
      aria-label="Increase quantity"
      class="flex w-1/3 cursor-pointer items-center justify-center bg-indigo-100 text-base font-medium text-gray-400 transition hover:bg-indigo-200 disabled:cursor-not-allowed disabled:opacity-50 lg:text-lg"
      :disabled="modelValue >= max"
      @click="increment"
    >
      +
    </button>
  </div>
</template>
