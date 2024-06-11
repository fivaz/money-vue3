<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div class="bg-white p-4 rounded shadow">
      <form @submit.prevent="submitForm">
        <div>
          <label for="date">Date</label>
          <input id="date" v-model="transaction.date" type="date" class="border p-2 rounded w-full" required>
        </div>
        <div>
          <label for="description">Description</label>
          <input id="description" v-model="transaction.description" type="text" class="border p-2 rounded w-full">
        </div>
        <div>
          <label for="amount">Amount</label>
          <input id="amount" v-model="transaction.amount" type="number" class="border p-2 rounded w-full" required>
        </div>
        <div class="flex justify-end mt-4">
          <button type="button" @click="closeForm" class="mr-2">Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, onMounted } from 'vue';

const props = defineProps<{
  budgetId: string;
  transactionId?: string;
}>();

const emit = defineEmits(['close', 'update']);
const transaction = ref({
  date: '',
  description: '',
  amount: 0,
  budgetId: props.budgetId,
});

const closeForm = () => {
  emit('close');
};

const submitForm = async () => {
  emit('update');
  closeForm();
};
</script>
