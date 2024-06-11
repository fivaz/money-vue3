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
import type { Transaction, TransactionIn } from '@/lib/transactions'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { useCurrentUser, useFirestore } from 'vuefire'

const { transaction, budgetId } = defineProps<{ budgetId: string; transaction: TransactionIn }>()

const emit = defineEmits<{ (e: 'close'): void }>()

const transactionIn = ref<TransactionIn>(transaction)

const user = useCurrentUser()
const db = useFirestore()

function addTransaction(
  db: ReturnType<typeof useFirestore>,
  transaction: TransactionIn,
  budgetId: string,
  userId: string
): void {
  const transactionCollectionRef = collection(
    db,
    'users',
    userId,
    'budgets',
    budgetId,
    'transactions'
  )

  addDoc(transactionCollectionRef, transaction)
}
function editTransaction(
  db: ReturnType<typeof useFirestore>,
  transaction: Transaction,
  budgetId: string,
  userId: string
): void {
  const transactionDocRef = doc(
    db,
    'users',
    userId,
    'budgets',
    budgetId,
    'transactions',
    transaction.id
  )
  updateDoc(transactionDocRef, transaction)
}

function hasId(transactionIn: TransactionIn): transactionIn is Transaction {
  return !!transaction.id
}

function submitForm() {
  if (hasId(transactionIn.value)) {
    void editTransaction(db, transactionIn.value, budgetId, user.value!.uid)
  } else {
    void addTransaction(db, transactionIn.value, budgetId, user.value!.uid)
  }
  emit('close')
}
</script>
