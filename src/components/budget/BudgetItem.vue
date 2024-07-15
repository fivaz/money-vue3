<template>
	<li class="overflow-hidden rounded-xl border border-gray-200">
		<div :class="[SECONDARY_COLOR_BG, 'border-b border-gray-200 p-3']">
			<div class="flex items-center justify-between gap-x-4">
				<div class="flex items-center gap-2">
					<component :is="getIcon(budget.icon)" class="h-4 w-4" />
					<span class="text-sm font-medium leading-6">
						{{ budget.name }}
					</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="text-sm font-medium leading-6">
						{{ formatMoney(budget.value) }}
					</div>
					<MButton @click="addTransaction" color="indigo" size="small" type="button">
						<Plus class="h-4 w-4" />
					</MButton>
					<MButton @click="$emit('editBudget', budget)" color="white" size="small" type="button">
						<Settings2 class="h-4 w-4" />
					</MButton>
				</div>
			</div>
			<ProgressBar :budget="budget" :transactions="budgetTransactions" />
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
					<BudgetTransactionItem
						:key="transaction.id"
						:transaction="transaction"
						@edit="editTransaction"
						v-for="transaction in budgetTransactions"
					/>
				</DisclosurePanel>
			</transition>
			<DisclosureButton :class="['flex w-full justify-center p-2', MAIN_HOVER_COLOR_BG]">
				<ChevronDown :class="[{ 'rotate-180 transform': open }]" />
			</DisclosureButton>
		</Disclosure>
	</li>

	<TransactionForm
		:accounts="accounts"
		:budgets="budgets"
		:show="showForm"
		:transaction="editingTransaction"
		@close="showForm = false"
	/>
</template>

<script setup lang="ts">
import type { Account } from '@/lib/account'
import type { Budget } from '@/lib/budget'

import MButton from '@/components/MButton.vue'
import BudgetTransactionItem from '@/components/budget/BudgetTransactionItem.vue'
import ProgressBar from '@/components/form/ProgressBar.vue'
import TransactionForm from '@/components/transaction/TransactionForm.vue'
import { MAIN_HOVER_COLOR_BG, SECONDARY_COLOR_BG } from '@/lib/consts'
import { type Transaction } from '@/lib/transaction'
import { formatMoney, getIcon } from '@/lib/utils'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronDown, Plus, Settings2 } from 'lucide-vue-next'
import { computed, ref } from 'vue'

const props = defineProps<{
	accounts: Account[]
	budget: Budget
	budgets: Budget[]
	currentDate: Date
	transactions: Transaction[]
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
		account: props.accounts[0],
		amount: 0,
		budget: props.budget,
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
	editingTransaction.value = getEmptyTransactionFromBudget()
	showForm.value = true
}

function editTransaction(transaction: Transaction) {
	editingTransaction.value = transaction
	showForm.value = true
}
</script>
