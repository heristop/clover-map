<template>
  <button
    :class="[isActive ? 'bg-neutral-600' : 'bg-neutral-900', 'flex w-full shadow-md items-center justify-center font-semibold border-2 border-neutral-600 text-white px-2 py-1 rounded-md transition duration-300 hover:bg-neutral-600']"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  isActive: boolean
}>(), {
  isActive: false,
})

defineEmits(['click'])
</script>
