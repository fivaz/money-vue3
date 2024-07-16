<template>
	<MNavbar>
		<div class="mb-2 flex flex-col items-center justify-between">
			<DateHeader v-model="currentDate"></DateHeader>
			<h2 class="text-sm font-semibold leading-6">
				<span
					:class="[
						'text-sm font-medium leading-6',
						getAmountColor(expectedVsActualBalanceDifference),
					]"
				>
					({{ formatMoney(expectedVsActualBalanceDifference) }})
				</span>
				<span>{{ formatMoney(sumOfBudgets) }}</span>
			</h2>
		</div>

		<ul class="flex flex-col gap-5" role="list">
			<BudgetItem
				:accounts="accounts"
				:budget="budget"
				:budgets="budgets"
				:current-date="currentDate"
				:key="budget.id"
				:transactions="currentTransactions"
				@edit-budget="(a) => editBudget(a)"
				v-for="budget in budgets"
			/>
		</ul>

		<div class="pt-10 text-center" v-if="budgets.length === 0">
			<PiggyBank :class="['mx-auto h-16 w-16', SECONDARY_COLOR_TEXT]" />
			<h3 class="mt-2 text-sm font-semibold">No Budget</h3>
			<p :class="['mt-1 text-sm', SECONDARY_COLOR_TEXT]">
				Get started by creating your first budget.
			</p>
			<div class="mt-6 flex justify-center">
				<MButton @click="addBudget" color="indigo" size="big" type="button">
					<Plus aria-hidden="true" class="h-5 w-5" />
					New Budget
				</MButton>
			</div>
		</div>

		<MButton
			@click="addBudget"
			class="fixed bottom-0 right-0 z-10 m-3"
			color="indigo"
			size="big"
			type="button"
		>
			<Plus aria-hidden="true" class="h-5 w-5" />
			New Budget
		</MButton>

		<BudgetForm :budget="editingBudget" :show="showForm" @close="showForm = false" />
	</MNavbar>
</template>

<script setup lang="ts">
import type { Account } from '@/lib/account'
import type { Budget } from '@/lib/budget'

import DateHeader from '@/components/DateHeader.vue'
import MButton from '@/components/MButton.vue'
import MNavbar from '@/components/MNavbar.vue'
import BudgetForm from '@/components/budget/BudgetForm.vue'
import BudgetItem from '@/components/budget/BudgetItem.vue'
import { ACCOUNTS, BUDGETS, SECONDARY_COLOR_TEXT, TRANSACTIONS, USERS } from '@/lib/consts'
import { type Transaction, getBalance, getHistoricalTransactions } from '@/lib/transaction'
import { formatMoney, getAmountColor, icons } from '@/lib/utils'
import { isSameMonth, parseISO } from 'date-fns'
import { collection } from 'firebase/firestore'
import { PiggyBank, Plus } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'

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
	getHistoricalTransactions(currentDate.value, allTransactions.value, true).filter((transaction) =>
		isSameMonth(currentDate.value, parseISO(transaction.referenceDate || transaction.date)),
	),
)

const sumOfBudgets = computed(() => budgets.value.reduce((sum, budget) => sum + budget.value, 0))

const expectedVsActualBalanceDifference = computed(() => {
	const currentBudgetTransactions = currentTransactions.value.filter((transaction) =>
		budgets.value.some((budget) => budget.id === transaction.budget?.id),
	)

	const actualBalance = computed(() => getBalance(currentBudgetTransactions))
	//Math.abs is necessary cause actualBalance is always negative
	return sumOfBudgets.value - Math.abs(actualBalance.value)
})

function editBudget(budget: Budget) {
	showForm.value = true
	editingBudget.value = budget
}

function getEmptyBudget(): Budget {
	return {
		icon: icons[0].name,
		id: '',
		isDefault: false,
		name: '',
		value: 0,
	}
}

function addBudget() {
	showForm.value = true
	editingBudget.value = getEmptyBudget()
}
</script>
