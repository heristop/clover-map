<script setup lang="ts">
import { ref, computed } from 'vue'
import TreeNode from './TreeNode.vue'
import ConfigDrawer from './ConfigDrawer.vue'
import { useStore } from '~/composables/store'

const chart = ref<HTMLElement | null>(null)
const store = useStore()

const rootNodes = computed(() => store.sections)
</script>

<template>
  <ConfigDrawer />

  <div
    ref="chart"
    class="tree-map flex flex-wrap w-full h-full bg-stone-50 dark:bg-stone-200 p-4 grid-container"
  >
    <ClientOnly>
      <TreeNode
        v-for="(rootNode, index) in rootNodes"
        :key="index"
        :node="rootNode"
        :depth="0"
      />
    </ClientOnly>
  </div>
</template>
