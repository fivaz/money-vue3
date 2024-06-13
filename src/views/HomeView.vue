<template>
	<NavBar>
		<div class="mb-2 flex flex-col items-center justify-between">
			<div class="flex w-full items-center justify-between">
				<button @click="prevMonth"><ChevronLeft /></button>
				<h1
					class="text-base font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
				>
					{{ currentMonth }}
				</h1>
				<button @click="nextMonth"><ChevronRight /></button>
			</div>
			<h2 class="text-sm font-semibold leading-6 text-gray-900">
				{{ formatMoney(balance) }}
			</h2>
		</div>

		<ul role="list" class="flex flex-col gap-5">
			<BudgetItem
				v-for="budget in budgets"
				:key="budget.id"
				:budget="budget"
				@edit-budget="(b) => editBudget(b)"
				:currentDate="currentDate"
				:budgets="budgets"
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
			<BudgetForm @close="showForm = false" :budget="editedBudget" />
		</ModalDialog>
	</NavBar>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BudgetItem from '@/components/BudgetItem.vue'
import BudgetForm from '@/components/BudgetForm.vue'
import { addMonths, format, isSameMonth, parseISO, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Transaction } from '@/lib/transactions'
import type { Budget } from '@/lib/budget'
import { formatMoney } from '@/lib/utils'
import { collection } from 'firebase/firestore'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'
import { BUDGETS, TRANSACTIONS, USERS } from '@/lib/consts'
import NavBar from '@/components/NavBar.vue'
import ModalDialog from '@/components/ModalDialog.vue'

const currentDate = ref(new Date())

const currentMonth = computed(() => format(currentDate.value, 'MMMM'))

const showForm = ref(false)

const editedBudget = ref<Budget>(getEmptyBudget())

const db = useFirestore()
const user = useCurrentUser()

const budgets = useCollection<Budget>(collection(db, USERS, user.value!.uid, BUDGETS))

const allTransactions = useCollection<Transaction>(
	collection(db, USERS, user.value!.uid, TRANSACTIONS),
)

const currentTransactions = computed(() =>
	allTransactions.value.filter((transaction) =>
		isSameMonth(currentDate.value, parseISO(transaction.date)),
	),
)

const balance = computed(() =>
	currentTransactions.value.reduce((sum, transaction) => sum + transaction.amount, 0),
)

function editBudget(budget: Budget) {
	showForm.value = true
	editedBudget.value = budget
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
	editedBudget.value = getEmptyBudget()
}

function prevMonth() {
	currentDate.value = subMonths(currentDate.value, 1)
}

function nextMonth() {
	currentDate.value = addMonths(currentDate.value, 1)
}
</script>
