<script setup lang="ts">
import { computed, useSlots, type VNode } from 'vue'

const props = defineProps<{
  sign?: boolean
}>()

// Set default value for noSign
const sign = computed(() => props.sign ?? false)

const slots = useSlots()

// Extract date from slot content
const rawValue = computed(() => {
  const slotContent = slots.default?.()[0]
  return getSlotValue(slotContent)
})

// Compute the formatted value
const formattedValue = computed(() => {
  return formatToDollars(rawValue.value)
})

// Helper function to extract value from VNode
function getSlotValue(vnode?: VNode): number {
  if (!vnode) return 0

  if (typeof vnode.children === 'string') {
    return Number(vnode.children) || 0
  }

  if (Array.isArray(vnode.children) && vnode.children.length > 0) {
    const firstChild = vnode.children[0]
    return typeof firstChild === 'string' ? Number(firstChild) || 0 : 0
  }

  return 0
}

// Formatting function with Swiss locale but $ symbol
function formatToDollars(cents: number): string {
  if (isNaN(cents)) {
    console.error('balance is NaN')
    return '$0.00'
  }

  // Use Swiss German locale (fr-CH) as base
  const formatter = new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF', // We use CHF as base currency, then replace symbol
  })

  // Format the number (convert cents to francs/dollars)
  const formatted = formatter.format(cents / 100)

  // Replace CHF with $ and add + for positive values
  const dollarFormatted = formatted.replace('CHF', '$')
  return cents > 0 && sign.value ? `+${dollarFormatted}` : dollarFormatted
}
</script>

<template>
  <span>{{ formattedValue }}</span>
</template>
