<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useStore } from '~/composables/store'
import { useConfig } from '~/composables/config'
import { useProjects } from '~/composables/project'
import CloverButton from '~/components/ui/CloverButton.vue'
import DarkModeToggle from '~/components/ui/DarkModeToggle.vue'
import ProjectForm from '~/components/project/ProjectForm.vue'
import { useRuntimeConfig, navigateTo } from '#imports'

const store = useStore()
const { setCurrentProject } = useProjects()
const isLoading = ref<boolean>(true)
const darkMode = computed(() => store.darkMode)

const { fileInput, loadFromModel, loadFromFile, loadFromUrl } = useConfig()

const url = ref(`${useRuntimeConfig().public.apiBaseUrl}/configs/blank.json`)

const isConfigLoading = ref(false)

const loadConfigFromApi = async (model: string) => {
  isConfigLoading.value = true
  try {
    await loadFromModel(model)
  }
  finally {
    isConfigLoading.value = false
  }
}

const loadConfigFromUrl = async (inputUrl: string) => {
  isConfigLoading.value = true
  try {
    await loadFromUrl(inputUrl)
  }
  finally {
    isConfigLoading.value = false
  }
}

const openExternalLink = (link: string) => {
  window.open(link, '_blank')
}

const observeSections = () => {
  const sections = document.querySelectorAll('.section')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
    },
  )

  sections.forEach((section) => {
    observer.observe(section)
  })
}

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}

const navigateToLastCreatedProject = () => {
  if (store.projects.length >= 1) {
    const projectId = store.projects[store.projects.length - 1]?.id

    if (projectId) {
      setCurrentProject(projectId)

      return navigateTo(`/projects/${projectId}`)
    }
  }
}

const activeTab = ref('sample')

onMounted(() => {
  if (store.darkMode) {
    document.documentElement.classList.add('dark')
  }

  nextTick(() => {
    isLoading.value = false
    observeSections()
  })
})
</script>

<template>
  <div
    :class="{ dark: darkMode }"
    class="relative w-full min-h-screen bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900 text-stone-900 dark:text-stone-50"
  >
    <!-- Header -->
    <header>
      <DarkModeToggle
        position="absolute top-8 right-8"
        class="z-50"
      />
    </header>

    <!-- Main Content -->
    <main class="pt-0">
      <!-- Background Grid -->
      <div class="background-grid fixed inset-0 z-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <div class=" bg-purple-900 rounded-2xl opacity-30" />
        <div class="bg-yellow-900 rounded-2xl opacity-30" />
        <div class="bg-blue-900 col-span-2 rounded-2xl opacity-30" />
        <div class="bg-pink-900 col-span-2 rounded-2xl opacity-30" />
        <div class="bg-green-900 rounded-2xl opacity-30" />
        <div class="bg-red-900 rounded-2xl opacity-30" />
        <div class="bg-indigo-900 rounded-2xl opacity-30" />
        <div class="bg-teal-900 rounded-2xl opacity-30" />
        <div class="bg-orange-900 rounded-2xl opacity-30" />
        <div class="bg-lime-900 rounded-2xl opacity-30" />
      </div>

      <div class="absolute h-full inset-0 z-10 bg-stone-200 dark:bg-stone-800 opacity-90 dark:opacity-60" />

      <!-- Welcome Section -->
      <section
        v-if="!isLoading"
        id="home"
        class="relative z-20 flex flex-col justify-center items-center min-h-screen p-6 max-w-6xl mx-auto section show"
      >
        <transition
          name="fade"
          appear
        >
          <div class="text-center space-y-8 py-16">
            <h1 class="flex flex-col items-center justify-center text-center text-4xl font-bold mb-10 drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-[#DD5E89] to-[#F7BB97]">
              <img
                alt="Clover Map Logo"
                src="@/assets/logo.svg"
                class="w-20 h-20 mb-6"
                aria-hidden="true"
              >

              Welcome to Clover Map!
            </h1>

            <h2 class="text-xl text-stone-600 dark:text-stone-300 max-w-3xl mx-auto font-light">
              A simple and interactive treemap visualization tool for your projects
            </h2>

            <div class="text-base text-stone-500 dark:text-stone-400 max-w-3xl mx-auto space-y-4">
              <div
                v-if="store.projects.length === 0"
                class="space-y-2"
              >
                <p>It looks like you haven't created any project yet.</p>
                <p>Get started by loading sample data or creating your own project!</p>
                <p class="font-semibold text-stone-600 dark:text-stone-300">
                  All your data is stored locally in your browser.
                </p>
              </div>

              <div
                v-else
                class="space-y-2"
              >
                <p>
                  You have created <strong>{{ store.projects.length }}</strong>
                  {{ store.projects.length === 1 ? 'project' : 'projects' }} so far.
                </p>
                <p>Continue working on your existing projects or create a new one!</p>
                <p class="font-semibold text-stone-600 dark:text-stone-300">
                  All your data is stored locally in your browser.
                </p>
              </div>
            </div>

            <div class="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 p-6">
              <CloverButton
                v-if="store.projects.length > 0"
                :is-active="false"
                class="bg-stone-50 dark:bg-stone-600 hover:bg-stone-50/75 dark:hover:bg-stone-500 border-stone-200 dark:border-stone-500 transition-all duration-300 transform hover:scale-105"
                aria-label="View my Projects"
                @click="navigateToLastCreatedProject"
              >
                <template #icon>
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </template>
                View My Projects
              </CloverButton>

              <CloverButton
                :is-active="false"
                class="bg-gradient-to-r from-[#DD5E89] to-[#F7BB97] text-white border-none transition-all duration-300 transform hover:scale-105"
                aria-label="Create New Project"
                @click="scrollToSection('create-project')"
              >
                <template #icon>
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </template>
                Create New Project
              </CloverButton>
            </div>

            <div class="mt-12 animate-bounce">
              <svg
                class="w-8 h-8 mx-auto cursor-pointer drop-shadow-md text-stone-600 dark:text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                @click="scrollToSection('create-project')"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </transition>
      </section>

      <!-- Create Project Section -->
      <section
        id="create-project"
        class="min-h-screen"
      >
        <transition
          name="fade"
          appear
        >
          <div class="relative z-20 flex flex-col justify-center items-center min-h-screen p-6 max-w-6xl mx-auto section">
            <h2 class="text-3xl font-semibold mb-8 text-stone-700 dark:text-stone-300">
              Create Your Project
            </h2>

            <div class="w-full max-w-3xl bg-white dark:bg-stone-700 rounded-lg shadow-lg p-8 space-y-8">
              <!-- Tab Navigation -->
              <div class="flex flex-col md:flex-row md:space-x-4 mb-6">
                <button
                  :class="[
                    ' flex-1 py-2 px-4 rounded-t-lg font-medium transition-colors duration-200',
                    activeTab === 'sample'
                      ? 'text-white bg-gradient-to-r from-[#DD5E89] to-[#F7BB97]'
                      : 'border border-dashed border-stone-300 dark:border-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800',
                  ]"
                  @click="activeTab = 'sample'"
                >
                  Sample Data
                </button>
                <button
                  :class="[
                    'flex-1 py-2 px-4 rounded-t-lg font-medium transition-colors duration-200',
                    activeTab === 'custom'
                      ? 'text-white bg-gradient-to-r from-[#DD5E89] to-[#F7BB97]'
                      : 'border border-dashed border-stone-300 dark:border-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800',
                  ]"
                  aria-label="Custom Configuration"
                  @click="activeTab = 'custom'"
                >
                  Custom Configuration
                </button>
              </div>

              <!-- Sample Data Tab -->
              <div v-if="activeTab === 'sample'">
                <h3 class="text-2xl font-semibold mb-4 text-stone-700 dark:text-stone-300">
                  Load Sample Data
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Sample Data Buttons -->
                  <CloverButton
                    :is-active="false"
                    :disabled="isConfigLoading"
                    class="bg-stone-300/40 hover:bg-stone-400/40 border-stone-400"
                    aria-label="Load Blank Project"
                    @click="loadConfigFromApi('blank')"
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
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
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
                    <span v-if="!isConfigLoading">Blank Project</span>
                    <span v-else>Loading...</span>
                  </CloverButton>

                  <CloverButton
                    :is-active="false"
                    class="bg-stone-300/40 hover:bg-stone-400/40 border-stone-400"
                    aria-label="Load Project Migration Data"
                    @click="loadConfigFromApi('ecom-migration')"
                  >
                    <template #icon>
                      <svg
                        class="w-5 h-5"
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
                          d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                        />
                      </svg>
                    </template>

                    E-com Migration
                  </CloverButton>

                  <CloverButton
                    :is-active="false"
                    class="bg-stone-300/40 hover:bg-stone-400/40 border-stone-400"
                    aria-label="Load Bug Tracking Data"
                    @click="loadConfigFromApi('bug-tracking')"
                  >
                    <template #icon>
                      <svg
                        class="w-5 h-5"
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
                          d="M10 5 9 4V3m5 2 1-1V3m-3 6v11m0-11a5 5 0 0 1 5 5m-5-5a5 5 0 0 0-5 5m5-5a4.959 4.959 0 0 1 2.973 1H15V8a3 3 0 0 0-6 0v2h.027A4.959 4.959 0 0 1 12 9Zm-5 5H5m2 0v2a5 5 0 0 0 10 0v-2m2.025 0H17m-9.975 4H6a1 1 0 0 0-1 1v2m12-3h1.025a1 1 0 0 1 1 1v2M16 11h1a1 1 0 0 0 1-1V8m-9.975 3H7a1 1 0 0 1-1-1V8"
                        />
                      </svg>
                    </template>

                    Bug Tracking
                  </CloverButton>

                  <CloverButton
                    :is-active="false"
                    class="bg-stone-300/40 hover:bg-stone-400/40 border-stone-400"
                    aria-label="Load Recruitment Data"
                    @click="loadConfigFromApi('recruitment')"
                  >
                    <template #icon>
                      <svg
                        class="w-5 h-5"
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
                          stroke-width="2"
                          d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                        />
                      </svg>
                    </template>

                    Recruitment
                  </CloverButton>
                </div>

                <!-- Load Configuration Section -->
                <h3 class="text-2xl font-semibold mt-8 mb-4 text-stone-700 dark:text-stone-300">
                  Load Configuration
                </h3>
                <div class="space-y-6">
                  <!-- Load from File -->
                  <div class="flex flex-col space-y-2">
                    <label
                      for="file-upload"
                      class="text-sm font-medium text-stone-700 dark:text-stone-300"
                    >
                      Load from File
                    </label>
                    <div class="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                      <input
                        id="file-upload"
                        ref="fileInput"
                        type="file"
                        accept=".json"
                        class="hidden"
                        @change="loadFromFile"
                      >
                      <CloverButton
                        :is-active="false"
                        :disabled="isConfigLoading"
                        class="mt-4 md:mt-0 bg-stone-100 dark:bg-stone-600 hover:bg-stone-200 dark:hover:bg-stone-500border-stone-300 dark:border-stone-500 transition-all duration-300"
                        aria-label="Upload File"
                        @click="($refs.fileInput as HTMLInputElement).click()"
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
                              d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"
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
                        <span v-if="!isConfigLoading">Select File</span>
                        <span v-else>Loading...</span>
                      </CloverButton>
                    </div>

                    <p class="text-xs text-stone-500 dark:text-stone-400">
                      Select a JSON file from your computer.
                    </p>
                  </div>

                  <!-- Load from URL -->
                  <div class="flex flex-col space-y-2">
                    <label
                      for="url-input"
                      class="text-sm font-medium text-stone-700 dark:text-stone-300"
                    >
                      Load from URL
                    </label>
                    <div class="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                      <input
                        id="url-input"
                        v-model="url"
                        placeholder="https://"
                        class="flex-grow bg-stone-50 dark:bg-stone-600 text-stone-900 dark:text-white
          px-4 py-2 rounded-md text-sm shadow-sm border border-stone-300 dark:border-stone-500
          focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-300 focus:border-transparent"
                      >
                      <CloverButton
                        :is-active="false"
                        :disabled="!url || isConfigLoading"
                        class="mt-4 md:mt-0 bg-stone-100 dark:bg-stone-600 hover:bg-stone-200 dark:hover:bg-stone-500
          border-stone-300 dark:border-stone-500 transition-all duration-300"
                        aria-label="Load from URL"
                        @click="loadConfigFromUrl(url)"
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
                        <span v-if="!isConfigLoading">Load</span>
                        <span v-else>Loading...</span>
                      </CloverButton>
                    </div>

                    <p class="text-xs text-stone-500 dark:text-stone-400">
                      Enter the URL of a JSON configuration file.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Custom Configuration Tab -->
              <div
                v-if="activeTab === 'custom'"
                class="space-y-4"
              >
                <ProjectForm />
              </div>
            </div>

            <!-- External Links -->
            <div class="mt-12 flex justify-center space-x-4">
              <CloverButton
                :is-active="false"
                aria-label="View on GitHub"
                class="bg-stone-50 dark:bg-stone-600 hover:bg-stone-50/75 dark:hover:bg-stone-500 border-stone-200 dark:border-stone-500 transition-all duration-300"
                @click="openExternalLink('https://github.com/heristop/clover-map')"
              >
                <template #icon>
                  <!-- GitHub Icon -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon flex-shrink-0 h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                    />
                  </svg>
                </template>
                View on GitHub
              </CloverButton>

              <CloverButton
                :is-active="false"
                aria-label="Edit on StackBlitz"
                class="bg-stone-50 dark:bg-stone-600 hover:bg-stone-50/75 dark:hover:bg-stone-500 border-stone-200 dark:border-stone-500 transition-all duration-300"
                @click="openExternalLink('https://stackblitz.com/~/github.com/heristop/clover-map')"
              >
                <template #icon>
                  <!-- StackBlitz Icon -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon flex-shrink-0 h-5 w-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 0L1.75 6v12L12 24l10.25-6V6zm-1.775 18l1.08-4.657l-2.428-2.397L13.79 6l-1.082 4.665l2.414 2.384z"
                    />
                  </svg>
                </template>
                Edit on StackBlitz
              </CloverButton>
            </div>

            <!-- Footer -->
            <AppFooter class="mt-12" />
          </div>
        </transition>
      </section>
    </main>
  </div>
</template>

<style scoped>
.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.section {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
}

.section.show {
  opacity: 1;
  transform: translateY(0);
}
</style>
