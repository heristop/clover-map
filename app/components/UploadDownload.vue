<script setup lang="ts">
import { useRouter } from 'vue-router'
import TButton from './ui/TButton.vue'
import { useConfig } from '~/composables/config'
import { useStore } from '~/composables/store'

const store = useStore()
const router = useRouter()

const { fileInput, loadFromFile, exportToFile } = useConfig()

const resetConfiguration = () => {
  store.clear()
  router.push('/')
}
</script>

<template>
  <input
    ref="fileInput"
    type="file"
    accept=".json"
    class="hidden"
    @change="loadFromFile"
  >
  <div class="flex items-center justify-between space-x-2 mb-3">
    <TButton
      size="sm"
      class="w-full py-1"
      aria-label="Upload configuration"
      @click="($refs.fileInput as HTMLInputElement).click()"
    >
      Upload
    </TButton>

    <TButton
      size="sm"
      class="w-full py-1"
      aria-label="Export configuration"
      :disabled="!store.configLoaded"
      @click="exportToFile"
    >
      Export
    </TButton>

    <span class="text-stone-500 dark:text-stone-300 mx-4">|</span>

    <TButton
      size="sm"
      class="w-full py-1"
      :disabled="!store.configLoaded"
      aria-label="Reset configuration"
      @click="resetConfiguration"
    >
      Reset
    </TButton>
  </div>
</template>
