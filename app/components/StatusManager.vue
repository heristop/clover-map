<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useStore, pastelColors } from '~/composables/store'

const store = useStore()
const statuses = computed(() => store.statuses)
const inputFocused = ref(false)

const newStatus = reactive({
  name: '',
  color: getNextColor() || '#FFFFFF', // Ensure it's always a string
})

const addNewStatus = () => {
  if (newStatus.name && newStatus.color) {
    store.addStatus({ name: newStatus.name, color: newStatus.color })
    newStatus.name = ''
    newStatus.color = getNextColor() || '#FFFFFF' // Ensure it's always a string
  }
}

const removeStatus = (index: number) => {
  store.removeStatus(index)
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

const getTextColor = (backgroundColor: string) => {
  const color = backgroundColor.substring(1)
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance < 186 ? '#FFFFFF' : '#000000'
}

const isValidColor = (color: string) => /^#[0-9A-F]{6}$/i.test(color)

function getNextColor() {
  const currentColors = statuses.value.map((status: { color: string }) => status.color)
  const availableColors = pastelColors.filter(color => !currentColors.includes(color))

  return availableColors.length > 0 ? availableColors[0] : pastelColors[0]
}
</script>

<template>
  <div
    v-for="(status, index) in statuses"
    :key="index"
    class="flex items-center space-x-2 space-y-2 align-middle status-item text-stone-800"
    :draggable="!inputFocused"
    @dragstart="startStatusDrag($event, index)"
    @dragover.prevent
    @drop="dropStatus($event, index)"
  >
    <div class="text-stone-300 w-20 text-xs mt-2">
      {{ index + 1 }}.
    </div>

    <input
      v-model="status.name"
      class="p-1 font-semibold rounded-sm w-full placeholder:text-stone-300 text-xs"
      placeholder="status"
      @focus="disableStatusDrag"
      @blur="enableStatusDrag"
    >
    <input
      v-model="status.color"
      :style="{ backgroundColor: isValidColor(status.color) ? status.color : '#FFFFFF', color: isValidColor(status.color) ? getTextColor(status.color) : '#000000' }"
      class="p-1 font-semibold rounded-sm w-full placeholder:text-stone-300 text-xs"
      placeholder="color"
      @focus="disableStatusDrag"
      @blur="enableStatusDrag"
    >
    <button
      :disabled="statuses.length <= 1"
      class="text-stone-200 hover:text-stone-100 font-semibold w-[200px] disabled:text-stone-500 text-xs"
      @click="removeStatus(index)"
    >
      remove
    </button>
  </div>

  <div class="flex items-center space-x-2 space-y-2 align-middle status-item text-stone-600 mb-6">
    <div class="text-stone-300 w-20 text-xs mt-2">
      {{ statuses.length + 1 }}.
    </div>
    <input
      v-model="newStatus.name"
      class="p-1 font-semibold rounded-sm w-full placeholder:text-stone-400 text-xs"
      placeholder="status"
      @focus="disableStatusDrag"
      @blur="enableStatusDrag"
    >
    <input
      v-model="newStatus.color"
      :style="{ backgroundColor: isValidColor(newStatus.color) ? newStatus.color : '#FFFFFF', color: isValidColor(newStatus.color) ? getTextColor(newStatus.color) : '#000000' }"
      class="p-1 font-semibold rounded-sm w-full placeholder:text-stone-400 text-xs"
      :placeholder="getNextColor()"
      @focus="disableStatusDrag"
      @blur="enableStatusDrag"
    >
    <button
      :disabled="!newStatus.name || !newStatus.color"
      class="text-stone-100 font-semibold w-[200px] text-xs disabled:cursor-not-allowed disabled:opacity-50"
      @click="addNewStatus"
    >
      add
    </button>
  </div>
</template>

<style scoped>
.status-item {
  cursor: grab;
}
.status-item:active {
  cursor: grabbing;
}
</style>
