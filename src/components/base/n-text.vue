<script setup lang="ts">
// Define the type for allowed sizes
import { computed } from 'vue'

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

const props = defineProps<{
  size?: TextSize
  class?: string
  tooltip?: string
}>()

function getSizeClass(size: TextSize | undefined): string {
  const sizeClasses: Record<TextSize, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  }
  return sizeClasses[size || 'base'] || 'text-base'
}

const customClass = computed(() => props.class || '')
</script>

<template>
  <span
    v-if="tooltip"
    v-tooltip="tooltip"
    :class="[getSizeClass(size), 'text-gray-700 dark:text-gray-300', customClass]"
  >
    <slot />
  </span>
  <span v-else :class="[getSizeClass(size), 'text-gray-700 dark:text-gray-300', customClass]">
    <slot />
  </span>
</template>
