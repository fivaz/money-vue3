<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type Budget, getEmptyBudget } from '@/components/budgets/service'
import BudgetItem from '@/components/budgets/budget-item.vue'
import BudgetForm from '@/components/budgets/budget-form.vue'
import { useBudgetsStore } from '@/components/budgets/store.ts'
import { PiggyBankIcon } from 'lucide-vue-next'

const budgetsStore = useBudgetsStore()

const newBudget = ref<Budget>(getEmptyBudget())

const isMounted = ref(false)
onMounted(() => (isMounted.value = true))
</script>

<template>
  <div>
    <div v-if="budgetsStore.value.length">
      <ul class="mt-4 space-y-2">
        <BudgetItem v-for="budget in budgetsStore.value" :key="budget.id" :budget="budget" />
      </ul>
    </div>
    <div v-else>Loading budgets...</div>

    <Teleport to="#header-right" v-if="isMounted">
      <BudgetForm :budget="newBudget">
        <PiggyBankIcon class="size-5" />
        Add Budget
      </BudgetForm>
    </Teleport>
  </div>
</template>
