<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import { useStore } from '~/composables/store'
import type { Section } from '~~/types'

const props = defineProps<{ node: Section, depth: number }>()
const emit = defineEmits(['status-updated'])
const componentStore = useStore()
const isSuccessNode = ref(false)
const nodeStatus = ref(props.node.status || componentStore.statuses[0]?.name)

const displayContent = computed(() => {
  return componentStore.display === 'path' ? props.node.path : props.node.name
})

const getNodeStyles = (node: Section, depth: number) => {
  const statusObj = componentStore.statuses.find(s => s.name === node.status)
  let backgroundColor = statusObj ? statusObj.color : '#D44D8'
  backgroundColor = darkenColor(backgroundColor, depth * 6)

  return {
    backgroundColor: backgroundColor,
    borderColor: backgroundColor,
  }
}

const checkIfSuccessNode = (node: Section) => {
  if (componentStore.statuses?.length > 0 && node.status === componentStore.statuses[componentStore.statuses.length - 1]?.name) {
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

watchEffect(() => {
  nodeStatus.value = props.node.status || componentStore.statuses[0]?.name || ''
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
    margin: '4px',
    ...getNodeStyles(props.node, props.depth),
  }
})

const handleClick = (event: MouseEvent) => {
  if (!props.node.children || !props.node.children.length) {
    event.stopPropagation()
    updateStatus()
  }
}

const updateStatus = () => {
  const newStatus = componentStore.statuses.find(s => s.name === nodeStatus.value)
  const nextStatusIndex = (componentStore.statuses.indexOf(newStatus!) + 1) % componentStore.statuses.length
  const nextStatus = componentStore.statuses[nextStatusIndex]?.name
  nodeStatus.value = nextStatus
  componentStore.updateSectionStatus(props.node.path || '', nextStatus || '')

  if (componentStore.statuses.length > 0 && nextStatus === componentStore.statuses[componentStore.statuses.length - 1]?.name) {
    applySuccessAnimation(props.node)
  }
  updateParentStatus()
}

const applySuccessAnimation = (node: Section) => {
  const applyToParents = (currentNode: Section) => {
    if (currentNode.status === nodeStatus.value) {
      const nodeElement = document.querySelector(`[data-node-path="${currentNode.path}"]`)

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
    :data-node-path="node.path"
    @click="handleClick"
  >
    <div :class="['node-title', { 'center-title': !node.children || !node.children.length }]">
      {{ displayContent }}
    </div>

    <div
      v-if="node.children && node.children.length"
      class="node-children"
    >
      <TreeNode
        v-for="child in node.children"
        :key="child.path || child.name"
        :node="child"
        :depth="depth + 1"
        class="min-w-40 min-h-10"
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
}

.node-title {
  flex: 0 0 auto;
  text-align: center;
  font-size: 0.875rem;
  font-weight: bold;
  color: white;
  background-color: rgba(0, 0, 0, 0.25);
  pointer-events: none;
  padding: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.center-title {
  flex: 1;
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

.node-container:hover {
  opacity: 0.95;
  z-index: 10;
}

.node-container .node-children > .node-container:hover {
  opacity: 1;
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
