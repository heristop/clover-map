<script setup lang="ts">
import { computed } from 'vue'
import TreeMap from '~/components/TreeMap.vue'
import { useStore } from '~/composables/store'

const sectionStore = useStore()
const isConfigLoaded = computed(() => sectionStore.configLoaded)
const router = useRouter()

onMounted(() => {
  if (!isConfigLoaded.value) {
    router.push('/')
  }
})
</script>

<template>
  <TreeMap
    v-show="isConfigLoaded"
    class="tree-map"
  />
</template>
