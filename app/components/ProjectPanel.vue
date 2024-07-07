<script setup lang="ts">
import { computed, ref } from 'vue'
import { format } from 'date-fns'
import { useRouter } from 'vue-router'
import TButton from './ui/TButton.vue'
import { useProjects } from '~/composables/project'
import { useStore } from '~/composables/store'
import { useSnackbar } from '#imports'
import { useConfig } from '~/composables/config'

const { projects, setCurrentProject, deleteProject } = useProjects()
const store = useStore()
const snackbar = useSnackbar()
const router = useRouter()
const { loadFromFile, exportToFile } = useConfig()

const currentProjectId = computed(() => store.currentProjectId)
const confirmDelete = ref(false)
const projectToDelete = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const panelCollapsed = computed(() => store.panelCollapsed)

const sortedProjects = computed(() => {
  return [...projects.value].sort((a, b) => parseInt(b.id) - parseInt(a.id))
})

const selectProject = (projectId: string) => {
  setCurrentProject(projectId)

  router.push(`/projects/${projectId}`)
}

const handleAction = (action: string) => {
  if (action === 'upload') {
    fileInput.value?.click()
  }
  else if (action === 'export') {
    handleExport()
  }
  else if (action === 'home') {
    goToHome()
  }
}

const initiateDelete = (event: Event, projectId: string) => {
  event.stopPropagation()

  projectToDelete.value = projectId
  confirmDelete.value = true
}

const confirmDeleteProject = () => {
  if (projectToDelete.value && projects.value) {
    const index = projects.value.findIndex(p => p.id === projectToDelete.value) ?? -1

    deleteProject(projectToDelete.value)

    snackbar.add({
      type: 'success',
      title: 'Project deleted successfully.',
    })

    const previousProject = projects.value[index - 1]

    if (index > 0 && previousProject !== undefined) {
      selectProject(previousProject.id)
    }
    else if (projects.value.length > 0 && projects.value[0] !== undefined) {
      selectProject(projects.value[0].id)
    }
  }

  cancelDelete()
}

const cancelDelete = () => {
  confirmDelete.value = false
  projectToDelete.value = null
}

const toggleCollapse = () => {
  store.toggleCollapse()
}

const goToHome = () => {
  store.clear()
  router.push('/')
}

const handleFileUpload = (event: Event) => {
  loadFromFile(event)
}

const handleExport = () => {
  if (store.currentProject) {
    exportToFile()

    return
  }

  snackbar.add({
    type: 'error',
    title: 'No project selected for export.',
  })
}
</script>

<template>
  <div
    class="fixed md:relative project-panel bg-stone-100 dark:bg-stone-700 h-full overflow-y-auto transition-all duration-300 ease-in-out flex flex-col"
    :class="[panelCollapsed ? 'w-16' : 'w-64']"
  >
    <div class="flex justify-between items-center p-4 border-b border-stone-200 dark:border-stone-600">
      <svg
        v-if="!panelCollapsed"
        class="w-8 h-8"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <defs>
          <linearGradient
            id="grad1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style="stop-color:#DD5E89;stop-opacity:1"
            />
            <stop
              offset="100%"
              style="stop-color:#F7BB97;stop-opacity:1"
            />
          </linearGradient>
        </defs>
        <path
          fill="url(#grad1)"
          d="M5 3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Zm14 18a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4ZM5 11a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5Zm14 2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4Z"
        />
      </svg>

      <h2
        v-if="!panelCollapsed"
        class="flex flex-col items-center justify-center text-center text-xl font-semibold drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-[#DD5E89] to-[#F7BB97]"
      >
        TreemapPulse
      </h2>

      <button
        class="text-rose-500 hover:text-rose-700 dark:text-stroseone-300 dark:hover:text-rose-100 opacity-50 cursor-pointer transition-colors duration-200"
        aria-label="Toggle project panel"
        @click="toggleCollapse"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            v-if="panelCollapsed"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M9 5l7 7-7 7"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </div>

    <div
      v-if="!panelCollapsed"
      class="flex-grow overflow-y-auto p-4"
    >
      <ul class="space-y-2">
        <TransitionGroup name="list">
          <li
            v-for="project in sortedProjects"
            :key="project.id"
            :class="[
              'cursor-pointer p-2 rounded transition-all duration-300 ease-in-out flex justify-between items-center',
              project.id === currentProjectId
                ? 'bg-stone-300 dark:bg-stone-500 text-stone-800 dark:text-stone-100'
                : 'hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-600 dark:text-stone-300',
            ]"
            @click="selectProject(project.id)"
          >
            <div class="flex flex-col w-4/5">
              <span class="truncate font-semibold">{{ project.name }}</span>
              <span class="text-xs text-stone-500 dark:text-stone-400">
                {{ format(new Date(project.createdAt), 'MMM d, yyyy') }}
              </span>
            </div>
            <button
              class="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-600 transition-colors duration-200 ml-2 flex-shrink-0"
              :disabled="projects.length === 1"
              :class="{ 'opacity-50 cursor-not-allowed': projects.length === 1 }"
              aria-label="Delete project"
              @click="initiateDelete($event, project.id)"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </li>
        </TransitionGroup>
      </ul>
    </div>

    <div
      v-else
      class="flex-grow flex flex-col items-center space-y-4 p-2"
    >
      <button
        v-for="project in sortedProjects"
        :key="project.id"
        class="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
        :class="[
          project.id === currentProjectId
            ? 'bg-stone-300 dark:bg-stone-500 text-stone-800 dark:text-stone-100'
            : 'bg-stone-200 hover:bg-stone-300 dark:bg-stone-600 dark:hover:bg-stone-500 text-stone-600 dark:text-stone-300',
        ]"
        @click="selectProject(project.id)"
      >
        {{ project.name.charAt(0).toUpperCase() }}
      </button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".json"
      class="hidden"
      @change="handleFileUpload"
    >

    <div
      v-if="!panelCollapsed"
      class="p-4 border-t border-stone-200 dark:border-stone-600 space-y-2"
    >
      <TButton
        full-width
        aria-label="Upload project"
        class="border-0"
        @click="() => fileInput?.click()"
      >
        <template #icon>
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
        </template>

        Upload Project
      </TButton>

      <TButton
        full-width
        aria-label="Export project"
        class="border-0"
        @click="handleExport"
      >
        <template #icon>
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </template>

        Export Project
      </TButton>

      <TButton
        full-width
        aria-label="Go to home"
        class="border-0"
        @click="goToHome"
      >
        <template #icon>
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </template>

        Home
      </TButton>
    </div>

    <div
      v-else
      class="p-2 border-t border-stone-200 dark:border-stone-600 space-y-2"
    >
      <button
        v-for="(action, index) in ['upload', 'export', 'home']"
        :key="index"
        class="w-full p-2 rounded flex items-center justify-center bg-stone-200 hover:bg-stone-300 dark:bg-stone-600 dark:hover:bg-stone-500 text-stone-700 dark:text-stone-200 transition-colors duration-200"
        @click="handleAction(action)"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            v-if="action === 'upload'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
          <path
            v-else-if="action === 'export'"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </button>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="confirmDelete"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-xl">
        <h3 class="text-lg font-bold mb-4 text-stone-800 dark:text-stone-200">
          Confirm Deletion
        </h3>
        <p class="mb-4 text-stone-600 dark:text-stone-300">
          Are you sure you want to delete this project?
        </p>
        <div class="flex justify-end space-x-2">
          <button
            class="px-4 py-2 bg-stone-300 text-stone-800 rounded hover:bg-stone-400 transition-colors duration-200"
            @click="cancelDelete"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors duration-200"
            @click="confirmDeleteProject"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-panel {
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
