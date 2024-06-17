<template>
	<li class="overflow-hidden rounded-xl border border-gray-200">
		<div class="border-b border-gray-200 bg-gray-50 p-3 dark:bg-gray-900">
			<div class="flex items-center justify-between gap-x-4">
				<div class="flex items-center gap-2">
					<component :is="getIcon(budget.icon)" class="h-4 w-4 text-gray-900 dark:text-white" />
					<span class="text-sm font-medium leading-6 text-gray-900 dark:text-white">
						{{ budget.name }}
					</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="text-sm font-medium leading-6 text-gray-900 dark:text-white">
						{{ formatMoney(budget.value) }}
					</div>
					<button
						type="button"
						class="rounded bg-white px-1.5 py-1 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-500"
						@click="addTransaction"
					>
						<Plus class="h-4 w-4" />
					</button>
					<button
						type="button"
						class="rounded bg-white px-1.5 py-1 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-500"
						@click="$emit('editBudget', budget)"
					>
						<Settings2 class="h-4 w-4" />
					</button>
				</div>
			</div>
			<ProgressBar :transactions="budgetTransactions" :budget="budget" />
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
					<BudgetTransactionItem
						v-for="transaction in budgetTransactions"
						:key="transaction.id"
						:transaction="transaction"
						@edit="editTransaction"
					/>
				</DisclosurePanel>
			</transition>
			<DisclosureButton class="flex w-full justify-center p-2 hover:bg-gray-50 hover:text-gray-700">
				<ChevronDown :class="[{ 'rotate-180 transform': open }]" />
			</DisclosureButton>
		</Disclosure>
	</li>

	<ModalDialog :show="showForm" @close="showForm = false">
		<TransactionForm
			@close="showForm = false"
			:transaction="editingTransaction"
			:accounts="accounts"
			:budgets="budgets"
		/>
	</ModalDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TransactionForm from '@/components/transaction/TransactionForm.vue'
import type { Budget } from '@/lib/budget'
import type { Account } from '@/lib/account'
import { type Transaction } from '@/lib/transaction'
import { Plus, Settings2, ChevronDown } from 'lucide-vue-next'
import ModalDialog from '@/components/form/Modal.vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import BudgetTransactionItem from '@/components/budget/BudgetTransactionItem.vue'
import ProgressBar from '@/components/form/ProgressBar.vue'
import { formatMoney, getIcon } from '@/lib/utils'

const props = defineProps<{
	budget: Budget
	accounts: Account[]
	budgets: Budget[]
	transactions: Transaction[]
	currentDate: Date
}>()

defineEmits<{ (e: 'editBudget', value: Budget): void }>()

const budgetTransactions = computed(() =>
	props.transactions.filter(
		(transaction) =>
			(transaction.operation === 'expense' || transaction.operation === 'transfer') &&
			transaction.budget?.id === props.budget.id,
	),
)

const showForm = ref(false)

const editingTransaction = ref<Transaction>(getEmptyTransactionFromBudget())

function getEmptyTransactionFromBudget(): Transaction {
	return {
		id: '',
		date: props.currentDate.toISOString(),
		description: '',
		amount: 0,
		account: props.accounts[0],
		budget: props.budget,
		destination: null,
		operation: 'expense',
		startDate: null,
		endDate: null,
		isPaid: true,
	}
}

function addTransaction() {
	editingTransaction.value = getEmptyTransactionFromBudget()
	showForm.value = true
}

function editTransaction(transaction: Transaction) {
	editingTransaction.value = transaction
	showForm.value = true
}
</script>
