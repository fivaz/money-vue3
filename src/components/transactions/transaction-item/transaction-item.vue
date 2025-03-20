<script setup lang="ts">
import { computed } from 'vue'
import type { Transaction } from '@/components/transactions/service.ts'
import NText from '@/components/base/n-text.vue'
import { CogIcon, Grid2x2Icon, CombineIcon, ArrowLeftRightIcon } from 'lucide-vue-next'
import TransactionForm from '@/components/transactions/transaction-form/transaction-form.vue'
import TransactionItemAmount from '@/components/transactions/transaction-item/transaction-item-amount.vue'
import TransactionItemDate from '@/components/transactions/transaction-item/transaction-item-date.vue'
import type { Account } from '@/components/accounts/service.ts'
import { useDateStore } from '@/store/date.ts'
import { isSameMonth, parseISO } from 'date-fns'
import IconRenderer from '@/components/base/Icon/icon-renderer.vue'

const props = defineProps<{
  transaction: Transaction
  account: Account
  isAnnualOriginal?: boolean
}>()

const dateStore = useDateStore()

// duplicate transaction when it's the original annual transaction
const shouldShowAnnualTransactionPayment = computed(() => {
  // make sure it only show it once,not recurringly
  if (props.isAnnualOriginal) return false

  if (!props.account.isAnnual) return false

  if (!props.transaction.annualSource) return false

  if (!props.transaction.startDate || !props.transaction.endDate) return false

  // check if date is in the same month
  const transactionDate = parseISO(props.transaction.date)
  return isSameMonth(transactionDate, dateStore.selectedDate)
})
</script>

<template>
  <!--  show the payment of the annual transaction-->
  <TransactionItem
    :transaction="transaction"
    :account="account"
    v-if="shouldShowAnnualTransactionPayment"
    isAnnualOriginal
  />
  <!--  show only the transfers of the annual transaction-->

  <li class="flex items-center justify-between bg-white px-3 py-2 dark:bg-gray-700">
    <div class="flex items-center gap-4 truncate">
      <transaction-item-date>{{ transaction.date }}</transaction-item-date>
      <div class="flex items-center gap-2 truncate">
        <NText>
          <IconRenderer class="size-4 shrink-0 text-yellow-500" :name="transaction.budget?.icon" />
        </NText>
        <NText class="truncate font-medium" v-if="transaction.description">
          {{ transaction.description }}
        </NText>

        <NText class="truncate font-medium" v-else-if="transaction.budget">
          {{ transaction.budget.name }}
        </NText>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <NText v-if="transaction.annualSource?.id === account.id">
        <CombineIcon class="size-4 shrink-0 text-yellow-500" />
      </NText>
      <NText v-if="transaction.operation === 'transfer'">
        <ArrowLeftRightIcon class="size-4 shrink-0 text-yellow-500" />
      </NText>
      <NText v-if="isAnnualOriginal">
        <Grid2x2Icon class="size-4 shrink-0 text-yellow-500" />
      </NText>
      <TransactionItemAmount
        :isAnnualOriginal="isAnnualOriginal"
        :transaction="transaction"
        :account-id="account.id"
      />
      <TransactionForm :transaction="transaction" :is-account-annual="account.isAnnual">
        <CogIcon class="size-4 shrink-0" />
      </TransactionForm>
    </div>
  </li>
</template>
