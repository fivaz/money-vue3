<template>
	<MNavbar>
		<div class="mb-2 flex flex-col items-center justify-between">
			<DateHeader v-model="currentDate"></DateHeader>
			<h2 class="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
				<span
					:class="['text-sm font-medium leading-6', getAmountColor(amountDifference)]"
					v-if="isSameMonth(currentDate, new Date())"
				>
					({{ formatMoney(amountDifference) }})
				</span>
				<span>{{ formatMoney(balance) }}</span>
			</h2>
		</div>

		<ul class="flex flex-col gap-5" role="list">
			<li
				:key="account.id"
				:style="{ order: account.order || accounts.length }"
				v-for="account in accounts"
			>
				<AccountItem
					:account="account"
					:accounts="accounts"
					:budgets="budgets"
					:currentDate="currentDate"
					:historicalTransactions="historicalTransactions"
					@edit-account="(a) => editAccount(a)"
				/>
			</li>
		</ul>

		<div class="pt-10 text-center" v-if="accounts.length === 0">
			<Vault class="mx-auto h-16 w-16 text-gray-400" />
			<h3 class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">No Account</h3>
			<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
				Get started by creating your first account.
			</p>
			<div class="mt-6 flex justify-center">
				<MButton @click="addAccount" color="indigo" size="big" type="button">
					<Plus aria-hidden="true" class="h-5 w-5" />
					New Account
				</MButton>
			</div>
		</div>

		<MButton
			@click="addAccount"
			class="fixed bottom-0 right-0 z-10 m-3"
			color="indigo"
			size="big"
			type="button"
		>
			<Plus aria-hidden="true" class="h-5 w-5" />
			New Account
		</MButton>

		<MModal :show="showForm" @close="showForm = false">
			<AccountForm :account="editingAccount" :length="accounts.length" @close="showForm = false" />
		</MModal>
	</MNavbar>
</template>

<script setup lang="ts">
import type { Account } from '@/lib/account'
import type { Budget } from '@/lib/budget'

import DateHeader from '@/components/DateHeader.vue'
import MButton from '@/components/MButton.vue'
import MNavbar from '@/components/MNavbar.vue'
import AccountForm from '@/components/account/AccountForm.vue'
import AccountItem from '@/components/account/AccountItem.vue'
import MModal from '@/components/form/MModal.vue'
import { ACCOUNTS, BUDGETS, TRANSACTIONS, USERS } from '@/lib/consts'
import { type Transaction, getHistoricalTransactions } from '@/lib/transaction'
import { formatMoney, getAmountColor, icons } from '@/lib/utils'
import { isSameMonth } from 'date-fns'
import { collection } from 'firebase/firestore'
import { Plus, Vault } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'

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

const historicalTransactions = computed(() =>
	getHistoricalTransactions(currentDate.value, allTransactions.value),
)

const balance = computed(() =>
	historicalTransactions.value.reduce((sum, transaction) => {
		if (transaction.operation == 'income') {
			return sum + transaction.amount
		}
		if (transaction.operation == 'expense') {
			return sum - transaction.amount
		}
		return sum
	}, 0),
)

const amountDifference = computed(() => {
	const sumOfCurrentAmounts = accounts.value.reduce(
		(sum, account) => sum + account.currentAmount,
		0,
	)
	return balance.value - sumOfCurrentAmounts
})

function editAccount(account: Account) {
	showForm.value = true
	editingAccount.value = account
}

function getEmptyAccount(): Account {
	return {
		currentAmount: 0,
		icon: icons[1].name,
		id: '',
		name: '',
		order: null,
	}
}

function addAccount() {
	showForm.value = true
	editingAccount.value = getEmptyAccount()
}
</script>
