<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '~/composables/store'

const props = defineProps({
  fixed: {
    type: Boolean,
    default: false,
  },
  dark: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'md',
  },
  position: {
    type: String,
    default: '',
  },
})

const store = useStore()
const darkMode = computed(() => store.darkMode)

const toggleDarkMode = () => {
  store.darkMode = !store.darkMode

  if (store.darkMode) {
    document.documentElement.classList.add('dark')
  }
  else {
    document.documentElement.classList.remove('dark')
  }
}

const buttonClasses = computed(() => {
  return [
    props.fixed ? 'fixed' : '',
    props.position,
    props.dark ? 'text-stone-100 hover:text-white bg-stone-600 hover:bg-stone-500 dark:bg-stone-600 dark:hover:text-stone-200 dark:hover:bg-stone-500' : 'text-stone-600 hover:text-stone-800 bg-stone-100 hover:bg-white dark:bg-stone-700 dark:hover:bg-stone-600 dark:text-stone-100 dark:hover:text-white',
    props.size === 'sm' ? 'p-1' : 'p-2',
    'transition-colors duration-300 rounded-full shadow-sm',
  ]
})

const iconClasses = computed(() => {
  return props.size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
})
</script>

<template>
  <button
    :class="buttonClasses"
    aria-label="Toggle dark mode"
    @click="toggleDarkMode"
  >
    <svg
      v-if="darkMode"
      :class="iconClasses"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
      />
    </svg>
    <svg
      v-else
      :class="iconClasses"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z"
      />
    </svg>
  </button>
</template>
