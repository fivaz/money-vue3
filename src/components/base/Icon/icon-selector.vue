<script setup lang="ts">
import { computed, ref } from 'vue'
import { iconComponents } from './service'
import NInput from '@/components/base/n-input.vue'
import SearchInput from '@/components/base/search-input.vue'

// Define props with v-model support
defineProps<{
  modelValue: string | null
}>()

// Define emits with v-model update
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

// Search query
const searchQuery = ref<string>('')

// Filtered icons based on search
const filteredIcons = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return Object.keys(iconComponents)
  return Object.keys(iconComponents).filter((name) => name.toLowerCase().includes(query))
})

// Handle icon selection
const selectIcon = (name: string) => {
  emit('update:modelValue', name)
  searchQuery.value = ''
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Search Bar -->
    <search-input v-model="searchQuery" name="Search icons" placeholder="Search icons..." />

    <!-- Icon List -->
    <div
      class="grid h-[136px] grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] gap-2.5 overflow-auto rounded-md border border-gray-300 p-2 dark:border-gray-600"
    >
      <div
        v-for="iconName in filteredIcons"
        :key="iconName"
        :class="[
          'flex size-8 cursor-pointer flex-col items-center rounded-md border p-1',
          modelValue === iconName
            ? 'border-yellow-600 text-yellow-500'
            : 'border-gray-300 text-gray-600 dark:border-gray-300 dark:text-gray-300',
        ]"
        @click="selectIcon(iconName)"
      >
        <span class="flex flex-col items-center gap-2">
          <component :is="iconComponents[iconName]" />
        </span>
      </div>
    </div>
  </div>
</template>
