<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div class="rounded bg-white p-4 shadow">
      <form @submit.prevent="submitForm">
        <div>
          <label for="name">Name</label>
          <input
            id="name"
            v-model="budgetIn.name"
            type="text"
            class="w-full rounded border p-2"
            required
          />
        </div>
        <div>
          <label for="total">Total</label>
          <input
            id="total"
            v-model="budgetIn.value"
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
import { type BudgetIn, addBudget, editBudget, hasId } from '@/lib/budget'
import { useCurrentUser, useFirestore } from 'vuefire'

const { budget } = defineProps<{ budget: BudgetIn }>()

const emit = defineEmits<{ (e: 'close'): void }>()

const budgetIn = ref<BudgetIn>(budget)

const user = useCurrentUser()
const db = useFirestore()

function submitForm() {
  if (hasId(budgetIn.value)) {
    void editBudget(db, budgetIn.value, user.value!.uid)
  } else {
    void addBudget(db, budgetIn.value, user.value!.uid)
  }
  emit('close')
}
</script>
