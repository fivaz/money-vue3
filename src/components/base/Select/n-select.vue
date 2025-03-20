<script setup lang="ts">
import { Listbox, ListboxButton, ListboxLabel, ListboxOptions } from '@headlessui/vue'
import { ChevronsUpDownIcon } from 'lucide-vue-next'
import { provide, ref, watch } from 'vue'

const props = defineProps<{
  name: string
  modelValue: string | number | boolean | object | null | undefined // Selected value for v-model
}>()

// Define emits for v-model support
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean | object | null | undefined): void
}>()

// Provide the selected value to children (SelectItem components)
const selectedValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue
  },
  { immediate: true }, // Run immediately on mount to ensure initial syn
)

watch(selectedValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<template>
  <Listbox as="div" v-model="selectedValue" class="relative" v-bind="$attrs">
    <ListboxLabel class="block text-sm/6 font-medium text-gray-900 dark:text-white">
      {{ name }}
    </ListboxLabel>
    <div class="relative mt-2">
      <ListboxButton
        class="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10"
      >
        <span class="col-start-1 row-start-1 truncate pr-6">
          <slot name="placeholder">
            {{ modelValue }}
          </slot>
        </span>
        <ChevronsUpDownIcon
          class="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
          aria-hidden="true"
        />
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm dark:bg-gray-800 dark:text-white dark:scheme-dark dark:ring-white/10"
        >
          <slot />
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
