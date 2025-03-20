<script setup lang="ts">
import NText from '@/components/base/n-text.vue'
import { useSlots, computed, type VNode } from 'vue'
import { format } from 'date-fns'
import { Calendar1Icon, ClockIcon } from 'lucide-vue-next'

const slots = useSlots()

// Extract date from slot content
const rawDate = computed(() => {
  const slotContent = slots.default?.()[0]
  return getSlotValue(slotContent)
})

// Format date in two ways using date-fns
const day = computed(() => {
  if (!rawDate.value) return '-'
  return format(rawDate.value, 'dd') // e.g., "Mar 8, 2025"
})

// Format date in two ways using date-fns
const month = computed(() => {
  if (!rawDate.value) return '-'
  return format(rawDate.value, 'MM') // e.g., "Mar 8, 2025"
})

const hours = computed(() => {
  if (!rawDate.value) return '-'
  return format(rawDate.value, 'HH:mm') // e.g., "Saturday, March 8, 2025"
})

// Helper function to extract date from VNode
function getSlotValue(vnode?: VNode): Date | null {
  if (!vnode) return null

  if (typeof vnode.children === 'string') {
    const date = new Date(vnode.children)
    return isNaN(date.getTime()) ? null : date
  }

  if (Array.isArray(vnode.children) && vnode.children.length > 0) {
    const firstChild = vnode.children[0]
    if (typeof firstChild === 'string') {
      const date = new Date(firstChild)
      return isNaN(date.getTime()) ? null : date
    }
  }

  return null
}
</script>

<template>
  <div class="flex gap-2">
    <NText size="sm" class="flex w-4 items-center md:w-16">
      <Calendar1Icon class="mr-2 hidden size-4 shrink-0 md:block" />
      {{ day }}
      <span class="hidden md:block">.{{ month }}</span>
    </NText>
    <NText size="sm" class="hidden w-16 items-center gap-2 md:flex">
      <ClockIcon class="size-4 shrink-0" />
      {{ hours }}
    </NText>
  </div>
</template>
