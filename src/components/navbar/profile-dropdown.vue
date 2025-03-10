<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import NLogo from '@/components/navbar/n-logo.vue'

type NavigationItem = { name: string; path?: string; onClick?: () => void }

defineProps<{
  user: { name: string; email: string; imageUrl: string | null }
  userNavigation: NavigationItem[]
}>()

function handleItemClick(item: NavigationItem) {
  if (item.onClick) {
    item.onClick()
  }
}
</script>

<template>
  <Menu as="div" class="relative ml-3">
    <div>
      <MenuButton
        class="relative flex rounded-full bg-white text-sm focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-800 dark:focus:ring-offset-gray-800"
      >
        <span class="absolute -inset-1.5" />
        <span class="sr-only">Open user menu</span>
        <img v-if="user.imageUrl" class="size-8 rounded-full" :src="user.imageUrl" alt="" />
        <div v-else class="size-9 rounded-full border-2 border-gray-500 p-1">
          <n-logo class="size-6" />
        </div>
      </MenuButton>
    </div>
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 dark:ring-white/10"
      >
        <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
          <a
            v-if="item.path"
            :href="item.path"
            :class="[
              active ? 'bg-gray-100 outline-none dark:bg-gray-700' : '',
              'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200',
            ]"
          >
            {{ item.name }}
          </a>
          <button
            v-else-if="item.onClick"
            @click="handleItemClick(item)"
            :class="[
              active ? 'bg-gray-100 outline-none dark:bg-gray-700' : '',
              'block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200',
            ]"
          >
            {{ item.name }}
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>
