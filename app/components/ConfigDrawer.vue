<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProgressBar from './ProgressBar.vue'
import UploadDownload from './UploadDownload.vue'
import StatusManager from './StatusManager.vue'
import ViewportSettings from './ViewportSettings.vue'
import TButton from './ui/TButton.vue'
import { useStore } from '~/composables/store'

const router = useRouter()
const store = useStore()
const drawerMinimized = computed(() => store.dialogMinimized)

const size = reactive({ width: 320 })
const isPositioned = ref(false)

const toggleMinimize = () => {
  isPositioned.value = false
  store.toggleMinimize()
  nextTick(() => isPositioned.value = true)
}

const setDisplay = (value: string) => {
  store.display = value
}

const resetConfiguration = () => {
  store.clear()
  router.push('/')
}

onMounted(() => {
  nextTick(() => isPositioned.value = true)
})
</script>

<template>
  <transition name="slide-fade">
    <div
      v-if="isPositioned"
      class="fixed top-0 right-0 bg-opacity-80 bg-neutral-800 text-white rounded-l-md shadow-lg space-y-4 text-sm border-white border-opacity-20 border-2 z-50"
      :style="{ width: drawerMinimized ? '40px' : `${size.width}px`, height: drawerMinimized ? 'auto' : '100vh' }"
    >
      <div
        class="header flex justify-between items-center rounded-l-md bg-neutral-800 px-2 py-1"
      >
        <h2
          v-if="!drawerMinimized"
          class="text-base font-bold"
        >
          Config
        </h2>

        <button
          class="text-white rounded-full text-lg font-bold h-8 w-8"
          @click="toggleMinimize"
        >
          {{ drawerMinimized ? '+' : '-' }}
        </button>
      </div>

      <div
        v-show="!drawerMinimized"
        class="px-4 max-h-[calc(100vh-64px)] overflow-y-auto"
      >
        <h3 class="text-md font-bold mb-3">
          Progress
        </h3>

        <ProgressBar class="mb-4" />

        <div class="config-section">
          <h3 class="text-md font-bold mb-3">
            Viewport
          </h3>

          <ViewportSettings />
        </div>

        <div class="config-section">
          <h3 class="text-md font-bold mb-3">
            Display
          </h3>

          <div class="flex items-center justify-between space-x-2 mb-3">
            <TButton
              :is-active="store.display === 'name'"
              @click="setDisplay('name')"
            >
              name
            </TButton>

            <TButton
              :is-active="store.display === 'key'"
              @click="setDisplay('key')"
            >
              key
            </TButton>
          </div>
        </div>

        <div class="config-section">
          <h3 class="text-md font-bold mb-3">
            Flow
          </h3>

          <div>
            <StatusManager />
          </div>
        </div>

        <div class="config-section">
          <h3 class="text-md font-bold mb-3">
            Import/Export JSON
          </h3>

          <UploadDownload />
        </div>

        <div class="config-section">
          <h3 class="text-md font-bold mb-3">
            Reset Configuration
          </h3>

          <div class="flex items-center justify-between space-x-2 mb-3">
            <TButton
              :is-active="false"
              class="border-red-600 bg-red-700 hover:bg-red-600"
              aria-label="reset"
              @click="resetConfiguration"
            >
              reset
            </TButton>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.minimized .header {
  display: flex;
  justify-content: flex-end;
}
.status-item {
  cursor: grab;
}
.status-item:active {
  cursor: grabbing;
}
</style>
