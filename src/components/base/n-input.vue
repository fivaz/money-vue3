<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { format, parseISO, formatISO } from 'date-fns'

const props = defineProps<{
  name?: string // Optional, defaults to id
  type?: string // Defaults to 'text'
  placeholder?: string
  modelValue: string | number // For v-model support
  autofocus?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const inputType = computed(() => props.type || 'text')
const idName = computed(() => props.name || Math.random().toString())

const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (props.autofocus && inputRef.value) {
    inputRef.value.focus()
  }
})

// Optional: focus again if autofocus is changed dynamically
watch(
  () => props.autofocus,
  (newVal) => {
    if (newVal && inputRef.value) {
      inputRef.value.focus()
    }
  },
)

// Format ISO date to 'yyyy-MM-ddTHH:mm' for datetime-local inputs
const formattedValue = computed(() => {
  if (inputType.value === 'datetime-local' && typeof props.modelValue === 'string') {
    try {
      const date = parseISO(props.modelValue)
      if (!isNaN(date.getTime())) {
        // Format to datetime-local compatible string while preserving timezone
        return format(date, "yyyy-MM-dd'T'HH:mm")
      }
    } catch (e) {
      console.error('Invalid date format:', e)
    }
  }
  return props.modelValue
})

// Handle input updates
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value

  if (inputType.value === 'datetime-local') {
    try {
      // Parse the datetime-local input and convert to ISO with timezone
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        // Use formatISO to preserve timezone information
        value = formatISO(date)
      }
    } catch (e) {
      console.error('Error parsing date:', e)
    }
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
        ref="inputRef"
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
