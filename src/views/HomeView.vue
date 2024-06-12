<template>
  <div class="p-4">
    <header class="mb-2 flex flex-col items-center justify-between">
      <div class="flex w-full items-center justify-between">
        <button @click="prevMonth"><ChevronLeft /></button>
        <h1
          class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
        >
          {{ currentMonth }}
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

    <BudgetForm v-if="showBudgetForm" @close="showBudgetForm = false" :budget="editedBudget" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BudgetItem from '@/components/BudgetItem.vue'
import BudgetForm from '@/components/BudgetForm.vue'
import { addMonths, format, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Transaction } from '@/lib/transactions'
import type { Budget } from '@/lib/budget'
import { parseAmount } from '@/lib/utils'
import { collection } from 'firebase/firestore'

const currentDate = ref(new Date())
const currentMonth = computed(() => format(currentDate.value, 'MMMM'))

const showBudgetForm = ref(false)

const editedBudget = ref<Budget>({
  id: '',
  name: '',
  value: 0
})

const transactions = ref<Transaction[]>([])

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

import { useCollection, useCurrentUser, useFirestore } from 'vuefire'
const db = useFirestore()

const user = useCurrentUser()

const budgets = useCollection<Budget>(collection(db, 'users', user.value!.uid, 'budgets'))
</script>
