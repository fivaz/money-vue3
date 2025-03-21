<script setup lang="ts">
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
import { ArrowLeftFromLineIcon, ArrowLeftRightIcon, ArrowRightToLineIcon } from 'lucide-vue-next'

const operationsObject = [
  { icon: ArrowLeftFromLineIcon, value: 'expense' },
  { icon: ArrowLeftRightIcon, value: 'transfer' },
  { icon: ArrowRightToLineIcon, value: 'income' },
]

defineProps<{
  modelValue: string // v-model binding value
}>()

// Define emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function updateValue(value: string) {
  emit('update:modelValue', value)
}
</script>

<template>
  <RadioGroup
    class="grid grid-cols-3 gap-x-1 rounded-full p-1 text-center text-xs leading-5 font-semibold ring-1 ring-gray-200 ring-inset"
    :model-value="modelValue"
    @update:model-value="updateValue"
  >
    <RadioGroupOption
      :key="operationObject.value"
      :value="operationObject.value"
      as="template"
      v-for="operationObject in operationsObject"
      v-slot="{ checked }"
    >
      <div
        :class="[
          checked
            ? 'bg-yellow-500 text-white dark:bg-yellow-600 dark:text-yellow-50'
            : 'text-gray-600 dark:text-gray-300',
          'flex cursor-pointer items-center justify-center gap-1 rounded-full px-2.5 py-1',
        ]"
      >
        <component :is="operationObject.icon" class="h-4 w-4" />
        <span>{{ operationObject.value }}</span>
      </div>
    </RadioGroupOption>
  </RadioGroup>
</template>
