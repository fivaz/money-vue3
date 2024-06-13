<template>
	<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
		{{ account.id ? 'Edit Account' : 'Add Account' }}
	</DialogTitle>
	<form @submit.prevent="submitForm" class="mt-2 flex flex-col gap-5">
		<div>
			<label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
			<input
				type="text"
				name="name"
				id="name"
				v-model="accountData.name"
				required
				class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
			/>
		</div>

		<div class="flex justify-between">
			<button
				v-if="account.id"
				@click="handleDelete"
				type="button"
				class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
				Delete
			</button>
			<button
				type="submit"
				class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
				Save
			</button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue'
import {
	addAccount,
	deleteAccount,
	editAccount,
	type AccountData,
	type Account,
} from '@/lib/account'
import { useCurrentUser, useFirestore } from 'vuefire'
import { DialogTitle } from '@headlessui/vue'

const props = defineProps<{
	account: Account
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const { id, ...data } = props.account

const accountData = ref<AccountData>(data)

const user = useCurrentUser()
const db = useFirestore()

function submitForm() {
	if (id) {
		void editAccount(db, accountData.value, id, user.value!.uid)
	} else {
		void addAccount(db, accountData.value, user.value!.uid)
	}
	emit('close')
}

function handleDelete() {
	if (id) {
		deleteAccount(db, user.value!.uid, id)
		emit('close')
	}
}
</script>
