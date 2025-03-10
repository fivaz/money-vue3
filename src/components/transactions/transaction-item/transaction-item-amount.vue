<script setup lang="ts">
import NMoney from '@/components/base/n-money.vue'

import { computed } from 'vue'
import type { Transaction } from '@/components/transactions/service.ts'
const props = defineProps<{
  transaction: Transaction
  accountId: string
  isAnnualOriginal?: boolean
}>()

const formatAmount = computed(() => {
  // transaction is positive when money is transferred to this account
  if (
    props.transaction.operation === 'transfer' &&
    props.transaction.destination?.id === props.accountId
  ) {
    return props.transaction.amount
  }

  // transaction is positive when money is received
  if (props.transaction.operation === 'income') {
    return props.transaction.amount
  }

  // transaction is positive when is not the annual original, but is an annual transaction and this account is not the source of the money
  if (
    !props.isAnnualOriginal &&
    props.transaction.annualSource &&
    props.transaction.annualSource.id !== props.accountId
  ) {
    return props.transaction.amount
  }

  // in all other cases the transaction is negative
  return props.transaction.amount * -1
})

const isAnnualTransactionMonthlyContribution = computed(
  () => !props.isAnnualOriginal && props.transaction.annualSource,
)

// Compute the class based on value
const amountColor = computed(() => {
  if (!props.transaction.isPaid) return 'text-gray-900 dark:text-gray-100'
  return formatAmount.value < 0 ? 'text-red-500' : 'text-green-500'
})
</script>

<template>
  <NMoney :class="amountColor">
    {{ isAnnualTransactionMonthlyContribution ? formatAmount / 12 : formatAmount }}
  </NMoney>
</template>
