<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { type Budget, findTransactionsByBudget } from '@/components/budgets/service.ts'
import NText from '@/components/base/n-text.vue'
import { ChevronUpIcon, CogIcon } from 'lucide-vue-next'
import BudgetForm from '@/components/budgets/budget-form.vue'
import NMoney from '@/components/base/n-money.vue'
import IconRenderer from '@/components/base/Icon/icon-renderer.vue'
import TransactionItem from '@/components/transactions/transaction-item/transaction-item.vue'
import { useTransactionsStore } from '@/components/transactions/store.ts'
import { useDateStore } from '@/store/date.ts'
import ProgressBar from '@/components/base/progress-bar.vue'

const props = defineProps<{
  budget: Budget
}>()

const transactionStore = useTransactionsStore()
const dateStore = useDateStore()

const budgetTransactions = computed(() =>
  findTransactionsByBudget(transactionStore.value, props.budget, dateStore.selectedDate),
)
</script>

<template>
  <li class="rounded-lg border border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800">
    <div
      class="rounded-x-lg flex flex-col gap-2 rounded-t-lg border-b border-gray-300 p-3 dark:border-gray-600"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <NText>
            <IconRenderer class="size-5" :name="budget.icon" />
          </NText>
          <NText size="lg" class="font-medium"> {{ budget.name }}</NText>
        </div>
        <div class="flex items-center gap-2">
          <NText>
            <NMoney>{{ budget.value }}</NMoney>
          </NText>
          <BudgetForm :budget="budget">
            <CogIcon class="size-5" />
          </BudgetForm>
        </div>
      </div>

      <progress-bar :budget="budget" :transactions="budgetTransactions" />
    </div>

    <ul role="list" class="divide-y divide-gray-300 dark:divide-gray-600">
      <TransactionItem
        v-for="transaction in budgetTransactions"
        :key="transaction.id"
        :transaction="transaction"
        :account="transaction.account"
      />
    </ul>

    <div class="flex justify-center p-2">
      <n-text><ChevronUpIcon class="size-5" /></n-text>
    </div>
  </li>
</template>
