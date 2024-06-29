<script setup lang="ts">
import TButton from './ui/TButton.vue'
import { useConfig } from '~/composables/config'
import { useStore } from '~/composables/store'

const store = useStore()

const { fileInput, loadFromFile, saveToFile } = useConfig()
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
      @click="($refs.fileInput as HTMLInputElement).click()"
    >
      Upload
    </TButton>

    <TButton
      size="sm"
      class="w-full py-1"
      :disabled="!store.configLoaded"
      @click="saveToFile"
    >
      Save
    </TButton>
  </div>
</template>
