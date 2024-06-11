<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div class="bg-white p-4 rounded shadow">
      <form @submit.prevent="submitForm">
        <div>
          <label for="date">Date</label>
          <input
            id="date"
            v-model="transactionIn.date"
            type="date"
            class="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label for="description">Description</label>
          <input
            id="description"
            v-model="transactionIn.description"
            type="text"
            class="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label for="amount">Amount</label>
          <input
            id="amount"
            v-model="transactionIn.amount"
            type="number"
            class="border p-2 rounded w-full"
            required
          />
        </div>
        <div class="flex justify-end mt-4">
          <button type="button" @click="$emit('close')" class="mr-2">Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, onMounted } from 'vue'
import type { Budget } from '@/budget'
import TransactionForm from '@/components/TransactionForm.vue'
import type { Transaction } from '@/transactions'

const { transaction } = defineProps<{ transaction: Transaction }>()

const emit = defineEmits<{ (e: 'close'): void }>()

const transactionIn = ref<Transaction>(transaction)

const submitForm = async () => {
  console.log(transactionIn)
  emit('close')
}
</script>
