<script setup lang="ts">
import { computed, ref } from 'vue'
import { SearchIcon, XIcon } from 'lucide-vue-next'

// Define props
const props = defineProps<{
  placeholder?: string
  modelValue: string // For v-model support
}>()

// Define emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Local reactive value for input
const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Ref for input element to focus after clear
const inputRef = ref<HTMLInputElement | null>(null)

// Clear input and focus
const clearInput = () => {
  emit('update:modelValue', '')
  inputRef.value?.focus()
}

// Check if input has text
const hasText = computed(() => !!inputValue.value.length)
</script>

<template>
  <div class="relative flex items-center">
    <input
      ref="inputRef"
      v-model="inputValue"
      :placeholder="placeholder"
      class="block w-full rounded-md bg-white px-3 py-1.5 pr-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500"
    />
    <button
      type="button"
      class="absolute right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
      :class="{ 'cursor-pointer': hasText }"
      @click="hasText ? clearInput() : null"
    >
      <SearchIcon v-if="!hasText" class="size-5" />
      <XIcon v-if="hasText" class="size-5" />
    </button>
  </div>
</template>
