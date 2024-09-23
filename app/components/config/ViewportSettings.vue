<script setup lang="ts">
import { computed } from 'vue'
import CloverButton from '~/components/ui/CloverButton.vue'
import { useStore } from '~/composables/store'
import { useTreemapCapture } from '~/composables/capture'

const store = useStore()
const { captureTreeMap } = useTreemapCapture()

const minWidth = computed({
  get: () => store.minWidth,
  set: value => store.minWidth = value,
})

const minHeight = computed({
  get: () => store.minHeight,
  set: value => store.minHeight = value,
})
</script>

<template>
  <div class="flex items-center space-x-2 justify-between mb-3">
    <CloverButton
      :is-active="store.isEditingMode"
      size="sm"
      class="w-full truncate"
      @click="store.toggleEditingMode()"
    >
      <template #icon>
        <svg
          class="w-4 h-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
          />
        </svg>
      </template>

      Edit Mode
    </CloverButton>

    <CloverButton
      :is-active="false"
      size="sm"
      class="w-full"
      @click="captureTreeMap"
    >
      <template #icon>
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 26 26"
        >
          <path
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 18V8a1 1 0 0 1 1-1h1.5l1.707-1.707A1 1 0 0 1 8.914 5h6.172a1 1 0 0 1 .707.293L17.5 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"
          />
          <path
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </template>

      Capture
    </CloverButton>
  </div>

  <div class="flex items-center space-x-4 mb-4 px-2">
    <div class="flex flex-col items-start space-y-2">
      <span class="text-xs text-stone-600 dark:text-stone-300">Width</span>
      <input
        v-model="minWidth"
        type="range"
        min="0"
        max="500"
        class="w-full h-2 bg-stone-300 dark:bg-stone-200 rounded-lg appearance-none cursor-pointer"
      >
    </div>

    <div class="flex flex-col items-start space-y-2">
      <span class="text-xs text-stone-600 dark:text-stone-300">Height</span>
      <input
        v-model="minHeight"
        type="range"
        min="0"
        max="500"
        class="w-full h-2 bg-stone-300 dark:bg-stone-200 rounded-lg appearance-none cursor-pointer"
      >
    </div>
  </div>
</template>
