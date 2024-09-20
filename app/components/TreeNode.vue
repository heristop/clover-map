<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from '~/composables/store'
import type { Section } from '~~/types'
import { useSectionManagement } from '~/composables/section'
import { useNodeOperations } from '~/composables/node'
import { useNodeStyles } from '~/composables/style'
import { useStatusManagement } from '~/composables/status'

const props = defineProps<{ node: Section, depth: number }>()
const emit = defineEmits(['status-updated'])
const store = useStore()
const isSuccessNode = ref(false)
const nodeStatus = ref(props.node.status || store.statuses[0]?.name)
const isDragging = ref(false)
const isEditing = ref(false)

const { updateSectionKey, updateSectionName, deleteSection } = useSectionManagement()
const { addSection, addSiblingSection, addRootSection } = useNodeOperations()
const { getNodeStyles } = useNodeStyles()
const { updateSectionStatus } = useStatusManagement()

const localKey = ref(props.node.key)
const localName = ref(props.node.name)

watch(() => props.node, (newNode) => {
  localKey.value = newNode.key
  localName.value = newNode.name
  nodeStatus.value = newNode.status || store.statuses[0]?.name || ''
  checkIfSuccessNode(newNode)
}, { deep: true })

const displayContent = computed({
  get: () => store.displayLabel === 'key' ? localKey.value : localName.value,
  set: (value) => {
    if (store.displayLabel === 'key') {
      localKey.value = value
      updateSectionKey(props.node.key, value)
    }
    else {
      localName.value = value
      updateSectionName(props.node.key, value)
    }
  },
})

const checkIfSuccessNode = (node: Section) => {
  if (store.statuses?.length > 0 && node.status === store.statuses[store.statuses.length - 1]?.name) {
    isSuccessNode.value = true
    return
  }
  isSuccessNode.value = false
}

const updateParentStatus = () => {
  emit('status-updated')
}

const toggleCollapse = (event: MouseEvent) => {
  event.stopPropagation()
  store.updateSectionCollapse(props.node.key)
}

const getUniqueKeyName = (base: string, type: 'key' | 'name') => {
  let index = 1
  let newName = `${base}${index}`
  const allSections: Section[] = []

  const gatherSections = (sections: Section[]) => {
    sections.forEach((section) => {
      allSections.push(section)
      if (section.children) {
        gatherSections(section.children)
      }
    })
  }
  gatherSections(store.sections)

  while (allSections.some((section: Section) => section[type] === newName)) {
    index++
    newName = `${base}${index}`
  }
  return newName
}

const addNode = (event: MouseEvent) => {
  event.stopPropagation()

  const newNodeKey = getUniqueKeyName(`${props.node.key}-child-`, 'key')
  const newNodeName = getUniqueKeyName(`${props.node.name} Child `, 'name')
  const newNode: Section = {
    key: newNodeKey,
    name: newNodeName,
    status: store.statuses[0]?.name || '',
    children: [],
    isCollapsed: false,
  }

  addSection(props.node.key, newNode)
}

const addSiblingNode = (event: MouseEvent) => {
  event.stopPropagation()

  const newNodeKey = getUniqueKeyName(`${props.node.key}-sibling-`, 'key')
  const newNodeName = getUniqueKeyName(`${props.node.name} Sibling `, 'name')
  const newNode: Section = {
    key: newNodeKey,
    name: newNodeName,
    status: store.statuses[0]?.name || '',
    children: [],
    isCollapsed: false,
  }

  const parentKey = store.parentMap[props.node.key]

  if (parentKey) {
    addSiblingSection(parentKey, props.node.key, newNode)
  }
  else {
    addRootSection(newNode)
  }
}

const startEditing = (event: MouseEvent) => {
  event.stopPropagation()
  isEditing.value = true

  nextTick(() => {
    const input = event.target as HTMLInputElement
    input.focus()
    input.select()
  })
}

const finishEditing = () => {
  isEditing.value = false
}

const deleteNode = (event: MouseEvent) => {
  event.stopPropagation()
  deleteSection(props.node.key)
}

const handleDragStart = (event: DragEvent) => {
  if (isDragging.value) {
    return
  }

  event.stopPropagation()
  event.dataTransfer?.setData('text/plain', props.node.key)
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  const draggedKey = event.dataTransfer?.getData('text/plain')

  if (draggedKey && draggedKey !== props.node.key) {
    store.swapSections(props.node.key, draggedKey)
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

watch(() => [props.node.status, store.statuses], () => {
  nodeStatus.value = props.node.status || store.statuses[0]?.name || ''
  checkIfSuccessNode(props.node)
}, { immediate: true })

onMounted(() => {
  updateParentStatus()
})

const nodeStyle = computed(() => {
  const baseFlex = 1
  const childCount = props.node.children ? props.node.children.length : 0

  return {
    flex: `${baseFlex + childCount} 1 auto`,
    cursor: !props.node.children || !props.node.children.length ? 'pointer' : 'default',
    ...(getNodeStyles(props.node, props.depth) as object),
  }
})

const handleClick = (event: MouseEvent) => {
  event.stopPropagation()

  if (!props.node.children || !props.node.children.length) {
    updateStatus()

    return
  }
}

const updateStatus = () => {
  if (!store.isEditingMode) {
    const newStatus = store.statuses.find((s: { name: string }) => s.name === nodeStatus.value)
    const nextStatusIndex = (store.statuses.indexOf(newStatus!) + 1) % store.statuses.length
    const nextStatus = store.statuses[nextStatusIndex]?.name
    nodeStatus.value = nextStatus
    updateSectionStatus(props.node.key || '', nextStatus || '')

    if (store.statuses.length > 0 && nextStatus === store.statuses[store.statuses.length - 1]?.name) {
      applySuccessAnimation(props.node)
    }

    updateParentStatus()
  }
}

const applySuccessAnimation = (node: Section) => {
  const applyToParents = (currentNode: Section) => {
    if (currentNode.status === nodeStatus.value) {
      const nodeElement = document.querySelector(`[data-node-key="${currentNode.key}"]`)

      if (nodeElement) {
        nodeElement.classList.add('success-animation')
      }
    }

    if (currentNode.children) {
      currentNode.children.forEach(child => applyToParents(child))
    }
  }

  applyToParents(node)
  isSuccessNode.value = true
}
</script>

<template>
  <div
    class="node-container relative"
    :class="{ 'success-animation': isSuccessNode }"
    :style="nodeStyle"
    :data-node-key="node.key"
    :draggable="!store.isEditingMode && !isEditing"
    @dragstart="handleDragStart"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @click="handleClick"
  >
    <div :class="['node-title', { 'center-title': !node.children || !node.children.length }]">
      <span
        v-if="node.children && node.children.length"
        class="collapse-icon"
        @click.stop="toggleCollapse"
      >
        <svg
          v-if="node.isCollapsed"
          class="w-5 h-5 text-stone-100"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M10.271 5.575C8.967 4.501 7 5.43 7 7.12v9.762c0 1.69 1.967 2.618 3.271 1.544l5.927-4.881a2 2 0 0 0 0-3.088l-5.927-4.88Z"
            clip-rule="evenodd"
          />
        </svg>

        <svg
          v-else
          class="w-5 h-5 text-stone-100"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z"
            clip-rule="evenodd"
          />
        </svg>
      </span>

      <input
        v-if="isEditing"
        v-model="displayContent"
        class="edit-input"
        @click.stop
        @blur="finishEditing"
        @keyup.enter="finishEditing"
      >

      <span
        v-else
        class="node-text"
        @click="startEditing"
      >
        {{ displayContent }}
      </span>

      <div
        v-if="store.isEditingMode && !isEditing"
        class="flex ml-4 space-x-2"
      >
        <button
          class="p-1 rounded-full bg-black/10"
          @click.stop="addSiblingNode"
        >
          <svg
            class="w-4 h-4 text-stone-200 hover:text-stone-100 transition-colors duration-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857ZM18 14a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2v-2Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <button
          class="p-1 rounded-full bg-black/10"
          @click.stop="addNode"
        >
          <svg
            class="w-4 h-4 text-stone-200 hover:text-stone-100 transition-colors duration-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <button
          :disabled="store.sections.length === 1 && !store.hasParent(props.node.key)"
          class="p-1 rounded-full bg-black/10 disabled:opacity-40"
          @click.stop="deleteNode"
        >
          <svg
            class="w-4 h-4 text-stone-200 hover:text-stone-100 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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
    </div>

    <div
      v-if="node.children && node.children.length && !node.isCollapsed"
      :class="store.viewMode === 'flex' ? 'node-children-flex' : 'node-children-grid'"
      class="node-children view-transition"
    >
      <TreeNode
        v-for="child in node.children"
        :key="child.key || child.name"
        :node="child"
        :depth="depth + 1"
        @status-updated="updateParentStatus"
      />
    </div>
  </div>
</template>

<style scoped>
@keyframes stackIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes successAnimation {
  0% {
    transform: translate(-100%, -100%) rotate(45deg);
    opacity: 1;
  }
  100% {
    transform: translate(200%, 200%) rotate(45deg);
    opacity: 0;
  }
}

.node-container {
  display: flex;
  flex-direction: column;
  border-width: 2px;
  border-radius: 8px;
  overflow: visible;
  position: relative;
  animation: stackIn 0.3s ease-in-out;
  transition: opacity 0.3s ease-in-out, background-color 0.3s ease-in-out;
  z-index: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.node-children-flex {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  overflow: visible;
  height: 100%;
}

.node-children-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
  justify-content: start !important;
}

.view-transition {
  transition: all 0.3s ease-in-out;
}

.node-children .node-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.node-title {
  text-align: center;
  font-size: 0.875rem;
  font-weight: bold;
  color: white;
  background-color: rgba(0, 0, 0, 0.25);
  pointer-events: auto;
  padding: 8px;
  margin: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  backdrop-filter: blur(4px);
}

.node-text {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.edit-input {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-bottom: 1px solid white;
  color: white;
  outline: none;
  transition: all 0.3s;
  padding: 2px 4px;
  border-radius: 2px;
}

.edit-input:focus {
  background: rgba(255, 255, 255, 0.2);
  border-bottom: 2px solid white;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.collapse-icon {
  cursor: pointer;
  font-weight: bold;
}

.center-title {
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-animation {
  position: relative;
  overflow: hidden;
}

.success-animation::before {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 200%;
  height: 200%;
  background: rgba(255, 255, 255, 0.3);
  opacity: 0;
  transform: rotate(45deg);
  animation: successAnimation 1s ease-in-out;
  pointer-events: none;
}
</style>
