<script setup lang="ts">
import { ref, watch } from 'vue'

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

const inputValue = ref(String(props.modelValue))

watch(
  () => props.modelValue,
  (value) => {
    inputValue.value = String(value)
  }
)

function clamp(value: number): number {
  return Math.min(props.max, Math.max(props.min, value))
}

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

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const filtered = target.value.replace(/[^0-9]/g, '')

  inputValue.value = filtered
  target.value = filtered
}

function handleBlur(): void {
  const parsed = parseInt(inputValue.value, 10)

  if (Number.isNaN(parsed)) {
    inputValue.value = String(props.modelValue)
    return
  }

  const clamped = clamp(parsed)
  inputValue.value = String(clamped)

  if (clamped !== props.modelValue) {
    emit('update:modelValue', clamped)
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    ;(event.target as HTMLInputElement).blur()
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

    <input
      :value="inputValue"
      type="text"
      inputmode="numeric"
      aria-label="Quantity"
      class="w-1/3 bg-transparent text-center text-base text-gray-600 outline-none lg:text-lg"
      @input="handleInput"
      @blur="handleBlur"
      @keydown="handleKeydown"
    />

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
