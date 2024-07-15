<template>
	<div class="overflow-hidden rounded-xl border border-gray-200">
		<div :class="['border-b border-gray-200 p-3', SECONDARY_COLOR_BG]">
			<div class="flex items-center justify-between gap-x-4">
				<div class="flex items-center gap-2">
					<component :is="getIcon(account.icon)" class="h-4 w-4" />
					<span class="text-sm font-medium leading-6">
						{{ account.name }}
					</span>
				</div>
				<div class="flex items-center gap-2">
					<div
						:class="['text-sm font-medium leading-6', getAmountColor(amountDifference)]"
						v-if="isSameMonth(props.currentDate, new Date())"
					>
						({{ formatMoney(amountDifference) }})
					</div>
					<div class="text-sm font-medium leading-6">
						{{ formatMoney(balance) }}
					</div>
					<MButton @click="addTransaction" color="indigo" size="small" type="button">
						<Plus class="h-4 w-4" />
					</MButton>
					<MButton @click="$emit('editAccount', account)" color="white" size="small" type="button">
						<Settings2 class="h-4 w-4" />
					</MButton>
					<MButton @click="toggleSorting" color="white" size="small" type="button">
						<ArrowDownAZ class="h-4 w-4" v-if="isSortingAscending" />
						<ArrowUpZA class="h-4 w-4" v-else />
					</MButton>
				</div>
			</div>
		</div>
		<Disclosure default-open v-slot="{ open }">
			<transition
				enter-active-class="transition duration-100 ease-out"
				enter-from-class="transform scale-95 opacity-0"
				enter-to-class="transform scale-100 opacity-100"
				leave-active-class="transition duration-75 ease-out"
				leave-from-class="transform scale-100 opacity-100"
				leave-to-class="transform scale-95 opacity-0"
			>
				<DisclosurePanel as="ul" class="-my-3 py-3 text-sm leading-6">
					<AccountTransactionItem
						:account-id="account.id"
						:key="transaction.id"
						:transaction="transaction"
						@edit="editTransaction"
						v-for="transaction in sortedCurrentTransactions"
					/>
				</DisclosurePanel>
			</transition>
			<DisclosureButton
				:class="[
					SECONDARY_COLOR_TEXT,
					'flex w-full justify-center p-2 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-slate-900 dark:hover:text-gray-300',
				]"
			>
				<ChevronDown :class="open && 'rotate-180 transform'" />
			</DisclosureButton>
		</Disclosure>
	</div>

	<MModal :show="showForm" @close="showForm = false">
		<TransactionForm
			:accounts="accounts"
			:budgets="budgets"
			:transaction="editingTransaction"
			@close="showForm = false"
		/>
	</MModal>
</template>

<script setup lang="ts">
import type { Account } from '@/lib/account'
import type { Budget } from '@/lib/budget'

import MButton from '@/components/MButton.vue'
import MModal from '@/components/form/MModal.vue'
import TransactionForm from '@/components/transaction/TransactionForm.vue'
import { SECONDARY_COLOR_BG, SECONDARY_COLOR_TEXT } from '@/lib/consts'
import { type Transaction, parseAmount } from '@/lib/transaction'
import { formatMoney, getAmountColor, getIcon } from '@/lib/utils'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { isSameMonth, parseISO } from 'date-fns'
import { ArrowDownAZ, ArrowUpZA, ChevronDown, Plus, Settings2 } from 'lucide-vue-next'
import { computed, ref } from 'vue'

import AccountTransactionItem from './AccountTransactionItem.vue'

const props = defineProps<{
	account: Account
	accounts: Account[]
	budgets: Budget[]
	currentDate: Date
	historicalTransactions: Transaction[]
}>()

defineEmits<{ (e: 'editAccount', value: Account): void }>()

const isSortingAscending = ref(true)

const accountTransactions = computed(() =>
	props.historicalTransactions.filter(
		(transaction) =>
			transaction.account.id === props.account.id ||
			transaction.destination?.id === props.account.id,
	),
)

const currentTransactions = computed(() =>
	accountTransactions.value.filter((transaction) =>
		isSameMonth(props.currentDate, parseISO(transaction.date)),
	),
)

const sortedCurrentTransactions = computed(() => {
	return [...currentTransactions.value].sort((a, b) => {
		if (isSortingAscending.value) {
			return new Date(a.date).getTime() - new Date(b.date).getTime()
		} else {
			return new Date(b.date).getTime() - new Date(a.date).getTime()
		}
	})
})

const balance = computed(() =>
	accountTransactions.value.reduce(
		(sum, transaction) => sum + parseAmount(transaction, props.account.id),
		0,
	),
)

const amountDifference = computed(() => balance.value - props.account.currentAmount)

const showForm = ref(false)

const editingTransaction = ref<Transaction>(getEmptyTransactionFromAccount())

function getEmptyTransactionFromAccount(): Transaction {
	return {
		account: props.account,
		amount: 0,
		budget: props.budgets.find((budget) => budget.isDefault) || null,
		date: props.currentDate.toISOString(),
		description: '',
		destination: null,
		endDate: null,
		id: '',
		isPaid: true,
		operation: 'expense',
		startDate: null,
	}
}

function addTransaction() {
	editingTransaction.value = getEmptyTransactionFromAccount()
	showForm.value = true
}

function editTransaction(transaction: Transaction) {
	editingTransaction.value = transaction
	showForm.value = true
}

function toggleSorting() {
	isSortingAscending.value = !isSortingAscending.value
}
</script>
