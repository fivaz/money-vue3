<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Budget } from '@/components/budgets/service'
import NButton from '@/components/base/n-button.vue'
import NInput from '@/components/base/n-input.vue'
import NDialog from '@/components/base/n-dialog.vue'
import { addBudget, deepCopy, deleteBudget, updateBudget } from '@/components/budgets/repository'
import MoneyInput from '@/components/base/money-input.vue'
import IconSelector from '@/components/base/Icon/icon-selector.vue'
import NText from '@/components/base/n-text.vue'
import NSelect from '@/components/base/Select/n-select.vue'
import SelectItem from '@/components/base/Select/select-item.vue'
import { useBudgetsStore } from '@/components/budgets/store.ts'

const props = defineProps<{
  budget: Budget
}>()

const budgetIn = ref<Budget>(deepCopy(props.budget))

const isOpen = ref<boolean>(false)

const budgetsStore = useBudgetsStore()

const orders = computed(() => Array.from({ length: budgetsStore.value.length }, (_, i) => i + 1))

function handleOpen() {
  budgetIn.value = deepCopy(props.budget)
  isOpen.value = true
}

function handleSubmit() {
  if (!budgetIn.value) throw "budget can't be null"

  try {
    if (budgetIn.value.id) {
      // Edit mode
      updateBudget(budgetIn.value.id, budgetIn.value)
    } else {
      // Add mode
      addBudget(budgetIn.value)
    }
    isOpen.value = false // Close dialog on success
  } catch (error) {
    console.error('Error saving budget:', error)
  }
}

function handleDelete() {
  if (!budgetIn.value) throw "budget can't be null"

  try {
    deleteBudget(budgetIn.value.id)
    isOpen.value = false // Close dialog on success
  } catch (error) {
    console.error('Error deleting budget:', error)
  }
}

function closeDialog() {
  isOpen.value = false
}
</script>

<template>
  <NButton @click="handleOpen" v-bind="$attrs">
    <slot />
  </NButton>

  <NDialog :is-open="isOpen" @close="closeDialog">
    <n-text size="lg" class="font-semibold">
      {{ budgetIn.id ? 'Edit Budget' : 'Add Budget' }}
    </n-text>
    <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
      <div>
        <NInput name="Name" v-model="budgetIn.name" />
      </div>
      <div class="flex gap-2">
        <n-select class="flex-1" name="Order" v-model="budgetIn.order">
          <select-item :key="order" v-for="order in orders" :value="order">
            {{ order }}
          </select-item>
        </n-select>
        <MoneyInput class="flex-1" name="Amount" v-model="budgetIn.value" />
      </div>
      <div>
        <IconSelector v-model="budgetIn.icon" />
      </div>

      <div class="flex justify-between gap-2">
        <NButton @click="handleDelete" color="error">Delete</NButton>

        <div class="flex gap-2">
          <NButton type="submit" color="primary">Save</NButton>
          <NButton @click="closeDialog" color="secondary">Cancel</NButton>
        </div>
      </div>
    </form>
  </NDialog>
</template>
