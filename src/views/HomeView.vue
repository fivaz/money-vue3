<template>
	<Navbar>
		<div class="mb-2 flex flex-col items-center justify-between">
			<DateHeader v-model="currentDate"></DateHeader>
			<h2 class="text-sm font-semibold leading-6 text-gray-900">
				{{ formatMoney(balance) }}
			</h2>
		</div>

		<ul role="list" class="flex flex-col gap-5">
			<AccountItem
				@edit-account="(a) => editAccount(a)"
				v-for="account in accounts"
				:key="account.id"
				:account="account"
				:currentTransactions="currentTransactions"
				:accounts="accounts"
				:budgets="budgets"
			/>
		</ul>

		<div v-if="accounts.length === 0" class="pt-10 text-center">
			<Vault class="mx-auto h-12 w-12 text-gray-400" />
			<h3 class="mt-2 text-sm font-semibold text-gray-900">No account</h3>
			<p class="mt-1 text-sm text-gray-500">Get started by creating your first account.</p>
			<div class="mt-6">
				<button
					type="button"
					@click="addAccount"
					class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>
					<Plus class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
					New Account
				</button>
			</div>
		</div>

		<button
			@click="addAccount"
			type="button"
			class="absolute bottom-0 right-0 z-10 m-3 inline-flex rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		>
			<Plus class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
			New Account
		</button>

		<ModalDialog :show="showForm" @close="showForm = false">
			<AccountForm @close="showForm = false" :account="editingAccount" />
		</ModalDialog>
	</Navbar>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AccountItem from '@/components/account/AccountItem.vue'
import AccountForm from '@/components/account/AccountForm.vue'
import type { Account } from '@/lib/account'
import { collection } from 'firebase/firestore'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'
import { ACCOUNTS, BUDGETS, TRANSACTIONS, USERS } from '@/lib/consts'
import ModalDialog from '@/components/Modal.vue'
import Navbar from '@/components/Navbar.vue'
import DateHeader from '@/components/DateHeader.vue'
import type { Budget } from '@/lib/budget'
import { Plus, Vault } from 'lucide-vue-next'
import type { Transaction } from '@/lib/transaction'
import { endOfMonth, isBefore, isSameDay, isSameMonth, parseISO } from 'date-fns'
import { formatMoney, icons } from '@/lib/utils'

const currentDate = ref(new Date())

const showForm = ref(false)

const editingAccount = ref<Account>(getEmptyAccount())

const db = useFirestore()
const user = useCurrentUser()

const budgets = useCollection<Budget>(collection(db, USERS, user.value!.uid, BUDGETS))
const accounts = useCollection<Account>(collection(db, USERS, user.value!.uid, ACCOUNTS))
const allTransactions = useCollection<Transaction>(
	collection(db, USERS, user.value!.uid, TRANSACTIONS),
)

const currentTransactions = computed(() =>
	allTransactions.value.filter((transaction) =>
		isSameMonth(currentDate.value, parseISO(transaction.date)),
	),
)

const upToThisMonth = computed(() =>
	allTransactions.value.filter((transaction) => {
		const endOfCurrentMonth = endOfMonth(currentDate.value)
		const transactionDate = parseISO(transaction.date)
		return (
			isBefore(transactionDate, endOfCurrentMonth) || isSameDay(transactionDate, endOfCurrentMonth)
		)
	}),
)

const balance = computed(() =>
	upToThisMonth.value.reduce((sum, transaction) => {
		if (transaction.operation == 'income') {
			return sum + transaction.amount
		}
		if (transaction.operation == 'expense') {
			return sum - transaction.amount
		}
		return sum
	}, 0),
)

function editAccount(account: Account) {
	showForm.value = true
	editingAccount.value = account
}

function getEmptyAccount(): Account {
	return {
		id: '',
		name: '',
		icon: icons[1].name,
	}
}

function addAccount() {
	showForm.value = true
	editingAccount.value = getEmptyAccount()
}
</script>
