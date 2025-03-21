<!--n-input-->
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name?: string // Optional, defaults to id
  type?: string // Defaults to 'text'
  placeholder?: string
  modelValue: string | number // For v-model support
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const inputType = computed(() => props.type || 'text')
const idName = computed(() => props.name || Math.random().toString())

// Format ISO date to 'YYYY-MM-DDTHH:MM' for datetime-local inputs
const formattedValue = computed(() => {
  if (inputType.value === 'datetime-local' && typeof props.modelValue === 'string') {
    const date = new Date(props.modelValue)
    if (!isNaN(date.getTime())) {
      return date.toISOString().slice(0, 16) // Convert to 'YYYY-MM-DDTHH:MM'
    }
  }
  return props.modelValue
})

// Handle input updates correctly
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value

  // Convert back to full ISO string when it's a datetime-local input
  if (inputType.value === 'datetime-local') {
    value = new Date(value).toISOString()
  }

  emit('update:modelValue', value)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="name"
      :for="idName"
      class="block text-sm/6 font-medium text-gray-900 dark:text-white"
    >
      {{ name }}
    </label>
    <div>
      <input
        :id="idName"
        :type="inputType"
        :name="idName"
        autocomplete="off"
        :value="formattedValue"
        :placeholder="placeholder"
        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 scheme-light outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:scheme-dark dark:outline-white/10 dark:placeholder:text-gray-500"
        @input="handleInput"
      />
    </div>
  </div>
</template>
