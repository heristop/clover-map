<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, type StyleValue } from 'vue'
import { useStore } from '~/composables/store'
import type { Section } from '~~/types'

const props = defineProps<{ node: Section, depth: number }>()
const emit = defineEmits(['status-updated'])
const store = useStore()
const isSuccessNode = ref(false)
const nodeStatus = ref(props.node.status || store.statuses[0]?.name)
const isCollapsed = ref(false)

const displayContent = computed(() => {
  return store.display === 'key' ? props.node.key : props.node.name
})

const minWidth = computed(() => store.minWidth)
const minHeight = computed(() => store.minHeight)

const getNodeStyles = (node: Section, depth: number) => {
  const statusObj = store.statuses.find(s => s.name === node.status)
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
  isCollapsed.value = !isCollapsed.value
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
  }
  else {
    toggleCollapse(event)
  }
}

const updateStatus = () => {
  const newStatus = store.statuses.find(s => s.name === nodeStatus.value)
  const nextStatusIndex = (store.statuses.indexOf(newStatus!) + 1) % store.statuses.length
  const nextStatus = store.statuses[nextStatusIndex]?.name
  nodeStatus.value = nextStatus
  store.updateSectionStatus(props.node.key || '', nextStatus || '')

  if (store.statuses.length > 0 && nextStatus === store.statuses[store.statuses.length - 1]?.name) {
    applySuccessAnimation(props.node)
  }
  updateParentStatus()
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
        {{ isCollapsed ? '▶' : '▼' }}
      </span>
      {{ displayContent }}
    </div>

    <div
      v-if="node.children && node.children.length && !isCollapsed"
      class="node-children"
      style="display: flex; flex-wrap: wrap; justify-content: center;"
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

.collapse-icon {
  cursor: pointer;
  font-weight: bold;
}

.center-title {
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-children {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  overflow: visible;
  height: 100%;
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
