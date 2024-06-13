<template>
	<NavBar>
		<div class="flex justify-center">
			<h1 class="mb-2 text-2xl font-semibold leading-6 text-gray-900">
				{{ formatMoney(balance) }}
			</h1>
		</div>
		<ul role="list" class="space-y-3">
			<TransactionItem
				v-for="transaction in transactions"
				:key="transaction.id"
				:transaction="transaction"
				@edit="editTransaction"
			/>
		</ul>
		<ModalDialog :show="showForm" @close="showForm = false">
			<TransactionForm
				:transaction="editedTransaction"
				@close="showForm = false"
				:budgets="budgets"
			/>
		</ModalDialog>
	</NavBar>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import TransactionItem from '@/components/TransactionItem.vue'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'
import type { Transaction } from '@/lib/transactions'
import { collection } from 'firebase/firestore'
import { BUDGETS, TRANSACTIONS, USERS } from '@/lib/consts'
import { computed, ref } from 'vue'
import { formatMoney } from '@/lib/utils'
import ModalDialog from '@/components/ModalDialog.vue'
import TransactionForm from '@/components/TransactionForm.vue'
import type { Budget } from '@/lib/budget'

const db = useFirestore()
const user = useCurrentUser()

const budgets = useCollection<Budget>(collection(db, USERS, user.value!.uid, BUDGETS))

const transactions = useCollection<Transaction>(
	collection(db, USERS, user.value!.uid, TRANSACTIONS),
)

const showForm = ref(false)

const editedTransaction = ref<Transaction>(getEmptyTransaction())

const balance = computed(() =>
	transactions.value.reduce((sum, transaction) => sum + transaction.amount, 0),
)

function getEmptyTransaction(): Transaction {
	return {
		id: '',
		date: new Date().toISOString(),
		description: '',
		amount: -1,
		budget: {
			id: '0',
			name: 'no budget',
			value: 0,
		},
	}
}

function editTransaction(transaction: Transaction) {
	editedTransaction.value = transaction
	showForm.value = true
}
</script>
