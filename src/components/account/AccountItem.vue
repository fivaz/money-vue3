<template>
	<div class="overflow-hidden rounded-xl border border-gray-200">
		<div class="border-b border-gray-900/5 bg-gray-50 p-3">
			<div class="flex items-center justify-between gap-x-4">
				<div class="flex items-center gap-2">
					<component :is="getIcon(account.icon)" class="h-4 w-4" />
					<span class="text-sm font-medium leading-6 text-gray-900">{{ account.name }}</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="text-sm font-medium leading-6 text-gray-900">
						{{ formatMoney(balance) }}
					</div>
					<button
						type="button"
						class="rounded bg-indigo-600 px-1.5 py-1 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-400"
						@click="addTransaction"
					>
						<Plus class="h-4 w-4 text-white" />
					</button>
					<button
						type="button"
						class="rounded bg-white px-1.5 py-1 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100"
						@click="$emit('editAccount', account)"
					>
						<Settings2 class="h-4 w-4" />
					</button>
					<button
						type="button"
						class="rounded bg-white px-1.5 py-1 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100"
						@click="toggleSorting"
					>
						<ArrowDownAZ :class="['h-4 w-4', isSortingAscending && 'rotate-180 transform']" />
					</button>
				</div>
			</div>
		</div>
		<Disclosure v-slot="{ open }" default-open>
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
						v-for="transaction in sortCurrentTransactions"
						:key="transaction.id"
						:transaction="transaction"
						:account-id="account.id"
						@edit="editTransaction"
					/>
				</DisclosurePanel>
			</transition>
			<DisclosureButton class="flex w-full justify-center p-2 hover:bg-gray-50 hover:text-gray-700">
				<ChevronDown :class="open && 'rotate-180 transform'" />
			</DisclosureButton>
		</Disclosure>
	</div>

	<ModalDialog :show="showForm" @close="showForm = false">
		<TransactionForm
			:transaction="editingTransaction"
			@close="showForm = false"
			:accounts="accounts"
			:budgets="budgets"
		/>
	</ModalDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TransactionForm from '@/components/transaction/TransactionForm.vue'
import AccountTransactionItem from './AccountTransactionItem.vue'
import type { Account } from '@/lib/account'
import { parseAmount, type Transaction } from '@/lib/transaction'
import { Plus, Settings2, ChevronDown, ArrowDownAZ } from 'lucide-vue-next'
import { formatMoney, getIcon } from '@/lib/utils'
import ModalDialog from '@/components/Modal.vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import type { Budget } from '@/lib/budget'
import { isSameMonth, parseISO } from 'date-fns'

const props = defineProps<{
	account: Account
	accounts: Account[]
	budgets: Budget[]
	historicalTransactions: Transaction[]
	currentDate: Date
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

const sortCurrentTransactions = computed(() => {
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

const showForm = ref(false)

const editingTransaction = ref<Transaction>(getEmptyTransactionFromAccount())

function getEmptyTransactionFromAccount(): Transaction {
	return {
		id: '',
		date: props.currentDate.toISOString(),
		description: '',
		amount: 0,
		account: props.account,
		budget: null,
		destination: null,
		operation: 'expense',
		startDate: null,
		endDate: null,
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
