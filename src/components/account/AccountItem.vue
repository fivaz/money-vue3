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
					<MButton @click="toggleFilterPaid" color="white" size="small" type="button">
						<Banknote class="h-4 w-4" v-if="isPaidFiltered" />
						<BlockedCircleDollarSign class="h-4 w-4" v-else />
					</MButton>
				</div>
			</div>
		</div>
		<Disclosure default-open v-slot="{ open }">
			<transition
				enter-active-class="transition duration-300 ease-out"
				enter-from-class="transform scale-95 opacity-0"
				enter-to-class="transform scale-100 opacity-100"
				leave-active-class="transition duration-300 ease-out"
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
					MAIN_HOVER_COLOR_BG,
					MAIN_HOVER_COLOR_TEXT,
					'flex w-full justify-center p-2',
				]"
			>
				<ChevronDown :class="open && 'rotate-180 transform'" />
			</DisclosureButton>
		</Disclosure>
	</div>

	<TransactionForm
		:accounts="accounts"
		:budgets="budgets"
		:show="showForm"
		:transaction="editingTransaction"
		@close="showForm = false"
	/>
</template>

<script setup lang="ts">
import type { Budget } from '@/lib/budget'

import BlockedCircleDollarSign from '@/components/BlockedCircleDollarSign.vue'
import MButton from '@/components/MButton.vue'
import TransactionForm from '@/components/transaction/TransactionForm.vue'
import { type Account } from '@/lib/account'
import {
	MAIN_HOVER_COLOR_BG,
	MAIN_HOVER_COLOR_TEXT,
	SECONDARY_COLOR_BG,
	SECONDARY_COLOR_TEXT,
} from '@/lib/consts'
import { type Transaction, parseAmount } from '@/lib/transaction'
import { formatMoney, getIcon } from '@/lib/utils'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { isSameMonth, parseISO } from 'date-fns'
import { ArrowDownAZ, ArrowUpZA, Banknote, ChevronDown, Plus, Settings2 } from 'lucide-vue-next'
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

const isPaidFiltered = ref(false)

const accountTransactions = computed(() =>
	props.historicalTransactions.filter(
		(transaction) =>
			transaction.account.id === props.account.id ||
			transaction.destination?.id === props.account.id,
	),
)

const filteredAccountTransactions = computed(() => {
	if (isPaidFiltered.value) {
		return accountTransactions.value.filter((transaction) => !transaction.isPaid)
	} else {
		return accountTransactions.value
	}
})

const currentTransactions = computed(() =>
	filteredAccountTransactions.value.filter((transaction) =>
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
	filteredAccountTransactions.value.reduce((sum, transaction) => {
		if (isPaidFiltered.value) {
			return sum + parseAmount(transaction, props.account.id)
		} else {
			//if not filtering paid transactions, only count the paid ones into the balance
			if (transaction.isPaid) {
				return sum + parseAmount(transaction, props.account.id)
			}
		}
		return sum
	}, 0),
)

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
		isDeleted: null,
		isPaid: true,
		operation: 'expense',
		referenceDate: null,
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

function toggleFilterPaid() {
	isPaidFiltered.value = !isPaidFiltered.value
}
</script>
