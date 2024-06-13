<template>
	<Navbar>
		<ul role="list" class="space-y-3">
			<li
				class="overflow-hidden rounded-md px-6 py-4 text-sm leading-6 text-gray-500 shadow hover:bg-gray-50 hover:text-gray-700 hover:underline"
				v-for="account in accounts"
				:key="account.id"
			>
				<button class="w-full text-left" @click="editAccount(account)">
					{{ account.name }}
				</button>
			</li>
		</ul>
		<button
			@click="addAccount"
			type="button"
			class="absolute bottom-0 right-0 z-10 m-3 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
		>
			Add Account
		</button>
		<ModalDialog :show="showForm" @close="showForm = false">
			<AccountForm :account="editedAccount" @close="showForm = false" />
		</ModalDialog>
	</Navbar>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { useCollection, useCurrentUser, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore'
import { ACCOUNTS, USERS } from '@/lib/consts'
import { ref } from 'vue'
import ModalDialog from '@/components/Modal.vue'
import { type Account } from '@/lib/account'
import AccountForm from '@/components/account/AccountForm.vue'

const db = useFirestore()
const user = useCurrentUser()

const accounts = useCollection<Account>(collection(db, USERS, user.value!.uid, ACCOUNTS))

const showForm = ref(false)

const editedAccount = ref<Account>(getEmptyAccount())

function getEmptyAccount(): Account {
	return {
		id: '',
		name: '',
	}
}

function addAccount() {
	showForm.value = true
	editedAccount.value = getEmptyAccount()
}

function editAccount(account: Account) {
	editedAccount.value = account
	showForm.value = true
}
</script>
