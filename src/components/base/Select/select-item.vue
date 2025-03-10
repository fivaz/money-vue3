<script setup lang="ts">
import { ListboxOption } from '@headlessui/vue'
import { CheckIcon } from 'lucide-vue-next'
import type { SelectType } from '@/lib/const.ts'

defineProps<{
  value: SelectType
}>()
</script>

<template>
  <ListboxOption as="template" :value="value" v-slot="{ active, selected }">
    <li
      :class="[
        active ? 'bg-yellow-600 text-white outline-hidden' : 'text-gray-900 dark:text-white',
        'relative flex cursor-default items-center gap-2 py-2 pr-9 pl-3 select-none',
      ]"
    >
      <!-- Use slot for custom content -->
      <slot />

      <span
        v-if="selected"
        :class="[
          active ? 'text-white' : 'text-yellow-600 dark:text-yellow-400',
          'absolute inset-y-0 right-0 flex items-center pr-3',
        ]"
      >
        <CheckIcon class="size-5" aria-hidden="true" />
      </span>
    </li>
  </ListboxOption>
</template>
