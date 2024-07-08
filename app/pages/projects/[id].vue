<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from '~/composables/store'
import TreeMap from '~/components/TreeMap.vue'
import { useConfig } from '~/composables/config'

const route = useRoute()
const store = useStore()
const { loadProjectConfig } = useConfig()

onMounted(() => {
  if (store.darkMode) {
    document.documentElement.classList.add('dark')
  }

  const id = route.query.id

  if (id) {
    loadProjectConfig(id)
  }
})
</script>

<template>
  <div class="h-full">
    <TreeMap />
  </div>
</template>
