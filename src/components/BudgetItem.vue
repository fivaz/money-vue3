<template>
	<li class="overflow-hidden rounded-xl border border-gray-200">
		<div
			class="flex items-center justify-between gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6"
		>
			<div class="text-sm font-medium leading-6 text-gray-900">{{ budget.name }}</div>
			<div class="flex gap-2">
				<div class="text-sm font-medium leading-6 text-gray-900">
					{{ spent }} / {{ formatMoney(budget.value) }}
				</div>
				<button
					type="button"
					class="rounded bg-white px-1.5 py-1 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
					@click="addTransaction"
				>
					<Plus :size="18" />
				</button>
				<button
					class="rounded bg-white px-1.5 py-1 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
					@click="$emit('editBudget', budget)"
				>
					<Settings2 :size="18" />
				</button>
			</div>
		</div>
		<Disclosure v-slot="{ open }">
			<transition
				enter-active-class="transition duration-100 ease-out"
				enter-from-class="transform scale-95 opacity-0"
				enter-to-class="transform scale-100 opacity-100"
				leave-active-class="transition duration-75 ease-out"
				leave-from-class="transform scale-100 opacity-100"
				leave-to-class="transform scale-95 opacity-0"
			>
				<DisclosurePanel as="ul" class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
					<TransactionItem
						v-for="transaction in transactions"
						:key="transaction.id"
						:transaction="transaction"
						@edit="editTransaction"
					/>
				</DisclosurePanel>
			</transition>
			<DisclosureButton class="flex w-full justify-center">
				<ChevronDown :class="open && 'rotate-180 transform'" />
			</DisclosureButton>
		</Disclosure>
	</li>
	<Modal :show="showTransactionForm" @close="showTransactionForm = false">
		<TransactionForm
			:transaction="editedTransaction"
			@close="showTransactionForm = false"
			:budget-id="budget.id"
		/>
	</Modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TransactionForm from './TransactionForm.vue'
import type { Budget } from '@/lib/budget'
import type { Transaction, TransactionIn } from '@/lib/transactions'
import { Plus, Settings2, ChevronDown } from 'lucide-vue-next'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore'
import { BUDGETS, DATETIME, TRANSACTIONS, USERS } from '@/lib/consts'
import { formatMoney } from '@/lib/utils'
import TransactionItem from '@/components/TransactionItem.vue'
import { format } from 'date-fns'
import Modal from '@/components/Modal.vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

const { budget } = defineProps<{ budget: Budget }>()

defineEmits<{ (e: 'editBudget', value: Budget): void }>()

const db = useFirestore()

const user = useCurrentUser()

const transactions = useCollection<Transaction>(
	collection(db, USERS, user.value!.uid, BUDGETS, budget.id, TRANSACTIONS),
)

const showTransactionForm = ref(false)

const editedTransaction = ref<TransactionIn>(buildTransactionIn())

const spent = computed(() =>
	formatMoney(transactions.value.reduce((sum, transaction) => sum + transaction.amount, 0)),
)

function buildTransactionIn(): TransactionIn {
	return {
		date: format(new Date(), DATETIME),
		description: '',
		amount: 0,
		budget,
	}
}

function addTransaction() {
	editedTransaction.value = buildTransactionIn()
	showTransactionForm.value = true
}

function editTransaction(transaction: Transaction) {
	editedTransaction.value = transaction
	showTransactionForm.value = true
}
</script>
