<script setup lang="ts">
import { ref, computed } from 'vue'
import TreeNode from './TreeNode.vue'
import ProjectPanel from './ProjectPanel.vue'
import ConfigDrawer from '~/components/config/ConfigDrawer.vue'
import { useStore } from '~/composables/store'
import { useProjects } from '~/composables/project'

const chart = ref < HTMLElement | null > (null)
const store = useStore()
const { currentProject, renameProject } = useProjects()

const isEditing = ref(false)
const editedName = ref('')

const rootNodes = computed(() => store.sections)
const panelCollapsed = computed(() => store.panelCollapsed)

const startEditing = () => {
  if (currentProject.value) {
    editedName.value = currentProject.value.name
    isEditing.value = true
  }
}

const saveEdit = () => {
  if (currentProject.value && editedName.value.trim()) {
    renameProject(currentProject.value.id, editedName.value.trim())
    isEditing.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false
}
</script>

<template>
  <div class="flex h-screen">
    <div class="flex">
      <ProjectPanel
        :class="[panelCollapsed ? 'w-14 min-w-14 max-w-14' : 'w-64 min-w-64 max-w-64']"
        class="z-10"
      />

      <ConfigDrawer class="max-w-64" />
    </div>

    <div class="flex-grow overflow-hidden">
      <div
        v-if="currentProject"
        class="p-3 bg-stone-200 dark:bg-stone-600 text-stone-800 dark:text-stone-200 flex items-center drop-shadow-sm"
      >
        <template v-if="isEditing">
          <input
            v-model="editedName"
            class="bg-transparent border-b border-stone-400 dark:border-stone-300 focus:outline-none focus:border-stone-600 dark:focus:border-stone-100 px-1"
            :class="{ 'text-stone-800 dark:text-stone-200': true }"
            autofocus
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
          >
          <button
            class="ml-2 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
            aria-label="Save project name"
            @click="saveEdit"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>

          <button
            class="ml-2 text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
            aria-label="Cancel editing"
            @click="cancelEdit"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </template>

        <template v-else>
          <span @dblclick="startEditing">{{ currentProject.name }}</span>

          <button
            class="ml-2 text-stone-600 hover:text-stone-700 dark:text-stone-300 dark:hover:text-stone-200"
            aria-label="Edit project name"
            @click="startEditing"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </template>
      </div>

      <div
        ref="chart"
        class="treemap flex flex-wrap w-full h-full bg-stone-50 dark:bg-stone-300 p-4 grid-container overflow-auto"
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
    </div>
  </div>
</template>

<style scoped>
.treemap {
  height: calc(100vh - 3rem);
}
</style>
