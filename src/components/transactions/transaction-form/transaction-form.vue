<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Transaction } from '@/components/transactions/service.ts'
import NButton from '@/components/base/n-button.vue'
import NInput from '@/components/base/n-input.vue'
import NDialog from '@/components/base/n-dialog.vue'
import {
  addTransaction,
  deepCopy,
  deleteTransaction,
  updateTransaction,
} from '@/components/transactions/repository.ts'
import MoneyInput from '@/components/base/money-input.vue'
import NTextarea from '@/components/base/n-textarea.vue'
import NSwitch from '@/components/base/n-switch.vue'
import NSelect from '@/components/base/Select/n-select.vue'
import SelectItem from '@/components/base/Select/select-item.vue'
import { useBudgetsStore } from '@/components/budgets/store.ts'
import NText from '@/components/base/n-text.vue'
import TransactionOperation from '@/components/transactions/transaction-form/transaction-operation.vue'
import IconRenderer from '@/components/base/Icon/icon-renderer.vue'
import AccountSelect from '@/components/transactions/transaction-form/account-select.vue'
import TransactionAnnual from '@/components/transactions/transaction-form/transaction-annual.vue'
import NAlert from '@/components/base/n-alert.vue'

const props = defineProps<{
  transaction: Transaction
  isAccountAnnual?: boolean
}>()

const transactionIn = ref<Transaction>(deepCopy(props.transaction))
const isOpen = ref<boolean>(false)

const isAnAnnualTransaction = computed(() => {
  return props.isAccountAnnual || props.transaction.annualSource
})

const budgetsStore = useBudgetsStore()

function handleOpen() {
  transactionIn.value = deepCopy(props.transaction)
  isOpen.value = true
}

function handleSubmit() {
  if (!transactionIn.value) throw "transaction can't be null"

  try {
    if (transactionIn.value.id) {
      // Edit mode
      updateTransaction(transactionIn.value.id, transactionIn.value)
    } else {
      // Add mode
      addTransaction(transactionIn.value)
    }
    closeDialog() // Close dialog on success
  } catch (error) {
    console.error('Error saving transaction:', error)
  }
}

function handleDelete() {
  if (!transactionIn.value) throw "transaction can't be null"

  try {
    deleteTransaction(transactionIn.value.id)
    closeDialog() // Close dialog on success
  } catch (error) {
    console.error('Error deleting transaction:', error)
  }
}

function closeDialog() {
  isOpen.value = false
}

const errors = ref('')
</script>

<template>
  <NButton v-bind="$attrs" @click="handleOpen">
    <slot />
  </NButton>

  <NDialog :is-open="isOpen" @close="closeDialog">
    <n-text size="lg" class="font-semibold">
      {{ transactionIn.id ? 'Edit Transaction' : 'Add Transaction' }}
    </n-text>

    <n-alert v-if="errors" v-model="errors" />

    <form @submit.prevent="handleSubmit" class="z-20 mt-4 space-y-4">
      <TransactionOperation v-if="!isAnAnnualTransaction" v-model="transactionIn.operation" />

      <div>
        <NTextarea :rows="2" name="Description" v-model="transactionIn.description" />
      </div>

      <div class="grid grid-cols-3 gap-4">
        <NInput
          class="col-span-2"
          type="datetime-local"
          name="Date"
          v-model="transactionIn.date"
          autofocus
        />
        <MoneyInput class="col-span-1" name="Amount" v-model="transactionIn.amount" />
      </div>

      <div class="flex items-center gap-4">
        <n-select by="id" class="flex-1" name="Budget" v-model="transactionIn.budget">
          <template #placeholder>
            <div v-if="transactionIn.budget" class="flex items-center gap-2">
              <IconRenderer :name="transactionIn.budget.icon" class="size-4 flex-shrink-0" />
              <span class="truncate">
                {{ transactionIn.budget.name }}
              </span>
            </div>
            <span v-else>Select a budget</span>
          </template>
          <select-item class="flex items-center gap-2" :value="null">
            <span class="size-4 flex-shrink-0" />
            <span class="truncate">No budget</span>
          </select-item>
          <select-item
            class="flex items-center gap-2"
            v-for="budget in budgetsStore.value"
            :key="budget.id"
            :value="budget"
          >
            <IconRenderer :name="budget.icon" class="size-4 flex-shrink-0" />
            <span class="truncate">
              {{ budget.name }}
            </span>
          </select-item>
        </n-select>

        <NSwitch name="isPaid" v-model="transactionIn.isPaid" negative="error" />
      </div>

      <div class="flex gap-4">
        <account-select
          :name="isAnAnnualTransaction ? 'Account' : 'Origin'"
          v-model="transactionIn.account"
        />
        <account-select
          v-if="transactionIn.operation === 'transfer'"
          name="Destination"
          v-model="transactionIn.destination"
        />
        <account-select
          name="Money source"
          v-if="isAnAnnualTransaction"
          v-model="transactionIn.annualSource"
        />
      </div>

      <transaction-annual
        v-if="isAnAnnualTransaction"
        v-model="transactionIn"
        v-model:errors="errors"
      />

      <NInput name="Reference date" type="date" v-model="transactionIn.referenceDate" />

      <div class="flex justify-between gap-2">
        <div>
          <n-button v-if="transactionIn.id" @click="handleDelete" color="error">Delete</n-button>
        </div>

        <div class="flex gap-2">
          <n-button type="submit" color="primary">Save</n-button>
          <n-button @click="closeDialog" color="secondary">Cancel</n-button>
        </div>
      </div>
    </form>
  </NDialog>
</template>
