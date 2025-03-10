<script setup lang="ts">
import { DisclosureButton } from '@headlessui/vue'
import { MenuIcon, XIcon } from 'lucide-vue-next'

defineProps<{ open: boolean }>()
</script>

<template>
  <DisclosureButton
    class="relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
  >
    <span class="absolute -inset-0.5" />
    <span class="sr-only">Open main menu</span>
    <MenuIcon v-if="!open" class="block size-6" aria-hidden="true" />
    <XIcon v-else class="block size-6" aria-hidden="true" />
  </DisclosureButton>
</template>
