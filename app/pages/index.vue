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

const url = ref(`${useRuntimeConfig().public.apiBaseUrl}/configs/project-migration.json`)
const sample = ref(`[
  {
    "key": "project1",
    "name": "Project 1",
    "children": [
      {
        "key": "task1",
        "name": "Task 1",
        "status": "In Progress",
        "children": []
      },
      {
        "key": "task2",
        "name": "Task 2",
        "status": "Done",
        "children": []
      }
    ]
  },
  {
    "key": "project2",
    "name": "Project 2",
    "children": []
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
    class="relative w-full min-h-screen overflow-auto bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50"
  >
    <button
      class="fixed top-4 right-4 p-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded z-50"
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

    <div class="absolute h-full inset-0 z-10 bg-neutral-300 dark:bg-neutral-900 opacity-80 dark:opacity-90" />

    <div
      v-if="!isLoading"
      class="relative z-20 flex flex-col justify-center items-center h-screen p-6 max-w-6xl mx-auto section show"
    >
      <transition
        name="fade"
        appear
      >
        <section class="text-center space-y-6">
          <h1 class="text-4xl font-semibold drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-blue-400 to-green-500 dark:from-red-300 dark:via-blue-300 dark:to-green-300">
            Welcome to TreePulse!
          </h1>

          <h2 class="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            It looks like you haven't loaded any configuration yet. Click one of the buttons below to load sample data and see TreePulse in action!
          </h2>

          <div class="mt-8 animate-bounce">
            <svg
              class="w-6 h-6 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
            <h3 class="text-md font-bold">
              Load Sample Data
            </h3>

            <div class="flex flex-col w-full md:w-fit md:flex-row md:space-x-4 text-center space-y-6 md:space-y-0">
              <TButton
                class="bg-neutral-900 dark:bg-neutral-200 px-6 py-2 min-w-fit hover:bg-neutral-800 dark:hover:bg-neutral-300 text-sm dark:text-black"
                aria-label="Load Project Migration Data"
                :is-active="false"
                @click="loadConfigFromApi('project-migration')"
              >
                Project Migration
              </TButton>
              <TButton
                class="bg-neutral-900 dark:bg-neutral-200 px-6 py-2 min-w-fit hover:bg-neutral-800 dark:hover:bg-neutral-300 text-sm dark:text-black"
                aria-label="Load Bug Tracking Data"
                :is-active="false"
                @click="loadConfigFromApi('bug-tracking')"
              >
                Bug Tracking
              </TButton>
              <TButton
                class="bg-neutral-900 dark:bg-neutral-200 px-6 py-2 min-w-fit hover:bg-neutral-800 dark:hover:bg-neutral-300 text-sm dark:text-black"
                aria-label="Load Recruitment Data"
                :is-active="false"
                @click="loadConfigFromApi('recruitment')"
              >
                Recruitment
              </TButton>
            </div>
          </div>

          <div class="relative z-20 flex flex-col justify-center items-center min-h-60 space-y-8 p-6 max-w-6xl mx-auto">
            <h3 class="text-md font-bold">
              Load Configuration
            </h3>

            <input
              ref="fileInput"
              type="file"
              accept=".json"
              class="hidden"
              @change="loadFromFile"
            >

            <div class="flex flex-col w-full md:w-fit md:flex-row md:space-x-4 space-y-6 md:space-y-0">
              <TButton
                class="bg-neutral-900 dark:bg-neutral-200 px-6 py-2 min-w-fit hover:bg-neutral-800 dark:hover:bg-neutral-300 text-sm dark:text-black"
                aria-label="Load Project Migration Data"
                :is-active="false"
                @click="($refs.fileInput as HTMLInputElement).click()"
              >
                Upload File
              </TButton>
            </div>

            <div class="flex flex-col w-full md:w-2/3 md:flex-row md:space-x-4 space-y-6 md:space-y-0">
              <input
                v-model="url"
                placeholder="https://"
                class="bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-white px-4 py-2 rounded-md text-sm w-full md:w-2/3"
              >
              <TButton
                class="bg-neutral-900 dark:bg-neutral-200 px-6 py-2 w-full md:w-1/3 hover:bg-neutral-800 dark:hover:bg-neutral-300 text-sm dark:text-black disabled:cursor-not-allowed"
                aria-label="Load Configuration from URL"
                :is-active="false"
                :disabled="!url"
                @click="loadConfigFromUrl(url)"
              >
                Load from URL
              </TButton>
            </div>
          </div>

          <div class="relative z-20 flex flex-col justify-center items-center min-h-60 space-y-8 p-6 max-w-6xl mx-auto">
            <h3 class="text-md font-bold">
              Load Custom Configuration
            </h3>

            <div class="bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-white p-4 rounded-md text-sm max-w-3xl">
              <textarea
                v-model="sample"
                class="w-full h-60 bg-neutral-200 text-sm p-2 dark:bg-neutral-700 dark:text-white"
              />

              <p class="text-neutral-600 mt-4 dark:text-neutral-300">
                <strong>key:</strong> Unique identifier for the section or task<br>
                <strong>name:</strong> Name of the section or task<br>
                <strong>status:</strong> Current status of the section or task<br>
                <strong>children:</strong> Nested sections or tasks
              </p>

              <TButton
                class="bg-neutral-900 dark:bg-neutral-200 px-6 py-2 min-w-fit hover:bg-neutral-800 dark:hover:bg-neutral-300 text-sm mt-4 dark:text-black"
                aria-label="Load Sample Data"
                :is-active="false"
                @click="loadConfigFromUserInput"
              >
                Load Config
              </TButton>
            </div>

            <NuxtSnackbar
              bottom
              right
              shadow
              success="#34d399"
              error="#f87171"
              info="#3b82f6"
            />

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
