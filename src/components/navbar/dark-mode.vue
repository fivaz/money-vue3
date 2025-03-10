<script setup lang="ts">
import { MoonIcon, SunIcon } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'
import { Switch } from '@headlessui/vue'

const isDark = ref(false)

function getDarkMode() {
  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  return (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  // Whenever the user explicitly chooses light mode
  // localStorage.theme = 'light'

  // Whenever the user explicitly chooses dark mode
  // localStorage.theme = 'dark'

  // Whenever the user explicitly chooses to respect the OS preference
  // localStorage.removeItem('theme')
}

// Watch for changes in isDark and update localStorage + class
watch(isDark, (newValue) => {
  localStorage.theme = newValue ? 'dark' : 'light'
  document.documentElement.classList.toggle('dark', newValue)
})

onMounted(() => {
  isDark.value = getDarkMode()
  document.documentElement.classList.toggle('dark', isDark.value) // Apply theme on mount
})
</script>

<template>
  <Switch
    v-model="isDark"
    class="relative inline-flex h-8 w-14 items-center rounded-full ring-2 ring-gray-500 transition-colors outline-none dark:focus:ring-white"
  >
    <span class="sr-only">Toggle Dark Mode</span>
    <span
      class="absolute left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-all dark:left-7 dark:bg-gray-800"
    >
      <SunIcon v-if="isDark" class="size-5 text-yellow-500" aria-hidden="true" />
      <MoonIcon v-else class="size-5 text-indigo-500" aria-hidden="true" />
    </span>
  </Switch>
</template>
