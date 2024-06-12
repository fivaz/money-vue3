<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div class="rounded bg-white p-4 shadow">
      <form @submit.prevent="submitForm">
        <div>
          <label for="date">Date</label>
          <input
            id="date"
            v-model="transactionIn.date"
            type="date"
            class="w-full rounded border p-2"
            required
          />
        </div>
        <div>
          <label for="description">Description</label>
          <input
            id="description"
            v-model="transactionIn.description"
            type="text"
            class="w-full rounded border p-2"
          />
        </div>
        <div>
          <label for="amount">Amount</label>
          <input
            id="amount"
            v-model="transactionIn.amount"
            type="number"
            class="w-full rounded border p-2"
            required
          />
        </div>
        <div class="mt-4 flex justify-end">
          <button type="button" @click="$emit('close')" class="mr-2">Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue'
import { addTransaction, editTransaction, hasId, type TransactionIn } from '@/lib/transactions'
import { useCurrentUser, useFirestore } from 'vuefire'

const { transaction, budgetId } = defineProps<{ budgetId: string; transaction: TransactionIn }>()

const emit = defineEmits<{ (e: 'close'): void }>()

const transactionIn = ref<TransactionIn>(transaction)

const user = useCurrentUser()
const db = useFirestore()

function submitForm() {
  if (hasId(transactionIn.value)) {
    void editTransaction(db, transactionIn.value, budgetId, user.value!.uid)
  } else {
    void addTransaction(db, transactionIn.value, budgetId, user.value!.uid)
  }
  emit('close')
}
</script>
