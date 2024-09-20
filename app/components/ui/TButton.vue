<script setup lang="ts">
import { computed } from 'vue'

interface ButtonProps {
  isActive?: boolean
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  ariaLabel?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  isActive: false,
  size: 'md',
  fullWidth: false,
  ariaLabel: '',
  disabled: false,
  type: 'button',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const sizeClasses = computed(() => ({
  sm: 'px-2 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}[props.size]))

const stateClasses = computed(() => {
  if (props.disabled) {
    return 'bg-stone-300 text-stone-500 cursor-not-allowed dark:bg-stone-600 dark:text-stone-400 border-stone-400 dark:border-stone-500'
  }
  return props.isActive
    ? 'bg-stone-500 dark:bg-stone-100 text-white dark:text-stone-500 border-stone-600 dark:border-stone-300'
    : 'bg-stone-200 hover:bg-stone-300 border-stone-200 text-stone-700 dark:bg-stone-500 dark:hover:bg-stone-600 dark:text-stone-200 dark:border-stone-400 hover:border-stone-400 dark:hover:border-stone-300'
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="[
      'flex items-center justify-center rounded shadow transition-all duration-200',
      'border-2 border-opacity-45 focus:shadow-md',
      sizeClasses,
      stateClasses,
      { 'w-full': fullWidth },
    ]"
    :aria-label="ariaLabel"
    :disabled="disabled"
    :type="type"
    @click="handleClick"
  >
    <span
      v-if="$slots.icon"
      class="mr-2 transition-transform duration-200 ease-in-out group-hover:scale-110"
    >
      <slot name="icon" />
    </span>
    <slot />
  </button>
</template>
