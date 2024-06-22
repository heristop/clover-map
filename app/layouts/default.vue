<template>
  <div :class="['w-full', useFullHeight ? 'h-full' : 'md:h-screen', 'bg-neutral-600', 'text-white']">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '~/composables/store'

const sectionStore = useStore()
const useFullHeight = computed(() => sectionStore.useFullHeight)
</script>
