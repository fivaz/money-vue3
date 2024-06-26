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
				:transactions="currentTransactions"
				:budgets="budgets"
				:accounts="accounts"
				:current-date="currentDate"
			/>
		</ul>

		<div v-if="budgets.length === 0" class="pt-10 text-center">
			<PiggyBank class="mx-auto h-16 w-16 text-gray-400" />
			<h3 class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">No Budget</h3>
			<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
				Get started by creating your first budget.
			</p>
			<div class="mt-6 flex justify-center">
				<Button size="big" color="indigo" type="button" @click="addBudget">
					<Plus class="h-5 w-5" aria-hidden="true" />
					New Budget
				</Button>
			</div>
		</div>

		<Button
			size="big"
			color="indigo"
			type="button"
			@click="addBudget"
			class="absolute bottom-0 right-0 z-10 m-3"
		>
			<Plus class="h-5 w-5" aria-hidden="true" />
			New Budget
		</Button>

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
import ModalDialog from '@/components/form/Modal.vue'
import Navbar from '@/components/Navbar.vue'
import DateHeader from '@/components/DateHeader.vue'
import type { Account } from '@/lib/account'
import { getHistoricalTransactions, type Transaction } from '@/lib/transaction'
import { Plus, PiggyBank } from 'lucide-vue-next'
import { icons } from '@/lib/utils'
import { isSameMonth, parseISO } from 'date-fns'
import Button from '@/components/Button.vue'

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
	getHistoricalTransactions(currentDate.value, allTransactions.value).filter((transaction) =>
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
		icon: icons[0].name,
	}
}

function addBudget() {
	showForm.value = true
	editingBudget.value = getEmptyBudget()
}
</script>
