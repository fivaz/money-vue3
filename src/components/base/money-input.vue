<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const props = defineProps<{
  name: string // Optional, defaults to id
  type?: string // Defaults to 'text'
  placeholder?: string
  modelValue: number // For v-model support
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const formattedValue = computed(() => {
  return (props.modelValue / 100).toFixed(2)
})

function onInput(event: Event): void {
  const input = (event.target as HTMLInputElement)?.value
  // Remove all non-numeric characters
  const numericInput = input.replace(/\D/g, '')

  // Convert to integer and handle empty input case
  const value = numericInput ? parseInt(numericInput) : 0

  // Emit the value in cents
  emit('update:modelValue', value)
}
</script>

<template>
  <div>
    <label :for="name" class="block text-sm/6 font-medium text-gray-900 dark:text-white">
      {{ name }}
    </label>
    <div class="mt-2">
      <input
        :id="name"
        type="number"
        :name="name"
        autocomplete="off"
        @input="onInput"
        :value="formattedValue"
        :placeholder="placeholder"
        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
      />
    </div>
  </div>
</template>
