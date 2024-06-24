<script setup lang="ts">
import { useUpload } from '~/composables/upload'
import { useStore } from '~/composables/store'

const store = useStore()

const { fileInput, loadSectionsFromFile, saveSectionsToFile } = useUpload()
</script>

<template>
  <input
    ref="fileInput"
    type="file"
    accept=".json"
    class="hidden"
    @change="loadSectionsFromFile"
  >
  <div class="flex items-center justify-between space-x-2 mb-3">
    <button
      class="flex-1 font-semibold border-2 border-neutral-600 text-white px-2 py-1 rounded-md transition duration-300 bg-neutral-900 hover:bg-neutral-600"
      @click="($refs.fileInput as HTMLInputElement).click()"
    >
      upload
    </button>

    <button
      class="flex-1 font-semibold border-2 border-neutral-600 text-white px-2 py-1 disabled:cursor-not-allowed rounded-md transition duration-300 bg-neutral-900 hover:bg-neutral-600"
      :disabled="!store.configLoaded"
      @click="saveSectionsToFile"
    >
      save
    </button>
  </div>
</template>
