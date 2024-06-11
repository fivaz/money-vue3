<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div class="bg-white p-4 rounded shadow">
      <form @submit.prevent="submitForm">
        <div>
          <label for="name">Name</label>
          <input
            id="name"
            v-model="budgetIn.name"
            type="text"
            class="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label for="total">Total</label>
          <input
            id="total"
            v-model="budgetIn.value"
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

const { budget } = defineProps<{ budget: Budget }>()

defineEmits<{ (e: 'close'): void }>()

const budgetIn = ref<Budget>(budget)

function submitForm() {
  console.log('submit')
  console.log(budgetIn)
}
</script>
