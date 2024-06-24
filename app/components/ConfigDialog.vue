<script setup lang="ts">
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import domtoimage from 'dom-to-image'
import ProgressBar from './ProgressBar.vue'
import { useStore } from '~/composables/store'
import type { Section } from '~~/types'

const router = useRouter()
const store = useStore()
const dialogMinimized = computed(() => store.dialogMinimized)
const statuses = computed(() => store.statuses)
const dialogCoordinates = computed(() => store.dialogCoordinates)

const minWidth = computed({
  get: () => store.minWidth,
  set: value => store.minWidth = value,
})

const minHeight = computed({
  get: () => store.minHeight,
  set: value => store.minHeight = value,
})

const newStatus = reactive({
  name: '',
  color: '',
})

const addNewStatus = () => {
  if (newStatus.name && newStatus.color) {
    store.addStatus({ name: newStatus.name, color: newStatus.color })
    newStatus.name = ''
    newStatus.color = ''
  }
}

const removeStatus = (index: number) => {
  store.removeStatus(index)
}

const position = reactive({ x: dialogCoordinates.value.x, y: dialogCoordinates.value.y })
const size = reactive({ width: 400 })
const dragOffset = reactive({ x: 0, y: 0 })
const inputFocused = ref(false)
const isPositioned = ref(false)
let isDragging = false

const toggleMinimize = () => {
  store.toggleMinimize()
}

const setDisplay = (value: string) => {
  store.display = value
}

const startDialogDrag = (event: MouseEvent | TouchEvent) => {
  if (event instanceof MouseEvent) {
    dragOffset.x = event.clientX - position.x
    dragOffset.y = event.clientY - position.y
  }
  else if (event instanceof TouchEvent && event.touches.length > 0) {
    const touch = event.touches[0]
    dragOffset.x = (touch?.clientX ?? 0) - position.x
    dragOffset.y = (touch?.clientY ?? 0) - position.y
  }
  isDragging = true
  document.addEventListener('mousemove', dragDialog)
  document.addEventListener('mouseup', stopDialogDrag)
  document.addEventListener('touchmove', dragDialog)
  document.addEventListener('touchend', stopDialogDrag)
}

const dragDialog = (event: MouseEvent | TouchEvent) => {
  if (!isDragging) return
  if (event instanceof MouseEvent) {
    position.x = event.clientX - dragOffset.x
    position.y = event.clientY - dragOffset.y
  }
  else if (event instanceof TouchEvent && event.touches.length > 0) {
    const touch = event.touches[0]
    position.x = (touch?.clientX ?? 0) - dragOffset.x
    position.y = (touch?.clientY ?? 0) - dragOffset.y
  }
  checkPositionBounds()
}

const stopDialogDrag = () => {
  isDragging = false
  store.updateDialogCoordinates(position.x, position.y)
  document.removeEventListener('mousemove', dragDialog)
  document.removeEventListener('mouseup', stopDialogDrag)
  document.removeEventListener('touchmove', dragDialog)
  document.removeEventListener('touchend', stopDialogDrag)
}

const disableStatusDrag = () => {
  inputFocused.value = true
}

const enableStatusDrag = () => {
  inputFocused.value = false
}

const startStatusDrag = (event: DragEvent, index: number) => {
  event.dataTransfer?.setData('statusIndex', index.toString())
}

const dropStatus = (event: DragEvent, dropIndex: number) => {
  const draggedIndex = event.dataTransfer?.getData('statusIndex')
  if (draggedIndex !== null) {
    const draggedItem = statuses.value[parseInt(draggedIndex ?? '0')]
    statuses.value.splice(parseInt(draggedIndex ?? '0'), 1)
    statuses.value.splice(dropIndex, 0, draggedItem as { name: string, color: string })
  }
}

const captureTreeMap = () => {
  const projectMapElement = document.querySelector('.tree-map') as HTMLElement | null
  if (projectMapElement) {
    window.scrollTo(0, 0)
    setTimeout(() => {
      domtoimage.toPng(projectMapElement, { quality: 1, bgcolor: 'white' })
        .then((dataUrl: string) => {
          const link = document.createElement('a')
          link.href = dataUrl
          link.download = 'treeMap.png'
          link.click()
        })
        .catch((error: Error) => {
          console.error('Error: ', error)
        })
    }, 300)
  }
  else {
    console.error('TreeMap section is not found')
  }
}

const checkPositionBounds = () => {
  const maxX = window.innerWidth - size.width
  const maxY = window.innerHeight - (dialogMinimized.value ? 32 : 450)
  if (position.x > maxX) position.x = maxX
  if (position.x < 0) position.x = 0
  if (position.y > maxY) position.y = maxY
  if (position.y < 0) position.y = 0
}

const handleResize = () => {
  checkPositionBounds()
}

const loadSectionsFromFile = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]

  if (file) {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const sections = JSON.parse(e.target?.result as string) as Section[]
        if (!Array.isArray(sections)) {
          throw new Error('Invalid sections format, expected an array')
        }
        store.setSections(sections)
      }
      catch (error) {
        console.error('Error parsing JSON:', error)
      }
    }

    reader.readAsText(file)
    router.push('/panel')
  }
}

const saveSectionsToFile = () => {
  const sections = JSON.stringify(store.sections, null, 2)
  const blob = new Blob([sections], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `trackerMap-${new Date().toISOString()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const resetConfiguration = () => {
  store.clear()
  router.push('/')
}

onMounted(() => {
  if (position.x === 0 && position.y === 0) {
    position.x = window.innerWidth - 450
    position.y = 32
  }
  isPositioned.value = true
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <transition name="dialog-fade">
    <div
      v-if="isPositioned"
      class="fixed bg-opacity-80 bg-neutral-800 text-white rounded-md shadow-lg space-y-4 text-sm border-white border-opacity-20 border-2 z-50"
      :style="{ width: `${size.width}px`, top: `${position.y}px`, left: `${position.x}px` }"
    >
      <div
        class="header flex justify-between items-center rounded-md cursor-move bg-neutral-800 px-4 py-1"
        @mousedown="startDialogDrag"
        @touchstart="startDialogDrag"
      >
        <h2 class="text-base font-bold">
          Config
        </h2>
        <button
          class="text-white rounded-full text-lg font-bold h-8 w-8"
          @click="toggleMinimize"
        >
          {{ dialogMinimized ? '+' : '-' }}
        </button>
      </div>

      <div
        v-show="!dialogMinimized"
        class="px-4 max-h-[500px] overflow-y-auto"
      >
        <h2 class="text-md font-bold mb-3">
          Progress
        </h2>

        <ProgressBar class="mb-4" />

        <div class="config-section">
          <h2 class="text-md font-bold mb-3">
            Viewport
          </h2>

          <div class="flex items-center justify-between space-x-2 mb-4">
            <button
              class="flex-1 flex font-semibold items-center justify-center disabled:cursor-not-allowed border-2 border-neutral-600 text-white px-2 py-1 rounded-md transition duration-300 bg-neutral-900 hover:bg-neutral-600"
              :disabled="!store.configLoaded"
              @click="captureTreeMap"
            >
              <svg
                class="w-5 h-5 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
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
              <span class="ml-2 text-sm">capture</span>
            </button>
          </div>
        </div>

        <div class="config-section flex items-center cursor-default space-x-2 mb-3">
          <h2 class="text-md font-bold mb-0 w-60">
            Section Width
          </h2>
          <input
            v-model="minWidth"
            type="range"
            min="0"
            max="500"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          >
          <span class="w-20">{{ minWidth }}px</span>
        </div>

        <div class="config-section flex items-center cursor-default space-x-2 mb-3">
          <h2 class="text-md font-bold mb-0 w-60">
            Section Height
          </h2>
          <input
            v-model="minHeight"
            type="range"
            min="0"
            max="500"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          >
          <span class="w-20">{{ minHeight }}px</span>
        </div>

        <div class="config-section">
          <h2 class="text-md font-bold mb-3">
            Display
          </h2>
          <div class="flex items-center justify-between space-x-2 mb-3">
            <button
              :class="{ 'bg-neutral-600': store.display === 'section', 'bg-neutral-900': store.display !== 'section' }"
              class="flex-1 font-semibold border-2 border-neutral-600 text-white px-2 py-1 rounded-md transition duration-300 hover:bg-neutral-600"
              @click="setDisplay('section')"
            >
              section
            </button>

            <button
              :class="{ 'bg-neutral-600': store.display === 'path', 'bg-neutral-900': store.display !== 'path' }"
              class="flex-1 font-semibold border-2 border-neutral-600 text-white px-2 py-1 rounded-md transition duration-300 hover:bg-neutral-600"
              @click="setDisplay('path')"
            >
              path
            </button>
          </div>
        </div>

        <h2 class="text-md font-bold mb-3">
          Flow
        </h2>
        <div class="config-section">
          <div
            v-for="(status, index) in statuses"
            :key="index"
            class="flex items-center space-x-2 space-y-2 align-middle status-item text-neutral-600"
            :draggable="!inputFocused"
            @dragstart="startStatusDrag($event, index)"
            @dragover.prevent
            @drop="dropStatus($event, index)"
          >
            <div class="text-white w-10 text-sm">
              {{ index + 1 }}.
            </div>
            <input
              v-model="status.name"
              class="p-1 rounded-sm w-full placeholder:text-neutral-400"
              placeholder="status"
              @focus="disableStatusDrag"
              @blur="enableStatusDrag"
            >
            <input
              v-model="status.color"
              :style="{ backgroundColor: status.color }"
              class="p-1 text-white font-semibold rounded-sm w-full placeholder:text-neutral-400"
              placeholder="color"
              @focus="disableStatusDrag"
              @blur="enableStatusDrag"
            >
            <button
              :disabled="statuses.length <= 1"
              class="text-neutral-200 font-semibold w-[200px] disabled:text-neutral-500"
              @click="removeStatus(index)"
            >
              remove
            </button>
          </div>

          <div class="flex items-center space-x-2 space-y-2 align-middle status-item text-neutral-600 mb-6">
            <div class="text-white w-10 text-sm">
              {{ statuses.length + 1 }}.
            </div>
            <input
              v-model="newStatus.name"
              class="p-1 rounded-sm w-full placeholder:text-neutral-400"
              placeholder="status"
              @focus="disableStatusDrag"
              @blur="enableStatusDrag"
            >
            <input
              v-model="newStatus.color"
              :style="{ backgroundColor: newStatus.color }"
              class="p-1 rounded-sm w-full placeholder:text-neutral-400"
              placeholder="color"
              @focus="disableStatusDrag"
              @blur="enableStatusDrag"
            >
            <button
              :disabled="!newStatus.name || !newStatus.color"
              class="text-neutral-200 font-semibold w-[200px] disabled:text-neutral-500"
              @click="addNewStatus"
            >
              add
            </button>
          </div>
        </div>

        <div class="config-section">
          <h2 class="text-md font-bold mb-3">
            Import/Export JSON
          </h2>

          <div class="flex items-center justify-between space-x-2 mb-3">
            <input
              ref="fileInput"
              type="file"
              class="hidden"
              @change="loadSectionsFromFile"
            >
            <button
              class="flex-1 font-semibold border-2 border-neutral-600 text-white px-2 py-1 rounded-md transition duration-300 bg-neutral-900 hover:bg-neutral-600"
              @click="($refs.fileInput as HTMLInputElement).click()"
            >
              upload
            </button>
            <button
              class="flex-1 font-semibold border-2 border-neutral-600 text-white px-2 py-1 disabled:cursor-not-allowed rounded-md transition duration-300 bg-neutral-900 hover:bg-neutral-600"
              :disabled="!store.configLoaded"
              @click="saveSectionsToFile"
            >
              save
            </button>
          </div>
        </div>

        <div class="config-section">
          <h2 class="text-md font-bold mb-3">
            Reset Configuration
          </h2>

          <div class="flex items-center justify-between space-x-2 mb-3">
            <button
              class="flex-1 font-semibold border-2 border-red-600 text-white px-2 py-1 rounded-md transition duration-300 bg-red-700 hover:bg-red-600"
              @click="resetConfiguration"
            >
              reset
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.dialog-fade-enter-active, .dialog-fade-leave-active {
  transition: opacity 0.5s;
}
.dialog-fade-enter-from, .dialog-fade-leave-to {
  opacity: 0;
}

.status-item {
  cursor: grab;
}
.status-item:active {
  cursor: grabbing;
}
</style>
