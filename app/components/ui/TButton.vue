<script setup lang="ts">
withDefaults(defineProps<{
  isActive?: boolean
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  ariaLabel?: string
}>(), {
  isActive: false,
  size: 'md',
  fullWidth: false,
  ariaLabel: '',
})

defineEmits(['click'])
</script>

<template>
  <button
    :class="[
      'flex items-center justify-center rounded shadow transition-colors duration-200',
      'border-2 border-opacity-45',
      size === 'sm' ? 'px-2 py-2 text-xs' : size === 'md' ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base',
      isActive
        ? 'bg-stone-500 dark:bg-stone-100 text-white dark:text-stone-500 border-stone-600 dark:border-stone-300'
        : 'bg-stone-200 hover:bg-stone-300 border-stone-300 text-stone-700 dark:bg-stone-500 dark:hover:bg-stone-600 dark:text-stone-200 dark:border-stone-400 hover:border-stone-400 dark:hover:border-stone-400',
      fullWidth ? 'w-full' : '',
    ]"
    :aria-label="ariaLabel"
    @click="$emit('click')"
  >
    <slot name="icon" />
    <slot />
  </button>
</template>
