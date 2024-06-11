<template>
  <li class="border p-4 mb-4">
    <header class="flex justify-between items-center">
      <h3>{{ budget.name }} {{ spent }} / {{ budget.value }}</h3>
      <div>
        <button @click="addTransaction">+</button>
        <button @click="$emit('editBudget', budget)">⚙️</button>
      </div>
    </header>
    <ul v-if="showTransactions">
      <li v-for="transaction in transactions" :key="transaction.id">
        <span>{{ transaction.date }}</span>
        <span>{{ transaction.description }}</span>
        <span>{{ transaction.amount }}</span>
        <button @click="editTransaction(transaction)">✏️</button>
      </li>
    </ul>
    <button @click="toggleExpanded">{{ showTransactions ? '⬆️' : '⬇️' }}</button>
    <TransactionForm
      v-if="showTransactionForm"
      :budgetId="budget.id"
      @close="showTransactionForm = false"
    />
  </li>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TransactionForm from './TransactionForm.vue'
import BudgetForm from './BudgetForm.vue'
import type { Budget } from '@/budget'
import type { Transaction } from '@/transactions'

defineProps<{ budget: Budget }>()

defineEmits<{ (e: 'editBudget', value: Budget): void }>()

const transactions = ref<Transaction[]>([
  { id: '1', date: '2024-06-01', description: 'Transaction 1', amount: 100 },
  { id: '2', date: '2024-06-03', description: 'Transaction 2', amount: 50 },
  { id: '3', date: '2024-06-05', description: 'Transaction 3', amount: 75 }
])

const showTransactions = ref(false)

const showTransactionForm = ref(false)

const editedTransaction = ref<Transaction>(emptyTransaction())

const spent = computed(() => {
  return transactions.value.reduce((sum, transaction) => sum + transaction.amount, 0)
})

function emptyTransaction() {
  return {
    id: '',
    date: new Date().toISOString(),
    description: '',
    amount: 0
  }
}

const toggleExpanded = () => {
  showTransactions.value = !showTransactions.value
}

const addTransaction = () => {
  editedTransaction.value = emptyTransaction()
  showTransactionForm.value = true
}
const editTransaction = (transaction: Transaction) => {
  editedTransaction.value = transaction
  showTransactionForm.value = true
}
</script>
