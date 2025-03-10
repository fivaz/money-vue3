<script setup lang="ts">
import TransactionItem from '@/components/transactions/transaction-item/transaction-item.vue'
import { computed } from 'vue'
import { useTransactionsStore } from '@/components/transactions/store.ts'

const props = defineProps<{
  searchQuery: string // Optional, defaults to id
}>()

const transactionsStore = useTransactionsStore()

const searchedTransactions = computed(() => {
  return transactionsStore.raw.filter((transaction) => {
    return (
      // search based on description
      transaction.description.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
      // search based on budget name
      transaction.budget?.name.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
      // search based on the amount
      transaction.amount.toString().includes(props.searchQuery.toLowerCase())
    )
  })
})
</script>

<template>
  <div class="rounded-md bg-white p-4 shadow dark:bg-gray-800">
    <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-900">
      <transaction-item
        v-for="transaction in searchedTransactions"
        :key="transaction.id"
        :transaction="transaction"
        :account="transaction.account"
      />
    </ul>
  </div>
</template>
