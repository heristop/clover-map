<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  value: string
  isEditing: boolean
  isEditMode: boolean
}>()

const emit = defineEmits<{
  (e: 'update:value', value: string): void
  (e: 'update:isEditing', value: boolean): void
  (e: 'double-click'): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref(props.value)

watch(() => props.isEditing, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      inputRef.value?.focus()
      inputRef.value?.select()
    })
  }
})

watch(() => props.value, (newValue) => {
  inputValue.value = newValue
})

const finishEditing = () => {
  emit('update:value', inputValue.value)
  emit('update:isEditing', false)
}

const cancelEditing = () => {
  inputValue.value = props.value
  emit('update:isEditing', false)
}

const handleDoubleClick = (event: MouseEvent) => {
  if (!props.isEditMode) {
    event.stopPropagation()
    emit('double-click')
  }
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
    @keyup.esc="cancelEditing"
  >
  <span
    v-else
    class="node-text cursor-text"
    @dblclick="handleDoubleClick"
  >
    {{ value }}
  </span>
</template>
