<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUpload } from '~/composables/upload'
import AppFooter from '~/components/AppFooter.vue'
import { useStore } from '~/composables/store'
import TButton from '~/components/ui/TButton.vue'

const store = useStore()
const isLoading = ref<boolean>(true)
const sections = computed(() => store.sections)
const router = useRouter()

const { fileInput, loadSectionsFromFile } = useUpload()

const loadConfigFromApi = async (model: string) => {
  await store.fetchSections(model)
  router.push('/panel')
}

onMounted(() => {
  if (sections.value.length) {
    router.push('/panel')
  }

  nextTick(() => isLoading.value = false)
})
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden bg-neutral-600">
    <div class="absolute inset-0 z-0 grid grid-cols-3 gap-4 p-4">
      <div class="bg-purple-300 rounded-lg opacity-30" />
      <div class="bg-yellow-300 rounded-lg opacity-30" />
      <div class="bg-blue-300 rounded-lg opacity-30" />
      <div class="bg-pink-300 rounded-lg col-span-2 opacity-30" />
      <div class="bg-green-300 rounded-lg opacity-30" />
    </div>

    <div class="absolute inset-0 z-10 bg-neutral-600 opacity-90" />

    <div
      v-if="!isLoading"
      class="relative z-20 flex flex-col justify-center items-center h-screen space-y-8 p-6 max-w-6xl mx-auto"
    >
      <transition name="fade">
        <h1
          v-if="!isLoading"
          class="text-3xl font-semibold text-center text-neutral-100"
        >
          Welcome to TrackerMap! 🎉
        </h1>
      </transition>

      <transition
        name="fade"
        appear
      >
        <h2
          v-if="!isLoading"
          class="text-lg text-center text-neutral-300 max-w-3xl"
        >
          It looks like you haven't loaded any configuration yet. Click one of the buttons below to load sample data and see TrackerMap in action!
        </h2>
      </transition>

      <transition
        name="fade"
        appear
      >
        <h3
          v-if="!isLoading"
          class="text-md font-bold"
        >
          Load Sample Data
        </h3>
      </transition>

      <transition
        name="fade"
        appear
      >
        <div
          v-if="!isLoading"
          class="flex flex-col w-full md:w-fit md:flex-row md:space-x-4 space-y-4 md:space-y-0"
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
      </transition>

      <transition
        name="fade"
        appear
      >
        <h3
          v-if="!isLoading"
          class="text-md font-bold"
        >
          Load JSON Configuration
        </h3>
      </transition>

      <input
        ref="fileInput"
        type="file"
        accept=".json"
        class="hidden"
        @change="loadSectionsFromFile"
      >
      <transition
        name="fade"
        appear
      >
        <div
          v-if="!isLoading"
          class="flex flex-col w-full md:w-fit md:flex-row md:space-x-4 space-y-4 md:space-y-0"
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
      </transition>

      <transition
        name="fade"
        appear
      >
        <AppFooter v-if="!isLoading" />
      </transition>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
