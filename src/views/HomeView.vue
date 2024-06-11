<template>
  <pre v-if="error">{{ error }}</pre>
  <div class="p-4">
    <header class="flex flex-col justify-between items-center mb-2">
      <div class="w-full flex justify-between items-center">
        <button @click="prevMonth"><ChevronLeft /></button>
        <h1
          class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
        >
          {{ format(currentDate, 'MMMM') }}
        </h1>
        <button @click="nextMonth"><ChevronRight /></button>
      </div>
      <h2 class="mt-1 text-base font-semibold leading-6 text-gray-900">
        ${{ parseAmount(balance) }}
      </h2>
    </header>

    <ul role="list" class="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
      <BudgetItem
        v-for="budget in budgets"
        :key="budget.id"
        :budget="budget"
        @edit-budget="(b) => editBudget(b)"
      />
    </ul>
    <button
      type="button"
      @click="addBudget"
      class="absolute bottom-0 right-0 m-4 rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      Button text
    </button>

    <!--    <TransactionForm-->
    <!--      v-if="showTransactionForm"-->
    <!--      :budgetId="currentBudgetId"-->
    <!--      :transactionId="currentTransactionId"-->
    <!--      @close="showTransactionForm = false"-->
    <!--      @update="fetchBudgets"-->
    <!--    />-->

    <BudgetForm v-if="showBudgetForm" @close="showBudgetForm = false" :budget="editedBudget" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BudgetItem from '@/components/BudgetItem.vue'
import TransactionForm from '@/components/TransactionForm.vue'
import BudgetForm from '@/components/BudgetForm.vue'
import { addMonths, format, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Transaction } from '@/transactions'
import type { Budget } from '@/budget'
import { parseAmount } from '@/utils'
import { getFirestore, collection } from 'firebase/firestore'

const currentDate = ref(new Date())
const showBudgetForm = ref(false)

const editedBudget = ref<Budget>({
  id: '',
  name: '',
  value: 0
})

// const budgets = ref<Budget[]>([
//   {
//     id: '1',
//     name: 'Shopping',
//     value: 10000
//   },
//   {
//     id: '2',
//     name: 'Insurance',
//     value: 50000
//   }
// ])

const transactions = ref<Transaction[]>([
  {
    id: '1',
    description: '',
    date: new Date().toISOString(),
    amount: 10099
  },
  {
    id: '2',
    description: '',
    date: new Date().toISOString(),
    amount: 20099
  },
  {
    id: '3',
    description: '',
    date: new Date().toISOString(),
    amount: 30099
  }
])

const balance = computed(() => {
  return transactions.value.reduce((sum, tx) => sum + tx.amount, 0)
})

function editBudget(budget: Budget) {
  showBudgetForm.value = true
  editedBudget.value = budget
}

function addBudget() {
  showBudgetForm.value = true
  editedBudget.value = {
    id: '',
    name: '',
    value: 0
  }
}

const prevMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1)
}

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1)
}

import { useCollection, useFirebaseAuth, useFirestore } from 'vuefire'
const db = useFirestore()

const budgets = useCollection<Budget>(collection(db, 'budgets'))

const auth = useFirebaseAuth()!

const error = ref(null)

import { getRedirectResult, signInWithRedirect, signOut } from 'firebase/auth'

onMounted(() => {
  getRedirectResult(auth).catch((reason) => {
    console.error('Failed redirect result', reason)
    error.value = reason
  })
})
</script>
