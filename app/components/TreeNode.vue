<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, type StyleValue } from 'vue'
import { useStore } from '~/composables/store'
import type { Section } from '~~/types'

const props = defineProps<{ node: Section, depth: number }>()
const emit = defineEmits(['status-updated'])
const store = useStore()
const isSuccessNode = ref(false)
const nodeStatus = ref(props.node.status || store.statuses[0]?.name)

const displayContent = computed({
  get: () => store.displayLabel === 'key' ? props.node.key : props.node.name,
  set: (value) => {
    if (store.displayLabel === 'key') {
      updateNodeKey(value)
    }
    else {
      updateNodeName(value)
    }
  },
})

const updateNodeKey = (newKey: string) => {
  store.updateSectionKey(props.node.key, newKey)
}

const updateNodeName = (newName: string) => {
  store.updateSectionName(props.node.key, newName)
}

const minWidth = computed(() => store.minWidth)
const minHeight = computed(() => store.minHeight)

const getNodeStyles = (node: Section, depth: number) => {
  const statusObj = store.statuses.find((s: { name: string | undefined }) => s.name === node.status)
  let backgroundColor = statusObj ? statusObj.color : '#D44D8'
  backgroundColor = darkenColor(backgroundColor, depth * 6)

  return {
    backgroundColor: backgroundColor,
    borderColor: backgroundColor,
    minWidth: `${minWidth.value}px`,
    minHeight: `${minHeight.value}px`,
    margin: '4px',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    boxSizing: 'border-box',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.3s',
  } as StyleValue
}

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

const darkenColor = (color: string, percent: number) => {
  if (!/^#[0-9A-F]{6}$/i.test(color)) {
    return color
  }

  const num = parseInt(color.replace('#', ''), 16),
    amt = Math.round(2.55 * percent),
    R = Math.max((num >> 16) - amt, 0),
    G = Math.max((num >> 8 & 0x00FF) - amt, 0),
    B = Math.max((num & 0x0000FF) - amt, 0)

  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1).toUpperCase()
}

const toggleCollapse = (event: MouseEvent) => {
  event.stopPropagation()

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      store.updateSectionCollapse(props.node.key)
    })
  }
  else {
    store.updateSectionCollapse(props.node.key)
  }
}

const addNode = (event: MouseEvent) => {
  event.stopPropagation()

  const newNode: Section = {
    key: `${props.node.key}-${Date.now()}`,
    name: 'New Section',
    status: store.statuses[0]?.name || '',
    children: [],
    isCollapsed: false,
  }

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      store.addSection(props.node.key, newNode)
    })

    return
  }

  store.addSection(props.node.key, newNode)
}

const addSiblingNode = (event: MouseEvent) => {
  event.stopPropagation()

  const newNode: Section = {
    key: `${Date.now()}`,
    name: 'New Sibling Section',
    status: store.statuses[0]?.name || '',
    children: [],
    isCollapsed: false,
  }

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      store.addSiblingSection(props.node.key, newNode)
    })

    return
  }

  store.addSiblingSection(props.node.key, newNode)
}

const deleteNode = (event: MouseEvent) => {
  event.stopPropagation()

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      store.deleteSection(props.node.key)
    })

    return
  }

  store.deleteSection(props.node.key)
}

watchEffect(() => {
  nodeStatus.value = props.node.status || store.statuses[0]?.name || ''
  checkIfSuccessNode(props.node)
})

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

  toggleCollapse(event)
}

const updateStatus = () => {
  if (!store.isEditingMode) {
    const newStatus = store.statuses.find((s: { name: string }) => s.name === nodeStatus.value)
    const nextStatusIndex = (store.statuses.indexOf(newStatus!) + 1) % store.statuses.length
    const nextStatus = store.statuses[nextStatusIndex]?.name
    nodeStatus.value = nextStatus
    store.updateSectionStatus(props.node.key || '', nextStatus || '')

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
        v-if="store.isEditingMode"
        v-model="displayContent"
        class="edit-input"
        @click.stop
        @blur="store.updateSectionLabel(props.node.key, displayContent)"
      >
      <span v-else>{{ displayContent }}</span>
      <div
        v-if="store.isEditingMode"
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
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 12h14m-7 7V5"
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
          class="p-1 rounded-full bg-black/10"
          @click.stop="deleteNode"
        >
          <svg
            class="w-4 h-4 text-stone-200 hover:text-stone-100 transition-colors duration-200"
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
              d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.edit-input {
  text-align: center;
  background: none;
  border: none;
  border-bottom: 1px solid white;
  color: white;
  outline: none;
  transition: border-bottom 0.3s;
}

.edit-input:focus {
  border-bottom: 2px solid white;
  outline: none;
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
