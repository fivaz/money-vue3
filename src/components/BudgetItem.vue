<template>
  <li class="overflow-hidden rounded-xl border border-gray-200">
    <div
      class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6 justify-between"
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
          <button class="w-full flex justify-between gap-x-4" @click="editTransaction(transaction)">
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
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TransactionForm from './TransactionForm.vue'
import BudgetForm from './BudgetForm.vue'
import type { Budget } from '@/lib/budget'
import type { Transaction } from '@/lib/transactions'
import { Plus, Settings2 } from 'lucide-vue-next'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisHorizontalIcon } from '@heroicons/vue/20/solid'

const statuses = {
  Paid: 'text-green-700 bg-green-50 ring-green-600/20',
  Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Overdue: 'text-red-700 bg-red-50 ring-red-600/10'
}
const budgets = [
  {
    id: 1,
    name: 'Tuple',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/tuple.svg',
    lastInvoice: {
      date: 'December 13, 2022',
      dateTime: '2022-12-13',
      amount: '$2,000.00',
      status: 'Overdue'
    }
  },
  {
    id: 2,
    name: 'SavvyCal',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/savvycal.svg',
    lastInvoice: {
      date: 'January 22, 2023',
      dateTime: '2023-01-22',
      amount: '$14,000.00',
      status: 'Paid'
    }
  },
  {
    id: 3,
    name: 'Reform',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/reform.svg',
    lastInvoice: {
      date: 'January 23, 2023',
      dateTime: '2023-01-23',
      amount: '$7,600.00',
      status: 'Paid'
    }
  }
]

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
