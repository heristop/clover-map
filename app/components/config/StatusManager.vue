<script setup lang="ts">
import { ref, computed, reactive, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore, pastelColors } from '~/composables/store'
import { useStatusManagement } from '~/composables/status'

interface Status {
  name: string
  color: string
}

interface EditingStatus {
  index: number
  name: string
}

const { removeStatus } = useStatusManagement()
const store = useStore()
const { statuses } = storeToRefs(store)
const isDragging = ref(false)
const editingStatus = ref<EditingStatus | null>(null)
const showColorPicker = ref(false)
const editingColorIndex = ref<number | null>(null)
const newStatusInput = ref<HTMLInputElement | null>(null)

withDefaults(defineProps<{
  draggable?: boolean
}>(), {
  draggable: false,
})

const safeStatuses = computed<Status[]>(() => {
  return Array.isArray(statuses.value) ? statuses.value : []
})

function getNextColor(): string {
  const currentColors = safeStatuses.value.map((status: Status) => status.color)
  const availableColors = pastelColors.filter(color => !currentColors.includes(color))

  return availableColors.length > 0 ? availableColors[0] : pastelColors[0]
}

const newStatus = reactive<Status>({
  name: '',
  color: getNextColor(),
})

const currentEditingColor = computed({
  get: () => {
    if (editingColorIndex.value !== null) {
      return safeStatuses.value[editingColorIndex.value].color
    }
    return newStatus.color
  },
  set: (newColor: string) => {
    if (editingColorIndex.value !== null) {
      store.setStatuses(
        safeStatuses.value.map((status, i) =>
          i === editingColorIndex.value ? { ...status, color: newColor } : status,
        ),
      )
    }
    else {
      newStatus.color = newColor
    }
  },
})

const addNewStatus = () => {
  if (newStatus.name && newStatus.color) {
    const updatedStatuses = [...safeStatuses.value, { name: newStatus.name, color: newStatus.color }]
    store.setStatuses(updatedStatuses)
    newStatus.name = ''
    newStatus.color = getNextColor()
    nextTick(() => {
      newStatusInput.value?.focus()
    })
  }
}

const startEditing = (index: number, name: string) => {
  editingStatus.value = { index, name }
}

const stopEditing = () => {
  if (editingStatus.value) {
    const { index, name } = editingStatus.value
    store.setStatuses(
      safeStatuses.value.map((status, i) =>
        i === index ? { ...status, name } : status,
      ),
    )
    editingStatus.value = null
  }
}

const updateStatusName = (index: number, name: string) => {
  if (editingStatus.value && editingStatus.value.index === index) {
    editingStatus.value.name = name
  }
}

const startStatusDrag = (event: DragEvent, index: number) => {
  if (!editingStatus.value && event.dataTransfer) {
    event.dataTransfer.setData('statusIndex', index.toString())
    isDragging.value = true
  }
}

const dropStatus = (event: DragEvent, dropIndex: number) => {
  const draggedIndex = event.dataTransfer?.getData('statusIndex')
  if (draggedIndex !== null && draggedIndex !== undefined) {
    const draggedIndexNum = parseInt(draggedIndex)
    const draggedItem = safeStatuses.value[draggedIndexNum]
    if (draggedItem) {
      const newStatuses = [...safeStatuses.value]
      newStatuses.splice(draggedIndexNum, 1)
      newStatuses.splice(dropIndex, 0, draggedItem)
      store.setStatuses(newStatuses)
    }
  }
  isDragging.value = false
}

const getTextColor = (backgroundColor: string): string => {
  const color = backgroundColor.substring(1)
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance < 186 ? '#FFFFFF' : '#000000'
}

const isValidColor = (color: string): boolean => /^#[0-9A-F]{6}$/i.test(color)

const startColorEditing = (index: number | null) => {
  editingColorIndex.value = index
  showColorPicker.value = true
}

const updateStatusColor = (color: string) => {
  currentEditingColor.value = color
}

const closeColorPicker = () => {
  showColorPicker.value = false
  editingColorIndex.value = null
}
</script>

<template>
  <div class="space-y-2">
    <TransitionGroup
      name="list"
      tag="div"
    >
      <div
        v-for="(status, index) in safeStatuses"
        :key="status.name"
        class="flex items-center space-x-2 p-2 bg-stone-200/50 dark:bg-stone-800 rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:shadow-md"
        :class="{ 'cursor-grab active:cursor-grabbing': draggable && !editingStatus }"
        :draggable="draggable && !editingStatus"
        @dragstart="startStatusDrag($event, index)"
        @dragend="isDragging = false"
        @dragover.prevent
        @drop="dropStatus($event, index)"
      >
        <div class="text-stone-600 dark:text-stone-300 w-20 text-xs flex items-center">
          <svg
            v-if="draggable && !editingStatus"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-1 cursor-grab"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          {{ index + 1 }}.
        </div>

        <input
          :value="editingStatus?.index === index ? editingStatus.name : status.name"
          class="p-1 font-semibold rounded w-full placeholder:text-stone-300 text-xs transition-all duration-300 focus:ring-2 focus:ring-stone-300 bg-white dark:bg-stone-700 text-stone-800 dark:text-white"
          placeholder="status"
          @input="updateStatusName(index, ($event.target as HTMLInputElement).value)"
          @focus="startEditing(index, status.name)"
          @blur="stopEditing"
        >
        <div
          :style="{ backgroundColor: isValidColor(status.color) ? status.color : '#FFFFFF', color: isValidColor(status.color) ? getTextColor(status.color) : '#000000' }"
          class="p-1 font-semibold rounded w-12 h-8 cursor-pointer transition-all duration-300 hover:opacity-80 focus:ring-2 focus:ring-stone-300"
          tabindex="0"
          role="button"
          aria-label="Change color"
          @click="startColorEditing(index)"
          @keydown.enter="startColorEditing(index)"
        />
        <button
          :disabled="safeStatuses.length <= 1"
          class="p-1 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-stone-300"
          aria-label="Remove status"
          @click="removeStatus(index)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>

  <div class="flex items-center space-x-2 p-2 bg-stone-200/50 dark:bg-stone-800 rounded-lg shadow-sm mt-2 hover:shadow-md transition-all duration-300">
    <div class="text-stone-600 dark:text-stone-300 w-20 text-xs">
      {{ safeStatuses.length + 1 }}.
    </div>
    <input
      ref="newStatusInput"
      v-model="newStatus.name"
      class="p-1 font-semibold rounded w-full placeholder:text-stone-400 text-xs transition-all duration-300 focus:ring-2 focus:ring-stone-500 bg-white dark:bg-stone-700 text-stone-800 dark:text-white"
      placeholder="New Status"
      @keyup.enter="addNewStatus"
    >
    <div
      :style="{ backgroundColor: isValidColor(newStatus.color) ? newStatus.color : '#FFFFFF', color: isValidColor(newStatus.color) ? getTextColor(newStatus.color) : '#000000' }"
      class="p-1 font-semibold rounded w-12 h-8 cursor-pointer transition-all duration-300 hover:opacity-80 focus:ring-2 focus:ring-stone-300"
      tabindex="0"
      role="button"
      aria-label="Choose color for new status"
      @click="startColorEditing(null)"
      @keydown.enter="startColorEditing(null)"
    />
    <button
      :disabled="!newStatus.name || !newStatus.color"
      class="p-1 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-stone-300"
      aria-label="Add new status"
      @click="addNewStatus"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
    </button>
  </div>

  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showColorPicker"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-stone-50 dark:bg-stone-800 p-4 rounded-lg shadow-lg m-4 max-w-sm w-full">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-stone-800 dark:text-stone-200">
              Choose a Color
            </h3>
            <button
              class="text-stone-400 hover:text-stone-600 dark:text-stone-300 dark:hover:text-white transition-colors duration-300"
              aria-label="Close Color Picker"
              @click="closeColorPicker"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="grid grid-cols-5 gap-2 mb-4">
            <button
              v-for="color in pastelColors"
              :key="color"
              class="w-full pt-full rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-400 transition-transform duration-200 hover:scale-110"
              :style="{ backgroundColor: color }"
              :aria-label="`Select color ${color}`"
              @click="updateStatusColor(color)"
            />
          </div>

          <div class="flex items-center space-x-2">
            <input
              type="color"
              :value="currentEditingColor"
              class="w-10 h-10 rounded cursor-pointer"
              @input="updateStatusColor(($event.target as HTMLInputElement).value)"
            >
            <input
              v-model="currentEditingColor"
              type="text"
              class="flex-grow p-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white dark:bg-stone-700 text-stone-800 dark:text-white"
              placeholder="#FFFFFF"
            >
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pt-full {
  padding-top: 100%;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
