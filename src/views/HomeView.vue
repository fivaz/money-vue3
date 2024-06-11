<template>
  <div class="p-4">
    <header
      class="flex flex-col justify-between text-base items-center font-semibold leading-6 text-gray-900"
    >
      <div class="w-full flex justify-between items-center">
        <button @click="prevMonth"><ChevronLeft /></button>
        <h1 class="">
          {{ format(currentDate, 'MMMM') }}
        </h1>
        <button @click="nextMonth"><ChevronRight /></button>
      </div>
      <h2 class="">{{ parseAmount(balance) }}</h2>
    </header>

    <ul>
      <BudgetItem
        v-for="budget in budgets"
        :key="budget.id"
        :budget="budget"
        @edit-budget="(budget) => editBudget(budget)"
      />
    </ul>

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
import { ref, computed } from 'vue'
import BudgetItem from '@/components/BudgetItem.vue'
import TransactionForm from '@/components/TransactionForm.vue'
import BudgetForm from '@/components/BudgetForm.vue'
import { addMonths, format, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Transaction } from '@/transactions'
import type { Budget } from '@/budget'
import { parseAmount } from '@/utils'

const currentDate = ref(new Date())
const showBudgetForm = ref(false)

const editedBudget = ref<Budget>({
  id: '',
  name: '',
  value: 0
})

const budgets = ref<Budget[]>([
  {
    id: '1',
    name: 'Shopping',
    value: 10000
  },
  {
    id: '2',
    name: 'Insurance',
    value: 50000
  }
])

const transactions = ref<Transaction[]>([
  {
    id: '1',
    description: '',
    date: new Date().toLocaleDateString(),
    amount: 10099
  },
  {
    id: '2',
    description: '',
    date: new Date().toLocaleDateString(),
    amount: 20099
  },
  {
    id: '3',
    description: '',
    date: new Date().toLocaleDateString(),
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

const prevMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1)
}

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1)
}
</script>
