<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  type Budget,
  getBudgetsSpent,
  getBudgetsSum,
  getEmptyBudget,
} from '@/components/budgets/service'
import BudgetItem from '@/components/budgets/budget-item.vue'
import BudgetForm from '@/components/budgets/budget-form.vue'
import { useBudgetsStore } from '@/components/budgets/store.ts'
import { PiggyBankIcon } from 'lucide-vue-next'
import NText from '@/components/base/n-text.vue'
import NMoney from '@/components/base/n-money.vue'
import { useTransactionsStore } from '@/components/transactions/store.ts'
import { useDateStore } from '@/store/date.ts'

const budgetsStore = useBudgetsStore()
const transactionStore = useTransactionsStore()
const dateStore = useDateStore()

const newBudget = ref<Budget>(getEmptyBudget())

const isMounted = ref(false)
onMounted(() => (isMounted.value = true))

const totalBudget = computed(() => getBudgetsSum(budgetsStore.value))

const totalSpent = computed(() =>
  getBudgetsSpent(budgetsStore.value, transactionStore.value, dateStore.selectedDate),
)
</script>

<template>
  <div>
    <div v-if="budgetsStore.value.length">
      <ul class="mt-4 space-y-2">
        <BudgetItem v-for="budget in budgetsStore.value" :key="budget.id" :budget="budget" />
      </ul>
    </div>
    <NText v-else>Loading budgets...</NText>

    <Teleport to="#header-right" v-if="isMounted">
      <div class="flex flex-col items-end gap-2 md:flex-row-reverse md:items-center md:gap-4">
        <BudgetForm :budget="newBudget">
          <PiggyBankIcon class="size-5" />
          Add Budget
        </BudgetForm>
        <NText>
          total budget: <NMoney>{{ totalBudget }}</NMoney>
        </NText>
        <NText>
          total spent: <NMoney>{{ totalSpent }}</NMoney>
        </NText>
      </div>
    </Teleport>
  </div>
</template>
