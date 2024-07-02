<template>
	<Navbar>
		<div class="mb-2 flex flex-col items-center justify-between">
			<DateHeader v-model="currentDate"></DateHeader>
			<h2 class="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
				{{ formatMoney(balance) }}
			</h2>
		</div>

		<ul role="list" class="flex flex-col gap-5">
			<li
				:style="{ order: account.order || accounts.length }"
				v-for="account in accounts"
				:key="account.id"
			>
				<AccountItem
					:account="account"
					:historicalTransactions="historicalTransactions"
					:accounts="accounts"
					:budgets="budgets"
					:currentDate="currentDate"
					@edit-account="(a) => editAccount(a)"
				/>
			</li>
		</ul>

		<div v-if="accounts.length === 0" class="pt-10 text-center">
			<Vault class="mx-auto h-16 w-16 text-gray-400" />
			<h3 class="mt-2 text-sm font-semibold text-slate-900 dark:text-white">No Account</h3>
			<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
				Get started by creating your first account.
			</p>
			<div class="mt-6 flex justify-center">
				<MButton size="big" color="indigo" type="button" @click="addAccount">
					<Plus class="h-5 w-5" aria-hidden="true" />
					New Account
				</MButton>
			</div>
		</div>

		<MButton
			size="big"
			color="indigo"
			type="button"
			@click="addAccount"
			class="absolute bottom-0 right-0 z-10 m-3"
		>
			<Plus class="h-5 w-5" aria-hidden="true" />
			New Account
		</MButton>

		<ModalDialog :show="showForm" @close="showForm = false">
			<AccountForm @close="showForm = false" :account="editingAccount" :length="accounts.length" />
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
import ModalDialog from '@/components/form/Modal.vue'
import Navbar from '@/components/Navbar.vue'
import DateHeader from '@/components/DateHeader.vue'
import type { Budget } from '@/lib/budget'
import { Plus, Vault } from 'lucide-vue-next'
import { getHistoricalTransactions, type Transaction } from '@/lib/transaction'
import { formatMoney, icons } from '@/lib/utils'
import MButton from '@/components/MButton.vue'

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

function editAccount(account: Account) {
	showForm.value = true
	editingAccount.value = account
}

function getEmptyAccount(): Account {
	return {
		id: '',
		name: '',
		icon: icons[1].name,
		order: null,
	}
}

function addAccount() {
	showForm.value = true
	editingAccount.value = getEmptyAccount()
}
</script>
