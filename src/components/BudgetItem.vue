<template>
  <li class="overflow-hidden rounded-xl border border-gray-200">
    <div
      class="flex items-center justify-between gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6"
    >
      <div class="text-sm font-medium leading-6 text-gray-900">{{ budget.name }}</div>
      <div class="flex gap-2">
        <div class="text-sm font-medium leading-6 text-gray-900">
          {{ spent }} / {{ budget.value }}
        </div>
        <button
          type="button"
          class="rounded bg-white px-1.5 py-1 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          @click="addTransaction"
        >
          <Plus :size="18" />
        </button>
        <button
          class="rounded bg-white px-1.5 py-1 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          @click="$emit('editBudget', budget)"
        >
          <Settings2 :size="18" />
        </button>
      </div>
    </div>
    <div class="flex flex-col justify-center">
      <ul
        class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6"
        v-if="showTransactions"
      >
        <li class="py-3 text-gray-500" v-for="transaction in transactions" :key="transaction.id">
          <button class="flex w-full justify-between gap-x-4" @click="editTransaction(transaction)">
            <span>{{ transaction.date }}</span>
            <span>{{ transaction.description }}</span>
            <span>{{ transaction.amount }}</span>
          </button>
        </li>
      </ul>
    </div>
    <button class="w-full" @click="toggleExpanded">
      {{ showTransactions ? '⬆️' : '⬇️' }}
    </button>
  </li>
  <TransactionForm
    v-if="showTransactionForm"
    :transaction="editedTransaction"
    @close="showTransactionForm = false"
    :budget-id="budget.id"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TransactionForm from './TransactionForm.vue'
import type { Budget } from '@/lib/budget'
import type { Transaction, TransactionIn } from '@/lib/transactions'
import { Plus, Settings2 } from 'lucide-vue-next'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore'

const { budget } = defineProps<{ budget: Budget }>()

defineEmits<{ (e: 'editBudget', value: Budget): void }>()
const db = useFirestore()

const user = useCurrentUser()

const transactions = useCollection<Transaction>(
  collection(db, 'users', user.value!.uid, 'budgets', budget.id, 'transactions')
)

const showTransactions = ref(true)

const showTransactionForm = ref(false)

function buildTransactionIn(): TransactionIn {
  return {
    date: new Date().toISOString(),
    description: '',
    amount: 0,
    budget
  }
}

const editedTransaction = ref<TransactionIn>(buildTransactionIn())

const spent = computed(() => {
  return transactions.value.reduce((sum, transaction) => sum + transaction.amount, 0)
})

function toggleExpanded() {
  showTransactions.value = !showTransactions.value
}

function addTransaction() {
  editedTransaction.value = buildTransactionIn()
  showTransactionForm.value = true
}

function editTransaction(transaction: Transaction) {
  editedTransaction.value = transaction
  showTransactionForm.value = true
}
</script>
