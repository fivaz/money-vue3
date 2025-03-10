<!-- ProgressBar.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import type { Budget } from '@/components/budgets/service.ts'
import type { Transaction } from '@/components/transactions/service.ts'
import NMoney from '@/components/base/n-money.vue'
import { getDate, getDaysInMonth, startOfDay } from 'date-fns'
import NText from '@/components/base/n-text.vue'

// Define props with TypeScript types
const props = defineProps<{
  budget: Budget
  transactions: Transaction[]
}>()

// Get current date information using date-fns
const currentDate = startOfDay(new Date()) // Normalizes to start of day: March 09, 2025 00:00:00
const currentDay = getDate(currentDate) // 9
const daysInMonth = getDaysInMonth(currentDate) // 31 for March 2025

// Calculate day of month percentage
const dayOfMonthPercentage = computed(() => {
  return Math.round((currentDay / daysInMonth) * 100)
})

// Calculate total spent from transactions
const totalSpent = computed(() => {
  return props.transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
})

// Calculate actual percentage (can exceed 100%)
const actualPercentage = computed(() => {
  return Math.round((totalSpent.value / props.budget.value) * 100)
})

// Calculate progress percentage for bar width (capped at 100%)
const progressPercentage = computed(() => {
  return Math.min(actualPercentage.value, 100)
})

// Determine progress bar color based on if budget is exceeded
const progressColor = computed(() => {
  return totalSpent.value > props.budget.value ? 'bg-red-500' : 'bg-yellow-500'
})

// Dynamic classes
const progressBarClass = computed(
  () => `${progressColor.value} h-3 rounded-full transition-all duration-300 ease-in-out relative`,
)

const containerClass = computed(() => `bg-gray-200 h-3 rounded-full w-full`)
</script>

<template>
  <div class="flex items-center gap-2">
    <div :class="containerClass" class="relative">
      <div :class="progressBarClass" :style="{ width: `${progressPercentage}%` }">
        <!-- Percentage inside progress bar when >= 5% -->
        <span
          v-if="progressPercentage >= 5"
          class="absolute inset-0 flex items-center justify-center text-xs font-medium text-stone-600"
        >
          {{ actualPercentage }}%
        </span>
      </div>
      <!-- Dotted line for current day position -->
      <div
        class="absolute top-0 h-full border-l-2 border-dashed border-red-400"
        :style="{ left: `${dayOfMonthPercentage}%` }"
      />
      <!-- Percentage inside container when < 5% -->
      <span
        v-if="progressPercentage < 5"
        class="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-600"
      >
        {{ actualPercentage }}%
      </span>
    </div>
    <n-text size="xs" class="text-gray-600">
      (<n-money>{{ totalSpent }}</n-money> / <n-money>{{ budget.value }}</n-money
      >)
    </n-text>
  </div>
</template>

<style scoped>
/* Ensure the text stays within bounds */
span {
  white-space: nowrap;
}
</style>
