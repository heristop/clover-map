<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps<{
  value: string
  isEditing: boolean
}>()

const emit = defineEmits<{
  (e: 'update:value', value: string): void
  (e: 'update:isEditing', value: boolean): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref(props.value)

onMounted(() => {
  if (props.isEditing) {
    nextTick(() => {
      inputRef.value?.focus()
      inputRef.value?.select()
    })
  }
})

const finishEditing = () => {
  emit('update:value', inputValue.value)
  emit('update:isEditing', false)
}
</script>

<template>
  <input
    v-if="isEditing"
    ref="inputRef"
    v-model="inputValue"
    class="edit-input"
    @blur="finishEditing"
    @keyup.enter="finishEditing"
    @keyup.esc="finishEditing"
  >
  <span
    v-else
    class="node-text cursor-text"
    @click="$emit('update:isEditing', true)"
  >
    {{ value }}
  </span>
</template>

<style scoped>
.edit-input {
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-bottom: 1px solid white;
  color: white;
  outline: none;
  transition: all 0.3s;
  padding: 2px 4px;
  border-radius: 2px;
}

.edit-input:focus {
  background: rgba(255, 255, 255, 0.2);
  border-bottom: 2px solid white;
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.node-text {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
