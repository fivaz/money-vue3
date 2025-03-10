<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string // Optional, defaults to id
  rows?: number // Number of visible text lines, defaults to 4
  cols?: number // Number of visible text columns, defaults to 20
  placeholder?: string
  modelValue: string | number // For v-model support
}>()

defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

// Compute rows and cols with defaults if not provided
const textareaRows = computed(() => props.rows || 4)
const textareaCols = computed(() => props.cols || 20)
</script>

<template>
  <div>
    <label :for="name" class="block text-sm/6 font-medium text-gray-900 dark:text-white">
      {{ name }}
    </label>
    <div class="mt-2">
      <textarea
        :id="name"
        :name="name"
        :rows="textareaRows"
        :cols="textareaCols"
        :value="modelValue"
        :placeholder="placeholder"
        class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement)?.value)"
      ></textarea>
    </div>
  </div>
</template>
