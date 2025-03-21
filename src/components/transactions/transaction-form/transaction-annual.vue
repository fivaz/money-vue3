<script setup lang="ts">
import NInput from '@/components/base/n-input.vue'
import NMoney from '@/components/base/n-money.vue'
import { calculateMonthsInAnnual, type Transaction } from '@/components/transactions/service.ts'
import { computed, defineEmits, watch } from 'vue'
import NText from '@/components/base/n-text.vue'

const props = defineProps<{
  modelValue: Transaction
  errors: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Transaction): void // For v-model support
  (e: 'update:errors', value: string): void
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

const numberOfMonths = computed(() => calculateMonthsInAnnual(transactionIn.value))

watch(numberOfMonths, (newValue) => {
  if (newValue <= 0) {
    emit('update:errors', 'End date must be after start date')
  } else {
    emit('update:errors', '')
  }
})
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
