<script setup lang="ts">
import { TriangleAlertIcon, XIcon } from 'lucide-vue-next'
import type { Transaction } from '@/components/transactions/service.ts'

defineProps<{
  modelValue: string
}>()

// Define emits with TypeScript
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Function to clear the text
const clearText = () => {
  emit('update:modelValue', '') // Emit event to update the parent
}
</script>

<template>
  <transition
    enter-active-class="transition duration-100 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-75 ease-out"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div v-if="modelValue" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="shrink-0">
          <TriangleAlertIcon class="size-5 text-red-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-red-800">{{ modelValue }}</p>
        </div>
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button
              type="button"
              class="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50 focus:outline-hidden"
              @click="clearText"
            >
              <span class="sr-only">Dismiss</span>
              <XIcon class="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
