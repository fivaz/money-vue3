<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { type Budget, findTransactionsByBudget } from '@/components/budgets/service.ts'
import NText from '@/components/base/n-text.vue'
import { ChevronDownIcon, CogIcon } from 'lucide-vue-next'
import BudgetForm from '@/components/budgets/budget-form.vue'
import NMoney from '@/components/base/n-money.vue'
import IconRenderer from '@/components/base/Icon/icon-renderer.vue'
import TransactionItem from '@/components/transactions/transaction-item/transaction-item.vue'
import { useTransactionsStore } from '@/components/transactions/store.ts'
import { useDateStore } from '@/store/date.ts'
import ProgressBar from '@/components/base/progress-bar.vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

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
  <Disclosure v-slot="{ open }">
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

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <DisclosurePanel>
          <ul role="list" class="divide-y divide-gray-300 dark:divide-gray-600">
            <TransactionItem
              v-for="transaction in budgetTransactions"
              :key="transaction.id"
              :transaction="transaction"
              :account="transaction.annualSource || transaction.account"
            />
          </ul>
        </DisclosurePanel>
      </transition>

      <DisclosureButton class="flex w-full justify-center p-2">
        <n-text>
          <ChevronDownIcon :class="open && 'rotate-180 transform'" />
        </n-text>
      </DisclosureButton>
    </li>
  </Disclosure>
</template>
