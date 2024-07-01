<template>
  <button
    :class="[
      isActive ? 'text-stone-600 bg-stone-300 dark:bg-stone-300' : 'bg-stone-400 dark:bg-stone-100 text-white',
      size === 'sm' ? 'px-2 py-[0.4rem] text-xs' : size === 'md' ? 'px-4 py-[0.4rem] text-sm' : 'px-6 py-3 text-base',
      'flex text-sm shadow-sm items-center justify-center font-semibold border-2 border-opacity-45 hover:border-opacity-25 border-stone-300 hover:text-stone-600 dark:text-stone-600 rounded-md transition duration-300 hover:border-stone-400 hover:bg-stone-300 dark:hover:bg-stone-300',
    ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  isActive?: boolean
  size?: 'sm' | 'md' | 'lg'
}>(), {
  isActive: false,
  size: 'md',
})

defineEmits(['click'])
</script>
