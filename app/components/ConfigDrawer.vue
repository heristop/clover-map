<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import ProgressBar from './ProgressBar.vue'
import UploadDownload from './UploadDownload.vue'
import StatusManager from './StatusManager.vue'
import ViewportSettings from './ViewportSettings.vue'
import TButton from './ui/TButton.vue'
import { useStore } from '~/composables/store'

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
  store.displayLabel = value
}

const toggleViewMode = (mode: string) => {
  store.viewMode = mode
}

onMounted(() => {
  nextTick(() => isPositioned.value = true)
})
</script>

<template>
  <transition name="slide-fade">
    <div
      v-if="isPositioned"
      class="fixed top-0 right-0 bg-opacity-80 bg-stone-800 text-white rounded-l-md shadow-lg space-y-4 text-sm border-white border-opacity-20 border-2 z-50"
      :style="{ width: drawerMinimized ? '40px' : `${size.width}px`, height: drawerMinimized ? 'auto' : '100vh' }"
    >
      <div
        class="header flex justify-between items-center rounded-l-md bg-stone-800 px-2 py-1"
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

        <ProgressBar class="mb-6" />

        <div class="config-section mb-6">
          <h3 class="text-md font-bold mb-3">
            Viewport
          </h3>

          <ViewportSettings />
        </div>

        <div class="config-section mb-6">
          <h3 class="text-md font-bold mb-3">
            Display
          </h3>

          <div class="flex items-center justify-between space-x-2 mb-3">
            <TButton
              :is-active="store.displayLabel === 'name'"
              size="sm"
              class="w-full"
              @click="setDisplay('name')"
            >
              Name
            </TButton>

            <TButton
              :is-active="store.displayLabel === 'key'"
              size="sm"
              class="w-full"
              @click="setDisplay('key')"
            >
              Key
            </TButton>

            <span class="text-stone-400 mx-4">|</span>

            <TButton
              :is-active="store.viewMode === 'flex'"
              size="sm"
              @click="toggleViewMode('flex')"
            >
              <svg
                class="w-4 h-4 text-stone-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z"
                />
              </svg>
            </TButton>

            <TButton
              :is-active="store.viewMode === 'grid'"
              size="sm"
              @click="toggleViewMode('grid')"
            >
              <svg
                class="w-4 h-4 text-stone-800"
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
                  d="M15 5v14M9 5v14M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                />
              </svg>
            </TButton>
          </div>
        </div>

        <div class="config-section mb-6">
          <h3 class="text-md font-bold mb-3">
            Flow
          </h3>

          <div>
            <StatusManager />
          </div>
        </div>

        <div class="config-section mb-6">
          <h3 class="text-md font-bold mb-3">
            Configuration
          </h3>

          <UploadDownload />
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
