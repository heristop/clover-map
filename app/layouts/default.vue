<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useStore } from '~/composables/store'

const container = ref(null)
const useFullHeight = ref(false)
const store = useStore()

const checkContentHeight = () => {
  if (container.value) {
    const contentHeight = (container.value as HTMLElement)?.scrollHeight
    const windowHeight = window.innerHeight
    useFullHeight.value = contentHeight > windowHeight
  }
}

onMounted(() => {
  checkContentHeight()
  window.addEventListener('resize', checkContentHeight)
  const observer = new MutationObserver(checkContentHeight)

  if (container.value) {
    observer.observe(container.value, { childList: true, subtree: true })
  }
})

watch(() => store.displayLabel, () => {
  nextTick(() => checkContentHeight())
})

watch(() => store.viewMode, () => {
  nextTick(() => checkContentHeight())
})

onUnmounted(() => {
  window.removeEventListener('resize', checkContentHeight)
})
</script>

<template>
  <div
    ref="container"
    :class="['w-full', useFullHeight ? 'h-full' : 'h-screen', 'bg-stone-600', 'text-white']"
  >
    <slot />

    <ClientOnly>
      <NuxtSnackbar
        bottom
        right
        shadow
        success="#34d399"
        error="#f87171"
        info="#3b82f6"
      />
    </ClientOnly>
  </div>
</template>
