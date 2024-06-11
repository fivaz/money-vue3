<template>
  <div class="p-4">
    <header class="flex justify-between items-center">
      <button @click="prevMonth">&lt;</button>
      <h1>{{ currentMonth }}</h1>
      <button @click="nextMonth">&gt;</button>
    </header>
    <h2 class="text-2xl">{{ balance }}</h2>
    <div v-if="budgets.length === 0" class="text-center p-4">
      <p>No budgets found. Click the button below to create your first budget.</p>
      <button @click="addRandomBudget" class="mt-2 bg-blue-500 text-white p-2 rounded">Create Budget</button>
    </div>
    <Budget
      v-for="budget in budgets"
      :key="budget.id"
      :budget="budget"
      @update-transactions="fetchBudgets"
    />
    <TransactionForm
      v-if="showTransactionForm"
      :budgetId="currentBudgetId"
      :transactionId="currentTransactionId"
      @close="showTransactionForm = false"
      @update="fetchBudgets"
    />
    <BudgetForm
      v-if="showBudgetForm"
      :budgetId="currentBudgetId"
      @close="showBudgetForm = false"
      @update="fetchBudgets"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Budget from './components/Budget.vue';
import TransactionForm from './components/TransactionForm.vue';
import BudgetForm from './components/BudgetForm.vue';

const currentMonth = ref('June');
const showTransactionForm = ref(false);
const showBudgetForm = ref(false);
const currentBudgetId = ref('');
const currentTransactionId = ref('');

const budgets = ref([]);
const transactions = ref([]);

const balance = computed(() => {
  return transactions.value.reduce((sum, tx) => sum + tx.amount, 0);
});

const fetchBudgets = () => {
  budgets.value = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    name: `Budget ${i + 1}`,
    total: Math.floor(Math.random() * 1000) + 100,
  }));
};

const prevMonth = () => {
  // Logic to go to the previous month
};

const nextMonth = () => {
  // Logic to go to the next month
};

const addRandomBudget = () => {
  // Simulate adding a random budget
  const newBudget = {
    id: budgets.value.length + 1,
    name: `Budget ${budgets.value.length + 1}`,
    total: Math.floor(Math.random() * 1000) + 100,
  };
  budgets.value.push(newBudget);
};

fetchBudgets(); // Fetch budgets when the component is mounted
</script>
