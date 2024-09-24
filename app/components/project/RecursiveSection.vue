<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '~/composables/store'
import type { SectionWithOptionalStatus } from '~~/types'

const props = defineProps<{
  section: SectionWithOptionalStatus
  depth: number
}>()

const emit = defineEmits<{
  (e: 'update:section', section: SectionWithOptionalStatus): void
  (e: 'add-child' | 'add-sibling' | 'remove-node', key: string): void
}>()

const store = useStore()
const { statuses } = storeToRefs(store)

const getStatusColor = computed(() => (statusName?: string) => {
  if (!statusName) return '#CCCCCC'
  const status = statuses.value.find(s => s.name === statusName)
  return status ? status.color : '#CCCCCC'
})

const updateSectionName = (newName: string) => {
  emit('update:section', { ...props.section, name: newName })
}

const updateSectionStatus = (newStatus: string | undefined) => {
  emit('update:section', { ...props.section, status: newStatus })
}

const addSibling = () => {
  emit('add-sibling', props.section.key)
}

const addChild = () => {
  emit('add-child', props.section.key)
}

const removeNode = () => {
  emit('remove-node', props.section.key)
}
</script>

<template>
  <div :class="['relative', props.depth > 0 ? 'ml-2 sm:ml-4 pl-2 sm:pl-4 border-l-2 border-stone-300 dark:border-stone-600' : '']">
    <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
      <input
        :value="section.name"
        type="text"
        class="text-sm border rounded p-2 text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-600 w-full focus:ring focus:ring-stone-500/20 transition-all duration-300"
        placeholder="Section Name"
        @input="updateSectionName(($event.target as HTMLInputElement).value)"
      >

      <div class="flex items-center space-x-2">
        <select
          :value="section.status"
          class="text-sm max-w-32 p-2 border rounded text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-600 focus:ring focus:ring-stone-500/20 transition-all duration-300"
          :style="{ borderColor: getStatusColor(section.status) }"
          @change="updateSectionStatus(($event.target as HTMLSelectElement).value)"
        >
          <option
            v-for="status in statuses"
            :key="status.name"
            :value="status.name"
          >
            {{ status.name }}
          </option>
        </select>

        <div class="flex space-x-1">
          <button
            class="text-stone-500 hover:text-stone-600 dark:text-stone-400 dark:hover:text-stone-200 transition-colors duration-300 p-1"
            @click="addSibling"
          >
            <svg
              class="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
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
            class="text-stone-500 hover:text-stone-600 dark:text-stone-400 dark:hover:text-stone-200 transition-colors duration-300 p-1"
            @click="addChild"
          >
            <svg
              class="w-5 h-5"
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
            class="text-stone-500 hover:text-stone-600 dark:text-stone-400 dark:hover:text-stone-200 transition-colors duration-300 p-1"
            @click="removeNode"
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
                d="M19 7l-.867 12.142A2 2 0 01 16.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="section.children && section.children.length"
      class="space-y-2"
    >
      <RecursiveSection
        v-for="(child) in section.children"
        :key="child.key"
        :section="child"
        :depth="depth + 1"
        @update:section="$emit('update:section', $event)"
        @add-child="$emit('add-child', $event)"
        @add-sibling="$emit('add-sibling', $event)"
        @remove-node="$emit('remove-node', $event)"
      />
    </div>
  </div>
</template>
