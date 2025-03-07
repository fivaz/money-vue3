<template>
	<MNavbar>
		<div class="mb-2 flex flex-col items-center justify-between">
			<DateHeader v-model="currentDate"></DateHeader>
			<h2 class="text-sm font-semibold leading-6">
				<span
					:class="[
						'text-sm font-medium leading-6',
						getAmountColor(balanceDifferenceSourcesAndTransactions),
					]"
					v-if="isSameMonth(currentDate, new Date())"
				>
					({{ formatMoney(balanceDifferenceSourcesAndTransactions) }})
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
					:budgets="orderedBudgets"
					:currentDate="currentDate"
					:historicalTransactions="historicalTransactions"
					@edit-account="(a) => editAccount(a)"
				/>
			</li>
		</ul>

		<div :class="['pt-10 text-center', SECONDARY_COLOR_TEXT]" v-if="accounts.length === 0">
			<Vault class="mx-auto h-16 w-16" />
			<h3 class="mt-2 text-sm font-semibold">No Account</h3>
			<p class="mt-1 text-sm">Get started by creating your first account.</p>
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

		<AccountForm
			:account="editingAccount"
			:length="accounts.length"
			:show="showForm"
			@close="showForm = false"
		/>
	</MNavbar>
</template>

<script setup lang="ts">
import type { Budget } from '@/lib/budget'
import type { Source } from '@/lib/source'

import DateHeader from '@/components/DateHeader.vue'
import MButton from '@/components/MButton.vue'
import MNavbar from '@/components/MNavbar.vue'
import AccountForm from '@/components/account/AccountForm.vue'
import AccountItem from '@/components/account/AccountItem.vue'
import { type Account } from '@/lib/account'
import { ACCOUNTS, BUDGETS, SECONDARY_COLOR_TEXT, SOURCES, TRANSACTIONS, USERS } from '@/lib/consts'
import { type Transaction, getBalance, getHistoricalTransactions } from '@/lib/transaction'
import { formatMoney, getAmountColor, uniqueIcons } from '@/lib/utils'
import { isSameMonth } from 'date-fns'
import { collection, query, where } from 'firebase/firestore'
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
const sources = useCollection<Source>(collection(db, USERS, user.value!.uid, SOURCES))
const allTransactions = useCollection<Transaction>(
	query(collection(db, USERS, user.value!.uid, TRANSACTIONS), where('isDeleted', '==', null)),
	{
		ssrKey: 'not-using-ssr-key-it-will-be-fixed-in-a-newer-version-of-the-lib',
	},
)

const historicalTransactions = computed(() =>
	getHistoricalTransactions(currentDate.value, allTransactions.value),
)

const balance = computed(() => getBalance(historicalTransactions.value))

const balanceDifferenceSourcesAndTransactions = computed(() => {
	const sumOfSourceBalances = sources.value.reduce((sum, source) => sum + source.balance, 0)
	//Math.abs is necessary cause balance is most likely a negative number when expense transactions surpass income transactions
	return sumOfSourceBalances - Math.abs(balance.value)
})

const orderedBudgets = computed(() =>
	[...budgets.value].sort((a, b) => (a.order || Infinity) - (b.order || Infinity)),
)

function editAccount(account: Account) {
	showForm.value = true
	editingAccount.value = account
}

function getEmptyAccount(): Account {
	return {
		createdAt: new Date().toISOString(),
		icon: uniqueIcons[1].name,
		id: '',
		isAnnual: false,
		name: '',
		order: null,
	}
}

function addAccount() {
	showForm.value = true
	editingAccount.value = getEmptyAccount()
}
</script>
