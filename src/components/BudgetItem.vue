<template>
  <div class="border p-4 mb-4">
    <header class="flex justify-between items-center">
      <h3>{{ budget.name }} {{ spent }} / {{ budget.total }}</h3>
      <div>
        <button @click="addTransaction">+</button>
        <button @click="editBudget">⚙️</button>
      </div>
    </header>
    <ul v-if="expanded">
      <li v-for="(tx, index) in transactions" :key="index">
        <span>{{ tx.date }}</span>
        <span>{{ tx.description }}</span>
        <span>{{ tx.amount }}</span>
        <button @click="editTransaction(index)">✏️</button>
      </li>
    </ul>
    <button @click="toggleExpanded">{{ expanded ? '⬆️' : '⬇️' }}</button>
    <TransactionForm
      v-if="showTransactionForm"
      :budgetId="budget.id"
      :transactionId="currentTransactionId"
      @close="showTransactionForm = false"
      @update="updateTransactions"
    />
    <BudgetForm
      v-if="showBudgetForm"
      :budgetId="budget.id"
      @close="showBudgetForm = false"
      @update="updateBudget"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TransactionForm from './TransactionForm.vue';
import BudgetForm from './BudgetForm.vue';

const props = defineProps<{
  budget: { id: string; name: string; total: number };
}>();

const transactions = ref([
  { id: 1, date: '2024-06-01', description: 'Transaction 1', amount: 100 },
  { id: 2, date: '2024-06-03', description: 'Transaction 2', amount: 50 },
  { id: 3, date: '2024-06-05', description: 'Transaction 3', amount: 75 }
]);
const expanded = ref(false);
const showTransactionForm = ref(false);
const showBudgetForm = ref(false);
const currentTransactionId = ref('');

const spent = computed(() => {
  return transactions.value.reduce((sum, tx) => sum + tx.amount, 0);
});

const toggleExpanded = () => {
  expanded.value = !expanded.value;
};

const addTransaction = () => {
  currentTransactionId.value = '';
  showTransactionForm.value = true;
};

const editTransaction = (index) => {
  currentTransactionId.value = transactions.value[index].id;
  showTransactionForm.value = true;
};

const editBudget = () => {
  showBudgetForm.value = true;
};

const updateTransactions = () => {
  // Logic to update transactions
};

const updateBudget = async () => {
  // Logic to update budget
};

</script>
