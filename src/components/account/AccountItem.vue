<template>
	<div class="overflow-hidden rounded-xl border border-gray-200">
		<div class="border-b border-gray-200 bg-gray-50 p-3 dark:bg-slate-900">
			<div class="flex items-center justify-between gap-x-4">
				<div class="flex items-center gap-2">
					<component :is="getIcon(account.icon)" class="h-4 w-4 text-gray-900 dark:text-white" />
					<span class="text-sm font-medium leading-6 text-gray-900 dark:text-white">
						{{ account.name }}
					</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="text-sm font-medium leading-6 text-gray-900 dark:text-white">
						{{ formatMoney(balance) }}
					</div>
					<MButton color="indigo" size="small" type="button" @click="addTransaction">
						<Plus class="h-4 w-4 text-white" />
					</MButton>
					<MButton size="small" color="white" type="button" @click="$emit('editAccount', account)">
						<Settings2 class="h-4 w-4 text-gray-900 dark:text-white" />
					</MButton>
					<MButton color="white" size="small" type="button" @click="toggleSorting">
						<ArrowDownAZ v-if="isSortingAscending" class="h-4 w-4 text-gray-900 dark:text-white" />
						<ArrowUpZA v-else class="h-4 w-4 text-gray-900 dark:text-white" />
					</MButton>
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
						v-for="transaction in sortedCurrentTransactions"
						:key="transaction.id"
						:transaction="transaction"
						:account-id="account.id"
						@edit="editTransaction"
					/>
				</DisclosurePanel>
			</transition>
			<DisclosureButton
				class="flex w-full justify-center p-2 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-slate-900 dark:hover:text-gray-300"
			>
				<ChevronDown :class="open && 'rotate-180 transform'" />
			</DisclosureButton>
		</Disclosure>
	</div>

	<MModal :show="showForm" @close="showForm = false">
		<TransactionForm
			:transaction="editingTransaction"
			@close="showForm = false"
			:accounts="accounts"
			:budgets="budgets"
		/>
	</MModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TransactionForm from '@/components/transaction/TransactionForm.vue'
import AccountTransactionItem from './AccountTransactionItem.vue'
import type { Account } from '@/lib/account'
import { parseAmount, type Transaction } from '@/lib/transaction'
import { ChevronDown, ArrowUpZA, ArrowDownAZ, Plus, Settings2 } from 'lucide-vue-next'
import { formatMoney, getIcon } from '@/lib/utils'
import MModal from '@/components/form/MModal.vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import type { Budget } from '@/lib/budget'
import { isSameMonth, parseISO } from 'date-fns'
import MButton from '@/components/MButton.vue'

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
		isPaid: true,
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
