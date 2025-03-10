<script setup lang="ts">
import { DisclosureButton } from '@headlessui/vue'
import { computed } from 'vue'
import DarkMode from './dark-mode.vue'
import NLogo from '@/components/navbar/n-logo.vue'

type NavigationItem = { name: string; href?: string; onClick?: () => void }

const props = defineProps<{
  user: { name: string; email: string; imageUrl: string | null }
  userNavigation: NavigationItem[]
}>()

const navigationItems = computed(() => {
  return props.userNavigation.map((item) => ({
    ...item,
    isLink: !!item.href,
    isButton: !!item.onClick,
  }))
})

function handleItemClick(item: NavigationItem) {
  if (item.onClick) {
    item.onClick()
  }
}
</script>

<template>
  <div class="border-t border-gray-200 pt-4 pb-3 dark:border-gray-700">
    <div class="flex items-center px-4">
      <div class="shrink-0">
        <img v-if="user.imageUrl" class="size-10 rounded-full" :src="user.imageUrl" alt="" />
        <n-logo class="size-8" v-else />
      </div>
      <div class="ml-3">
        <div class="text-base font-medium text-gray-800 dark:text-gray-200">{{ user.name }}</div>
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ user.email }}</div>
      </div>
      <DarkMode class="ml-auto shrink-0" />
    </div>
    <div class="mt-3 space-y-1">
      <DisclosureButton
        v-for="item in navigationItems"
        :key="item.name"
        :as="item.isLink ? 'a' : 'button'"
        :href="item.isLink ? item.href : undefined"
        @click="item.isButton ? handleItemClick(item) : null"
        class="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
        :class="{ 'w-full text-left': item.isButton }"
      >
        {{ item.name }}
      </DisclosureButton>
    </div>
  </div>
</template>
