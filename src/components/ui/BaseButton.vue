<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  color: '#000000',
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center gap-2',
  'rounded-md font-medium transition-colors',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:cursor-not-allowed disabled:opacity-50',

  {
    'bg-black text-white hover:bg-gray-800 focus:ring-black': props.variant === 'primary',

    'border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-400':
      props.variant === 'secondary',

    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': props.variant === 'danger',

    'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400': props.variant === 'ghost'
  },

  {
    'px-3 py-1.5 text-sm': props.size === 'sm',
    'px-4 py-2 text-sm': props.size === 'md',
    'px-5 py-2.5 text-base': props.size === 'lg'
  }
])

const handleClick = (event: MouseEvent): void => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    :style="{ backgroundColor: color }"
    class="cursor-pointer"
    @click="handleClick"
  >
    <span
      v-if="loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />

    <slot v-else />
  </button>
</template>
