<script setup lang="ts">
import NInput from '@/components/base/n-input.vue'
import NMoney from '@/components/base/n-money.vue'
import type { Transaction } from '@/components/transactions/service.ts'
import { computed, defineEmits, ref } from 'vue'
import NText from '@/components/base/n-text.vue'
import { differenceInMonths, isValid, parseISO } from 'date-fns'
import { nParseDate } from '@/lib/const.ts'

const props = defineProps<{
  modelValue: Transaction
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Transaction): void // For v-model support
}>()

// Computed property to handle two-way binding with v-model
const transactionIn = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const errors = ref('')

function calculateMonthsBetween(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) {
    return 0
  }

  const startDate = nParseDate(startDateStr)
  const endDate = nParseDate(endDateStr)

  // Check if the parsed dates are valid
  if (!isValid(startDate)) {
    return 0
  }
  if (!isValid(endDate)) {
    return 0
  }

  // Ensure the end date is not before the start date
  if (endDate < startDate) {
    errors.value = 'End date must be after start date'
    return 0
  }

  // Calculate number of months between dates
  // Adding 1 to include both start and end months
  return differenceInMonths(endDate, startDate) + 1
}

const numberOfMonths = computed(() =>
  calculateMonthsBetween(transactionIn.value.startDate, transactionIn.value.endDate),
)
</script>

<template>
  <div class="flex flex-col gap-2 rounded-lg border border-gray-300 p-2 dark:border-white">
    <n-text size="sm" class="font-semibold">Recurring</n-text>
    <n-text size="xs">
      Every month
      <n-money class="text-red-500">
        {{ transactionIn.amount / numberOfMonths }}
      </n-money>
      will be transferred for {{ numberOfMonths }} months
    </n-text>
    <div class="grid grid-cols-2 gap-4">
      <n-input name="Start at" type="date" v-model="transactionIn.startDate" />
      <n-input name="End at" type="date" v-model="transactionIn.endDate" />
    </div>
  </div>
</template>
