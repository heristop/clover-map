<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfig } from '~/composables/config'
import AppFooter from '~/components/AppFooter.vue'
import TButton from '~/components/ui/TButton.vue'

const store = useStore()
const isLoading = ref<boolean>(true)
const isConfigLoaded = computed(() => store.configLoaded)
const router = useRouter()

const { fileInput, loadFromModel, loadFromFile, loadFromUrl, loadFromUserInput } = useConfig()

const url = ref('https://tracker-map.nuxt.dev/configs/project-migration.json')
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

onMounted(() => {
  if (isConfigLoaded.value) {
    router.push('/viewport')
  }

  nextTick(() => {
    isLoading.value = false
  })
})
</script>

<template>
  <div class="relative w-full min-h-screen overflow-auto">
    <div class="background-grid fixed inset-0 z-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <div class="bg-purple-300 rounded-lg opacity-30" />
      <div class="bg-yellow-300 rounded-lg opacity-30" />
      <div class="bg-blue-300 rounded-lg opacity-30" />
      <div class="bg-pink-300 rounded-lg col-span-2 opacity-30" />
      <div class="bg-green-300 rounded-lg opacity-30" />
      <div class="bg-red-300 rounded-lg opacity-30" />
      <div class="bg-indigo-300 rounded-lg opacity-30" />
      <div class="bg-teal-300 rounded-lg opacity-30" />
      <div class="bg-orange-300 rounded-lg opacity-30" />
      <div class="bg-lime-300 rounded-lg opacity-30" />
    </div>

    <div class="absolute h-full inset-0 z-10 bg-neutral-600 opacity-90" />

    <div
      v-if="!isLoading"
      class="relative z-20 flex flex-col justify-center items-center min-h-screen p-6 max-w-6xl mx-auto"
    >
      <transition
        name="fade"
        appear
      >
        <div class="text-center text-neutral-100 space-y-6">
          <h1 class="text-3xl font-semibold">
            Welcome to TrackerMap!
          </h1>
          <h2 class="text-lg text-neutral-300 max-w-3xl mx-auto">
            It looks like you haven't loaded any configuration yet. Click one of the buttons below to load sample data and see TrackerMap in action!
          </h2>
          <div class="mt-8 animate-bounce">
            <svg
              class="w-6 h-6 text-neutral-300 mx-auto"
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
        </div>
      </transition>
    </div>

    <div
      v-if="!isLoading"
      class="relative z-20 flex flex-col justify-center items-center min-h-60 space-y-8 p-6 max-w-6xl mx-auto"
    >
      <h3
        v-if="!isLoading"
        class="text-md font-bold"
      >
        Load Sample Data
      </h3>

      <div
        v-if="!isLoading"
        class="flex flex-col w-full md:w-fit md:flex-row md:space-x-4 text-center space-y-6 md:space-y-0"
      >
        <TButton
          class="bg-neutral-900 px-6 py-2 min-w-fit hover:bg-neutral-800 text-sm"
          aria-label="Load Project Migration Data"
          :is-active="false"
          @click="loadConfigFromApi('project-migration')"
        >
          project migration
        </TButton>

        <TButton
          class="bg-neutral-900 px-6 py-2 min-w-fit hover:bg-neutral-800 text-sm"
          aria-label="Load Bug Tracking Data"
          :is-active="false"
          @click="loadConfigFromApi('bug-tracking')"
        >
          bug tracking
        </TButton>

        <TButton
          class="bg-neutral-900 px-6 py-2 min-w-fit hover:bg-neutral-800 text-sm"
          aria-label="Load Recruitment Data"
          :is-active="false"
          @click="loadConfigFromApi('recruitment')"
        >
          recruitment
        </TButton>
      </div>
    </div>

    <div class="relative z-20 flex flex-col justify-center items-center min-h-60 space-y-8 p-6 max-w-6xl mx-auto">
      <h3
        v-if="!isLoading"
        class="text-md font-bold"
      >
        Load Configuration
      </h3>

      <input
        ref="fileInput"
        type="file"
        accept=".json"
        class="hidden"
        @change="loadFromFile"
      >

      <div
        v-if="!isLoading"
        class="flex flex-col w-full md:w-fit md:flex-row md:space-x-4 space-y-6 md:space-y-0"
      >
        <TButton
          class="bg-neutral-900 px-6 py-2 min-w-fit hover:bg-neutral-800 text-sm"
          aria-label="Load Project Migration Data"
          :is-active="false"
          @click="($refs.fileInput as HTMLInputElement).click()"
        >
          upload file
        </TButton>
      </div>

      <div
        v-if="!isLoading"
        class="flex flex-col w-full md:w-2/3 md:flex-row md:space-x-4 space-y-6 md:space-y-0"
      >
        <input
          v-model="url"
          placeholder="https://"
          class="bg-neutral-700 text-white px-4 py-2 rounded-md text-sm w-full md:w-2/3"
        >

        <TButton
          class="bg-neutral-900 px-6 py-2 w-full md:w-1/3 hover:bg-neutral-800 text-sm disabled:cursor-not-allowed"
          aria-label="Load Configuration from URL"
          :is-active="false"
          :disabled="!url"
          @click="loadConfigFromUrl(url)"
        >
          load from url
        </TButton>
      </div>
    </div>

    <div class="relative z-20 flex flex-col justify-center items-center min-h-60 space-y-8 p-6 max-w-6xl mx-auto">
      <h3
        v-if="!isLoading"
        class="text-md font-bold"
      >
        Load Custom Configuration
      </h3>

      <div
        v-if="!isLoading"
        class="bg-neutral-700 text-white p-4 rounded-md text-sm max-w-3xl"
      >
        <textarea
          v-model="sample"
          class="w-full h-60 bg-neutral-700 text-sm p-2"
        />

        <p class="text-neutral-300 mt-4">
          <strong>key:</strong> Unique identifier for the section or task<br>
          <strong>name:</strong> Name of the section or task<br>
          <strong>status:</strong> Current status of the section or task<br>
          <strong>children:</strong> Nested sections or tasks
        </p>

        <TButton
          class="bg-neutral-900 px-6 py-2 min-w-fit hover:bg-neutral-800 text-sm mt-4"
          aria-label="Load Sample Data"
          :is-active="false"
          @click="loadConfigFromUserInput"
        >
          load config
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
</style>
