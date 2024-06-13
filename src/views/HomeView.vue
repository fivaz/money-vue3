<template>
	<Navbar>
		<div class="mb-2 flex flex-col items-center justify-between">
			<DateHeader v-model="currentDate"></DateHeader>
			<!--			<h2 class="text-sm font-semibold leading-6 text-gray-900">-->
			<!--				{{ formatMoney(balance) }}-->
			<!--			</h2>-->
		</div>

		<ul role="list" class="flex flex-col gap-5">
			<AccountItem
				v-for="account in accounts"
				:key="account.id"
				:account="account"
				@edit-account="(a) => editAccount(a)"
				:currentDate="currentDate"
				:accounts="accounts"
				:budgets="budgets"
			/>
		</ul>
		<button
			@click="addAccount"
			type="button"
			class="absolute bottom-0 right-0 z-10 m-3 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		>
			Add Account
		</button>

		<ModalDialog :show="showForm" @close="showForm = false">
			<AccountForm @close="showForm = false" :account="editingAccount" />
		</ModalDialog>
	</Navbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AccountItem from '@/components/account/AccountItem.vue'
import AccountForm from '@/components/account/AccountForm.vue'
import type { Account } from '@/lib/account'
import { collection } from 'firebase/firestore'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'
import { ACCOUNTS, BUDGETS, USERS } from '@/lib/consts'
import ModalDialog from '@/components/Modal.vue'
import Navbar from '@/components/Navbar.vue'
import DateHeader from '@/components/DateHeader.vue'
import type { Budget } from '@/lib/budget'

const currentDate = ref(new Date())

const showForm = ref(false)

const editingAccount = ref<Account>(getEmptyAccount())

const db = useFirestore()
const user = useCurrentUser()

const budgets = useCollection<Budget>(collection(db, USERS, user.value!.uid, BUDGETS))
const accounts = useCollection<Account>(collection(db, USERS, user.value!.uid, ACCOUNTS))

function editAccount(account: Account) {
	showForm.value = true
	editingAccount.value = account
}

function getEmptyAccount(): Account {
	return {
		id: '',
		name: '',
	}
}

function addAccount() {
	showForm.value = true
	editingAccount.value = getEmptyAccount()
}
</script>
