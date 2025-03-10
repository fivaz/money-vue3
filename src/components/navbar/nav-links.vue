<script setup lang="ts">
import { DisclosureButton } from '@headlessui/vue'
import { useRoute, RouterLink } from 'vue-router'
import { navLinks, ROUTES } from '@/lib/const.ts'

defineProps<{
  mobile?: boolean
}>()

const route = useRoute()

function isCurrent(itemHref: string): boolean {
  return route.path === itemHref || (itemHref === '/' && route.path === '')
}
</script>

<template>
  <div
    :class="{
      'hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8': !mobile,
      'space-y-1 pt-2 pb-3': mobile,
    }"
  >
    <DisclosureButton
      :as="RouterLink"
      v-for="navLink in navLinks"
      :key="navLink.name"
      :to="navLink.path"
      :aria-current="isCurrent(navLink.path) ? 'page' : undefined"
      :class="[
        isCurrent(navLink.path)
          ? 'border-yellow-500 text-gray-900 dark:border-yellow-400 dark:text-white'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200',
        mobile
          ? 'block border-l-4 bg-white py-2 pr-4 pl-3 text-base font-medium dark:bg-gray-800'
          : 'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium',
      ]"
    >
      {{ navLink.name }}
    </DisclosureButton>
  </div>
</template>
