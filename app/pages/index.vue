<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useStore } from '~/composables/store'

const sectionStore = useStore()
const isLoading = ref<boolean>(true)
const sections = computed(() => sectionStore.sections)
const router = useRouter()

const loadConfigFromApi = async (model: string) => {
  isLoading.value = true
  await sectionStore.fetchSections(model)
  isLoading.value = false
  router.push('/panel')
}

onMounted(() => {
  if (sections.value.length) {
    isLoading.value = false
  }
  else {
    isLoading.value = false
  }
})
</script>

<template>
  <div
    v-if="!isLoading"
    class="flex flex-col justify-center items-center h-screen space-y-4 mx-10"
  >
    <h1 class="text-3xl font-semibold text-center text-neutral-100 p-4">
      Welcome to TrackerMap! 🎉
    </h1>
    <h2 class="text-lg text-center text-neutral-300 p-4">
      It looks like you haven't loaded any configuration yet. Click one of the buttons below to load sample data and see TrackerMap in action!
    </h2>
    <div class="flex space-x-4">
      <button
        class="bg-neutral-900 font-semibold text-white px-4 py-2 rounded transition duration-300 hover:bg-neutral-800"
        aria-label="Load Project Migration Data"
        @click="loadConfigFromApi('project-migration')"
      >
        Load Project Migration Data
      </button>
      <button
        class="bg-neutral-900 font-semibold text-white px-4 py-2 rounded transition duration-300 hover:bg-neutral-800"
        aria-label="Load Bug Tracking Data"
        @click="loadConfigFromApi('bug-tracking')"
      >
        Load Bug Tracking Data
      </button>
      <button
        class="bg-neutral-900 font-semibold text-white px-4 py-2 rounded transition duration-300 hover:bg-neutral-800"
        aria-label="Load Recruitment Data"
        @click="loadConfigFromApi('recruitment')"
      >
        Load Recruitment Data
      </button>
    </div>
  </div>
</template>
