<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '~/composables/store'
import { useConfig } from '~/composables/config'
import AppFooter from '~/components/AppFooter.vue'
import TButton from '~/components/ui/TButton.vue'

const store = useStore()
const router = useRouter()
const isLoading = ref<boolean>(true)
const isConfigLoaded = computed(() => store.configLoaded)
const darkMode = computed(() => store.darkMode)

const { fileInput, loadFromModel, loadFromFile, loadFromUrl, loadFromUserInput } = useConfig()

const url = ref(`${useRuntimeConfig().public.apiBaseUrl}/configs/blank.json`)
const sample = ref(`[
  {
    "key": "project-1",
    "name": "Project 1",
    "children": [
      {
        "key": "task-1",
        "name": "Task 1",
        "status": "In Progress",
        "children": []
      },
      {
        "key": "task-2",
        "name": "Task 2",
        "status": "Done",
        "children": []
      }
    ]
  }
]`)

const loadConfigFromApi = async (model: string) => {
  await loadFromModel(model)
}

const loadConfigFromUrl = async (url: string) => {
  await loadFromUrl(url)
}

const loadConfigFromUserInput = async () => {
  await loadFromUserInput(sample.value)
}

const toggleDarkMode = () => {
  store.darkMode = !store.darkMode

  if (store.darkMode) {
    document.documentElement.classList.add('dark')
  }

  if (!store.darkMode) {
    document.documentElement.classList.remove('dark')
  }
}

const openGitHub = () => {
  window.open('https://github.com/heristop/tree-map-pulse', '_blank')
}

const openStackBlitz = () => {
  window.open('https://stackblitz.com/~/github.com/heristop/tree-map-pulse', '_blank')
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

onMounted(() => {
  if (store.darkMode) {
    document.documentElement.classList.add('dark')
  }

  if (isConfigLoaded.value) {
    router.push('/viewport')
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
    class="relative w-full min-h-screen overflow-auto bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-50"
  >
    <button
      class="fixed top-4 right-4 p-2 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-50 rounded shadow-sm z-50"
      aria-label="dark mode"
      @click="toggleDarkMode"
    >
      <svg
        v-if="darkMode"
        class="w-6 h-6"
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
          d="M12 5V3m0 18v-2M7.05 7.05 5.636 5.636m12.728 12.728L16.95 16.95M5 12H3m18 0h-2M7.05 16.95l-1.414 1.414M18.364 5.636 16.95 7.05M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
        />
      </svg>
      <svg
        v-else
        class="w-6 h-6"
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
          d="M12 21a9 9 0 0 1-.5-17.986V3c-.354.966-.5 1.911-.5 3a9 9 0 0 0 9 9c.239 0 .254.018.488 0A9.004 9.004 0 0 1 12 21Z"
        />
      </svg>
    </button>

    <div class="background-grid fixed inset-0 z-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <div class="bg-purple-300 dark:bg-purple-700 rounded-lg opacity-30" />
      <div class="bg-yellow-300 dark:bg-yellow-700 rounded-lg opacity-30" />
      <div class="bg-blue-300 dark:bg-blue-700 col-span-2 opacity-30" />
      <div class="bg-pink-300 dark:bg-pink-700 col-span-2 opacity-30" />
      <div class="bg-green-300 dark:bg-green-700 rounded-lg opacity-30" />
      <div class="bg-red-300 dark:bg-red-700 rounded-lg opacity-30" />
      <div class="bg-indigo-300 dark:bg-indigo-700 rounded-lg opacity-30" />
      <div class="bg-teal-300 dark:bg-teal-700 rounded-lg opacity-30" />
      <div class="bg-orange-300 dark:bg-orange-700 rounded-lg opacity-30" />
      <div class="bg-lime-300 dark:bg-lime-700 rounded-lg opacity-30" />
    </div>

    <div class="absolute h-full inset-0 z-10 bg-stone-200 dark:bg-stone-800 opacity-80 dark:opacity-90" />

    <div
      v-if="!isLoading"
      class="relative z-20 flex flex-col justify-center items-center h-screen p-6 max-w-6xl mx-auto section show"
    >
      <transition
        name="fade"
        appear
      >
        <section class="text-center space-y-6">
          <h1 class="flex flex-col items-center justify-center text-center text-4xl font-semibold drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-[#DD5E89] to-[#F7BB97]">
            <svg
              class="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 mb-2 sm:mb-3 md:mb-4"
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
            Welcome to TreeMapPulse!
          </h1>

          <div class="text-lg text-stone-600 dark:text-stone-300 max-w-3xl mx-auto">
            It looks like you haven't loaded any configuration yet. Click one of the buttons below to load sample data and see TreeMapPulse in action!
          </div>

          <div class="flex justify-center space-x-4 p-6">
            <TButton
              aria-label="View on GitHub"
              class="w-full md:w-auto"
              :is-active="false"
              @click="openGitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                class="icon flex-shrink-0 h-5 w-5 mr-2"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                />
              </svg>
              <span>View on GitHub</span>
            </TButton>

            <TButton
              aria-label="Edit on StackBlitz"
              class="w-full md:w-auto"
              :is-active="false"
              @click="openStackBlitz"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                aria-hidden="true"
                role="img"
                class="icon flex-shrink-0 h-5 w-5 mr-2"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 0L1.75 6v12L12 24l10.25-6V6zm-1.775 18l1.08-4.657l-2.428-2.397L13.79 6l-1.082 4.665l2.414 2.384z"
                />
              </svg>
              <span>Edit on StackBlitz</span>
            </TButton>
          </div>

          <div class="mt-8 animate-bounce">
            <svg
              class="w-6 h-6 mx-auto cursor-pointer text-stone-600 dark:text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              @click="scrollToSection('section-to-fade')"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </section>
      </transition>
    </div>

    <div class="min-h-screen">
      <transition
        name="fade"
        appear
      >
        <section
          id="section-to-fade"
          class="min-h-screen section"
        >
          <div class="relative z-20 flex flex-col justify-center items-center min-h-60 space-y-8 p-6 max-w-6xl mx-auto">
            <h2 class="text-lg font-bold drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-stone-700 to-stone-500 dark:from-stone-400 dark:to-stone-200">
              Load Sample Data
            </h2>

            <div class="flex flex-col w-full md:w-fit md:flex-row md:space-x-4 text-center space-y-6 md:space-y-0">
              <TButton
                aria-label="Load Project Project"
                :is-active="false"
                @click="loadConfigFromApi('blank')"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
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

                Blank Project
              </TButton>

              <TButton
                aria-label="Load Project Migration Data"
                :is-active="false"
                @click="loadConfigFromApi('ecom-migration')"
              >
                <svg
                  class="w-5 h-5 mr-2"
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

                E-com Migration
              </TButton>

              <TButton
                aria-label="Load Bug Tracking Data"
                :is-active="false"
                @click="loadConfigFromApi('bug-tracking')"
              >
                <svg
                  class="w-5 h-5 mr-2"
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

                Bug Tracking
              </TButton>

              <TButton
                aria-label="Load Recruitment Data"
                :is-active="false"
                @click="loadConfigFromApi('recruitment')"
              >
                <svg
                  class="w-5 h-5 mr-2"
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

                Recruitment
              </TButton>
            </div>
          </div>

          <div class="relative z-20 flex flex-col justify-center items-center min-h-60 space-y-8 p-6 max-w-6xl mx-auto">
            <h2 class="text-lg font-bold drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-stone-700 to-stone-500 dark:from-stone-400 dark:to-stone-200">
              Load Configuration
            </h2>

            <input
              ref="fileInput"
              type="file"
              accept=".json"
              class="hidden"
              @change="loadFromFile"
            >

            <div class="flex flex-col w-full md:w-fit md:flex-row md:space-x-4 space-y-6 md:space-y-0">
              <TButton
                aria-label="Upload File"
                :is-active="false"
                @click="($refs.fileInput as HTMLInputElement).click()"
              >
                <svg
                  class="w-5 h-5 mr-2"
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
                    d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"
                  />
                </svg>
                <span>Upload File</span>
              </TButton>
            </div>

            <div class="flex flex-col w-full md:w-2/3 md:flex-row md:space-x-4 space-y-6 md:space-y-0">
              <input
                v-model="url"
                placeholder="https://"
                class="bg-stone-100 text-stone-900 dark:bg-stone-700 dark:text-white px-4 py-2 rounded-md text-sm w-full md:w-2/3 shadow-sm"
              >
              <TButton
                aria-label="Load Configuration from URL"
                :is-active="false"
                :disabled="!url"
                @click="loadConfigFromUrl(url)"
              >
                <svg
                  class="w-5 h-5 mr-2"
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
                    d="M5 12V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4m5-13v4a1 1 0 0 1-1 1H5m0 6h9m0 0-2-2m2 2-2 2"
                  />
                </svg>

                Load from URL
              </TButton>
            </div>
          </div>

          <div class="relative z-20 flex flex-col justify-center items-center min-h-60 space-y-8 p-6 max-w-6xl mx-auto">
            <h2 class="text-lg font-bold drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-stone-700 to-stone-500 dark:from-stone-400 dark:to-stone-200">
              Load Custom Configuration
            </h2>

            <div class="bg-stone-100 text-stone-900 dark:bg-stone-700 dark:text-white p-4 rounded-md text-sm w-full md:w-1/2 shadow-sm">
              <label
                for="sample-config"
                class="block text-sm font-medium text-stone-900 dark:text-stone-50"
              >
                Sample Configuration
              </label>

              <textarea
                id="sample-config"
                v-model="sample"
                class="w-full h-60 text-xs text-stone-500 bg-stone-200 rounded-md p-2 dark:bg-stone-600 dark:text-stone-300 mt-1 focus:border-stone-300 dark:focus:border-stone-600"
                aria-label="Sample Configuration"
              />

              <p class="text-stone-500 mt-4 dark:text-stone-300">
                <strong>key:</strong> Unique identifier for the section<br>
                <strong>name:</strong> Name of the section<br>
                <strong>status:</strong> Current status of the section<br>
                <strong>children:</strong> Nested sections<br>
                <strong>isCollapsed:</strong>  Optional flag to collapse the section
              </p>

              <TButton
                class="w-full mt-4"
                aria-label="Load Sample Data"
                :is-active="false"
                @click="loadConfigFromUserInput"
              >
                <svg
                  class="w-5 h-5 mr-2"
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
                    d="M5 12V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4m5-13v4a1 1 0 0 1-1 1H5m0 6h9m0 0-2-2m2 2-2 2"
                  />
                </svg>

                Load Config
              </TButton>
            </div>

            <ClientOnly>
              <NuxtSnackbar
                bottom
                right
                shadow
                success="#34d399"
                error="#f87171"
                info="#3b82f6"
              />
            </ClientOnly>

            <AppFooter />
          </div>
        </section>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.background-grid {
  height: 100%;
  width: 100%;
}

.animate-bounce {
  animation: bounce 1.5s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15%);
  }
}

.section {
  opacity: 0;
  transition: opacity 0.6s ease-in-out;
}

.section.show {
  opacity: 1;
}
</style>
