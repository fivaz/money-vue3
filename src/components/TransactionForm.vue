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
import type { Budget } from '@/lib/budget'
import TransactionForm from '@/components/TransactionForm.vue'
import type { Transaction } from '@/lib/transactions'
import { addDoc, collection } from 'firebase/firestore'
import { useCurrentUser, useFirestore } from 'vuefire'

const { transaction, budgetId } = defineProps<{ budgetId: string; transaction: Transaction }>()

const emit = defineEmits<{ (e: 'close'): void }>()

const transactionIn = ref<Transaction>(transaction)
const user = useCurrentUser()
function submitForm() {
  const transactionCollectionRef = collection(
    useFirestore(),
    'users',
    user.value!.uid,
    'budgets',
    budgetId,
    'transactions'
  )
  void addDoc(transactionCollectionRef, transactionIn.value)
  emit('close')
}
</script>
