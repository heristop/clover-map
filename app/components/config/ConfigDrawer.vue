<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import ProgressBar from './ProgressBar.vue'
import StatusManager from './StatusManager.vue'
import ViewportSettings from './ViewportSettings.vue'
import TButton from '~/components/ui/TButton.vue'
import DarkModeToggle from '~/components/ui/DarkModeToggle.vue'
import { useStore } from '~/composables/store'

const store = useStore()
const drawerMinimized = computed(() => store.drawerMinimized)

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
      class=" bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-white shadow-lg text-sm border-r border-white border-opacity-20 transition-all duration-300 flex flex-col"
      :class="[drawerMinimized ? 'w-12' : 'w-80']"
    >
      <div
        class="header flex items-center px-2 py-3 bg-stone-700 dark:bg-stone-800"
        :class="{ 'justify-center': drawerMinimized, 'justify-between': !drawerMinimized }"
      >
        <template v-if="drawerMinimized">
          <button
            class="text-white rounded-full text-lg font-bold h-8 w-8 flex items-center justify-center"
            aria-label="Expand config"
            @click="toggleMinimize"
          >
            <svg
              class="w-5 h-5 text-stone-100 hover:text-stone-50 transition duration-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </template>
        <template v-else>
          <h2 class="text-base text-stone-100 font-bold px-2">
            Config
          </h2>
          <button
            class="text-white rounded-full text-lg font-bold h-8 w-8 flex items-center justify-center"
            aria-label="Minimize config"
            @click="toggleMinimize"
          >
            <svg
              class="w-4 h-4 text-stone-100 hover:text-stone-50 transition duration-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </template>
      </div>

      <div
        v-show="!drawerMinimized"
        class="flex-grow overflow-y-auto px-4 py-4"
      >
        <div class="mb-4 flex justify-end">
          <DarkModeToggle
            transparent
            size="sm"
          />
        </div>

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
          <h3 class="flex text-md font-bold mb-3">
            Display
          </h3>

          <div class="flex flex-col space-y-2">
            <div class="flex space-x-2">
              <TButton
                :is-active="store.displayLabel === 'name'"
                aria-label="Display name"
                size="sm"
                class="w-full"
                @click="setDisplay('name')"
              >
                Name
              </TButton>

              <TButton
                :is-active="store.displayLabel === 'key'"
                aria-label="Display key"
                size="sm"
                class="w-full"
                @click="setDisplay('key')"
              >
                Key
              </TButton>
            </div>

            <div class="flex space-x-2">
              <TButton
                :is-active="store.viewMode === 'flex'"
                aria-label="Flex view mode"
                size="sm"
                class="w-full"
                @click="toggleViewMode('flex')"
              >
                <template #icon>
                  <svg
                    class="w-4 h-4 mr-1"
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
                </template>
                Flex
              </TButton>

              <TButton
                :is-active="store.viewMode === 'grid'"
                aria-label="Grid view mode"
                size="sm"
                class="w-full"
                @click="toggleViewMode('grid')"
              >
                <template #icon>
                  <svg
                    class="w-4 h-4 mr-1"
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
                </template>
                Grid
              </TButton>
            </div>
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
      </div>
    </div>
  </transition>
</template>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
