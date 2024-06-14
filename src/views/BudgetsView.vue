<template>
	<Navbar>
		<div class="mb-2 flex flex-col items-center justify-between">
			<DateHeader v-model="currentDate"></DateHeader>
			<!--			<h2 class="text-sm font-semibold leading-6 text-gray-900">-->
			<!--				{{ formatMoney(balance) }}-->
			<!--			</h2>-->
		</div>

		<ul role="list" class="flex flex-col gap-5">
			<BudgetItem
				@edit-budget="(a) => editBudget(a)"
				v-for="budget in budgets"
				:key="budget.id"
				:budget="budget"
				:currentTransactions="currentTransactions"
				:budgets="budgets"
				:accounts="accounts"
			/>
		</ul>
		<button
			@click="addBudget"
			type="button"
			class="absolute bottom-0 right-0 z-10 m-3 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		>
			Add Budget
		</button>

		<ModalDialog :show="showForm" @close="showForm = false">
			<BudgetForm @close="showForm = false" :budget="editingBudget" />
		</ModalDialog>
	</Navbar>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BudgetItem from '@/components/budget/BudgetItem.vue'
import BudgetForm from '@/components/budget/BudgetForm.vue'
import type { Budget } from '@/lib/budget'
import { collection } from 'firebase/firestore'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'
import { ACCOUNTS, BUDGETS, TRANSACTIONS, USERS } from '@/lib/consts'
import ModalDialog from '@/components/Modal.vue'
import Navbar from '@/components/Navbar.vue'
import DateHeader from '@/components/DateHeader.vue'
import type { Account } from '@/lib/account'
import type { Transaction } from '@/lib/transaction'
import { isSameMonth, parseISO } from 'date-fns'

const currentDate = ref(new Date())

const showForm = ref(false)

const editingBudget = ref<Budget>(getEmptyBudget())

const db = useFirestore()
const user = useCurrentUser()

const accounts = useCollection<Account>(collection(db, USERS, user.value!.uid, ACCOUNTS))
const budgets = useCollection<Budget>(collection(db, USERS, user.value!.uid, BUDGETS))
const allTransactions = useCollection<Transaction>(
	collection(db, USERS, user.value!.uid, TRANSACTIONS),
)

const currentTransactions = computed(() =>
	allTransactions.value.filter((transaction) =>
		isSameMonth(currentDate.value, parseISO(transaction.date)),
	),
)

function editBudget(budget: Budget) {
	showForm.value = true
	editingBudget.value = budget
}

function getEmptyBudget(): Budget {
	return {
		id: '',
		name: '',
		value: 0,
	}
}

function addBudget() {
	showForm.value = true
	editingBudget.value = getEmptyBudget()
}
</script>
