<script setup lang="ts">
import { computed } from 'vue'

interface ButtonProps {
  isActive?: boolean
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  ariaLabel?: string
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'link'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  isActive: false,
  size: 'md',
  fullWidth: false,
  ariaLabel: undefined,
  disabled: false,
  loading: false,
  type: 'button',
  variant: 'primary',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const sizeClasses = computed(() => ({
  sm: 'px-2 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}[props.size]))

const variantClasses = computed(() => ({
  primary: 'bg-stone-200 hover:bg-stone-300 text-stone-600',
  secondary: 'bg-neutral-500 hover:bg-neutral-600 text-white',
  danger: 'bg-rose-500 hover:bg-rose-600 text-white',
  link: 'bg-transparent text-stone-500 underline',
}[props.variant]))

const stateClasses = computed(() => {
  if (props.disabled || props.loading) {
    return 'bg-stone-300 text-stone-500 cursor-not-allowed dark:bg-stone-600 dark:text-stone-400 border-stone-400 dark:border-stone-500'
  }
  return props.isActive
    ? 'bg-stone-500 dark:bg-stone-100 text-white dark:text-stone-500 border-stone-600 dark:border-stone-300'
    : 'bg-stone-200 hover:bg-stone-300 border-stone-200 text-stone-700 dark:bg-stone-500 dark:hover:bg-stone-600 dark:text-stone-200 dark:border-stone-400 hover:border-stone-400 dark:hover:border-stone-300'
})

const buttonClasses = computed(() => [
  'flex items-center justify-center rounded shadow transition-all duration-200',
  'focus:ring-2 focus:ring-offset-2 focus:ring-stone-500',
  sizeClasses.value,
  stateClasses.value,
  variantClasses.value,
  { 'w-full': props.fullWidth },
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="buttonClasses"
    :aria-label="ariaLabel || undefined"
    :aria-disabled="(disabled || loading) ? 'true' : undefined"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <template v-if="loading">
      <slot name="loading">
        <span class="mr-2 animate-spin">
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </span>
        Loading...
      </slot>
    </template>
    <template v-else>
      <span
        v-if="$slots.icon"
        :class="[
          'transition-transform duration-200 ease-in-out group-hover:scale-110',
          { 'mr-2': !!$slots.default },
        ]"
      >
        <slot name="icon" />
      </span>
      <slot />
    </template>
  </button>
</template>
