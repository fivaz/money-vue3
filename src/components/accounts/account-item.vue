<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue'
import { type Account, findTransactionsByAccount } from '@/components/accounts/service.ts'
import { getEmptyTransaction, type Transaction } from '@/components/transactions/service.ts'
import NText from '@/components/base/n-text.vue'
import {
  CogIcon,
  PlusIcon,
  ChevronUpIcon,
  ArrowDownNarrowWideIcon,
  ArrowDownWideNarrowIcon,
} from 'lucide-vue-next'
import AccountForm from '@/components/accounts/account-form.vue'
import TransactionItem from '@/components/transactions/transaction-item/transaction-item.vue'
import TransactionForm from '@/components/transactions/transaction-form/transaction-form.vue'
import { useTransactionsStore } from '@/components/transactions/store'
import { useDateStore } from '@/store/date.ts'
import IconRenderer from '@/components/base/Icon/icon-renderer.vue'
import NButton from '@/components/base/n-button.vue'

const props = defineProps<{
  account: Account
}>()

const dateStore = useDateStore()

const newTransaction = ref<Transaction>(
  getEmptyTransaction(props.account, dateStore.getISODateTimeLocal()),
)

// update newTransaction when selectedDate changes
watch(
  () => dateStore.getISODateTimeLocal(),
  (date: string) => {
    newTransaction.value = getEmptyTransaction(props.account, date)
  },
)

const transactionStore = useTransactionsStore()

const accountTransactions = computed(() =>
  findTransactionsByAccount(transactionStore.value, props.account, dateStore.selectedDate),
)

const isAscending = ref(false)

const sortedTransactions = computed(() =>
  isAscending.value ? accountTransactions.value : [...accountTransactions.value].reverse(),
)
</script>

<template>
  <li class="rounded-lg border border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800">
    <div
      class="rounded-x-lg flex items-center justify-between rounded-t-lg border-b border-gray-300 p-3 dark:border-gray-600"
    >
      <div class="flex items-center gap-2">
        <NText>
          <IconRenderer class="size-5" :name="account.icon" />
        </NText>
        <NText size="lg" class="font-medium">{{ account.name }}</NText>
      </div>
      <div class="flex gap-2">
        <n-button @click="isAscending = !isAscending">
          <ArrowDownNarrowWideIcon v-if="isAscending" class="size-4" />
          <ArrowDownWideNarrowIcon v-else class="size-4" />
        </n-button>
        <TransactionForm
          color="primary"
          :transaction="newTransaction"
          :is-account-annual="account.isAnnual"
        >
          <PlusIcon class="size-4" />
        </TransactionForm>
        <AccountForm :account="account">
          <CogIcon class="size-4" />
        </AccountForm>
      </div>
    </div>

    <ul role="list" class="divide-y divide-gray-300 dark:divide-gray-600">
      <TransactionItem
        v-for="transaction in sortedTransactions"
        :key="transaction.id"
        :transaction="transaction"
        :account="account"
      />
    </ul>

    <div class="flex justify-center p-2">
      <n-text><ChevronUpIcon class="size-5" /></n-text>
    </div>
  </li>
</template>
