<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import RecursiveSection from '~/components/project/RecursiveSection.vue'
import CloverButton from '~/components/ui/CloverButton.vue'
import StatusManager from '~/components/config/StatusManager.vue'
import type { SectionWithOptionalStatus } from '~~/types'

const { loadFromUserInput } = useConfig()

const isStatusManagerOpen = ref(false)
const rootSection = ref<SectionWithOptionalStatus[]>([])
const isConfigLoading = ref(false)
const sampleError = ref<string | null>(null)
const jsonPreview = ref<string>('')

const generateKeyFromName = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

const updateKeysRecursively = (sections: SectionWithOptionalStatus[]) => {
  for (const section of sections) {
    section.key = generateKeyFromName(section.name)
    if (section.children && section.children.length > 0) {
      updateKeysRecursively(section.children)
    }
  }
}

const loadConfigFromUserInput = async () => {
  try {
    isConfigLoading.value = true
    updateKeysRecursively(rootSection.value)
    jsonPreview.value = JSON.stringify(rootSection.value, null, 2)
    await loadFromUserInput(jsonPreview.value)
    sampleError.value = ''
  }
  catch (error) {
    sampleError.value = 'Invalid JSON format'
  }
  finally {
    isConfigLoading.value = false
  }
}

const resetForm = () => {
  rootSection.value = [
    {
      key: 'project-1',
      name: 'Project 1',
      status: 'To Do',
      children: [
        {
          key: 'task-1',
          name: 'Task 1',
          status: 'To Do',
          children: [],
        },
        {
          key: 'task-2',
          name: 'Task 2',
          status: 'To Do',
          children: [
            {
              key: 'subtask-1',
              name: 'Subtask 1',
              status: 'To Do',
              children: [],
            },
            {
              key: 'subtask-2',
              name: 'Subtask 2',
              status: 'To Do',
              children: [],
            },
          ],
        },
      ],
    },
  ]
}

const updateSection = (updatedSection: SectionWithOptionalStatus) => {
  const updateRecursive = (sections: SectionWithOptionalStatus[] | undefined) => {
    if (!sections) return false

    for (let i = 0; i < sections.length; i++) {
      if (sections[i]?.key === updatedSection.key) {
        sections[i] = { ...sections[i], ...updatedSection }
        return true
      }
      if (sections[i]?.children && updateRecursive(sections[i]?.children)) {
        return true
      }
    }
    return false
  }

  updateRecursive(rootSection.value)
}

const addChildNode = (parentKey: string) => {
  const addRecursive = (sections: SectionWithOptionalStatus[]) => {
    for (const section of sections) {
      if (section.key === parentKey) {
        if (!section.children) section.children = []
        section.children.push({
          key: `child-${Date.now()}`,
          name: 'New Child Section',
          children: [],
        })
        return true
      }
      if (section.children && addRecursive(section.children)) {
        return true
      }
    }
    return false
  }
  addRecursive(rootSection.value)
}

const addSiblingNode = (parentKey: string) => {
  const addRecursive = (sections: SectionWithOptionalStatus[], parentKey: string) => {
    for (const section of sections) {
      if (section.key === parentKey) {
        const siblingNode = {
          key: `sibling-${Date.now()}`,
          name: 'New Sibling Section',
          children: [],
        }
        sections.push(siblingNode)
        return true
      }
      if (section.children && addRecursive(section.children, parentKey)) {
        return true
      }
    }
    return false
  }
  addRecursive(rootSection.value, parentKey)
}

const removeNode = (nodeKey: string) => {
  const removeRecursive = (sections: SectionWithOptionalStatus[]) => {
    const index = sections.findIndex(section => section.key === nodeKey)
    if (index !== -1) {
      sections.splice(index, 1)
      return true
    }
    for (const section of sections) {
      if (section.children && removeRecursive(section.children)) {
        return true
      }
    }
    return false
  }
  removeRecursive(rootSection.value)
}

watch(rootSection, () => {
  jsonPreview.value = JSON.stringify(rootSection.value, null, 2)
}, { deep: true })

const toggleStatusManager = () => {
  isStatusManagerOpen.value = !isStatusManagerOpen.value
}

onMounted(() => {
  resetForm()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-row justify-between items-center mb-4 space-x-4">
      <h3 class="flex text-2xl font-semibold text-stone-700 dark:text-stone-300">
        Section Management
      </h3>
      <CloverButton
        :is-active="false"
        class="flex bg-stone-300/40 hover:bg-stone-400/40 border-stone-400"
        aria-label="Manage Custom Statuses"
        @click="toggleStatusManager"
      >
        Manage Custom Statuses
      </CloverButton>
    </div>

    <div class="max-h-96 overflow-auto justify-center">
      <div
        v-if="isStatusManagerOpen"
        class="mb-6 px-0 w-full md:w-2/3 mx-auto"
      >
        <StatusManager draggable />
      </div>

      <div class="space-y-4">
        <RecursiveSection
          v-for="section in rootSection"
          :key="section.key"
          :section="section"
          :depth="0"
          @update:section="updateSection"
          @add-child="addChildNode"
          @add-sibling="addSiblingNode"
          @remove-node="removeNode"
        />
      </div>
    </div>

    <div class="flex flex-col md:flex-row mt-6 space-y-4 md:space-y-0 md:space-x-4">
      <div class="w-full md:w-1/4">
        <CloverButton
          :is-active="false"
          class="bg-stone-300/40 hover:bg-stone-400/40 border-stone-400 transition-all duration-300 w-full"
          aria-label="Reset Form"
          @click="resetForm"
        >
          Reset Form
        </CloverButton>
      </div>

      <div class="w-full md:w-3/4">
        <CloverButton
          :is-active="false"
          :disabled="isConfigLoading"
          full-width
          class="bg-stone-300/40 hover:bg-stone-400/40 border-stone-400 transition-all duration-300"
          aria-label="Load Configuration"
          @click="loadConfigFromUserInput"
        >
          <template #icon>
            <svg
              v-if="!isConfigLoading"
              class="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4m5-13v4a1 1 0 0 1-1 1H5m0 6h9m0 0-2-2m2 2-2 2"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          </template>
          <span v-if="!isConfigLoading">Load Custom Configuration</span>
          <span v-else>Loading...</span>
        </CloverButton>
      </div>
    </div>
  </div>
</template>
