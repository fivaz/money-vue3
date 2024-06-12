<template>
	<li class="overflow-hidden rounded-xl border border-gray-200">
		<div
			class="flex items-center justify-between gap-x-4 border-b border-gray-900/5 bg-gray-50 p-3"
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
					type="button"
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
				<DisclosurePanel as="ul" class="-my-3 divide-y divide-gray-100 py-3 text-sm leading-6">
					<TransactionItem
						v-for="transaction in transactions"
						:key="transaction.id"
						:transaction="transaction"
						@edit="editTransaction"
					/>
				</DisclosurePanel>
			</transition>
			<DisclosureButton class="flex w-full justify-center p-2 hover:bg-gray-50 hover:text-gray-700">
				<ChevronDown :class="open && 'rotate-180 transform'" />
			</DisclosureButton>
		</Disclosure>
	</li>

	<Modal :show="showForm" @close="showForm = false">
		<TransactionForm
			:transaction="editedTransaction"
			@close="showForm = false"
			:budget-id="budget.id"
		/>
	</Modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import TransactionForm from './TransactionForm.vue'
import type { Budget } from '@/lib/budget'
import type { Transaction } from '@/lib/transactions'
import { Plus, Settings2, ChevronDown } from 'lucide-vue-next'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore'
import { BUDGETS, TRANSACTIONS, USERS } from '@/lib/consts'
import { formatMoney } from '@/lib/utils'
import TransactionItem from '@/components/TransactionItem.vue'
import Modal from '@/components/Modal.vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

const { budget } = defineProps<{ budget: Budget }>()

defineEmits<{ (e: 'editBudget', value: Budget): void }>()

const db = useFirestore()

const user = useCurrentUser()

const transactions = useCollection<Transaction>(
	collection(db, USERS, user.value!.uid, BUDGETS, budget.id, TRANSACTIONS),
)

const showForm = ref(false)

const editedTransaction = ref<Transaction>(getEmptyTransaction())

const spent = computed(() =>
	formatMoney(transactions.value.reduce((sum, transaction) => sum + transaction.amount, 0)),
)

function getEmptyTransaction(): Transaction {
	return {
		id: '',
		date: new Date().toISOString(),
		description: '',
		amount: 0,
		budget,
	}
}

function addTransaction() {
	editedTransaction.value = getEmptyTransaction()
	showForm.value = true
}

function editTransaction(transaction: Transaction) {
	editedTransaction.value = transaction
	showForm.value = true
}
</script>
