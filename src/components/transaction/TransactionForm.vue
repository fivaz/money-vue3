<template>
	<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
		{{ transaction.id ? 'Edit Transaction' : 'Add Transaction' }}
	</DialogTitle>
	<form @submit.prevent="submitForm" class="mt-2 flex w-[320px] flex-col gap-5">
		<div class="flex justify-center">
			<fieldset aria-label="transaction operation">
				<RadioGroup
					v-model="transactionIn.operation"
					class="grid grid-cols-3 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
				>
					<RadioGroupOption
						as="template"
						v-for="operation in operations"
						:key="operation"
						:value="operation"
						v-slot="{ checked }"
					>
						<div
							:class="[
								checked ? 'bg-indigo-600 text-white' : 'text-gray-500',
								'cursor-pointer rounded-full px-2.5 py-1',
							]"
						>
							{{ operation }}
						</div>
					</RadioGroupOption>
				</RadioGroup>
			</fieldset>
		</div>

		<div class="grid grid-cols-5 gap-5">
			<div class="col-span-2">
				<label for="amount" class="block text-sm font-medium leading-6 text-gray-900">Amount</label>
				<input
					type="number"
					name="amount"
					id="amount"
					step=".01"
					v-model="transactionIn.amount"
					required
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				/>
			</div>

			<div class="col-span-3">
				<label for="date" class="block text-sm font-medium leading-6 text-gray-900"> Date </label>
				<input
					type="datetime-local"
					name="date"
					id="date"
					required
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					v-model="transactionIn.date"
				/>
			</div>
		</div>

		<Select v-if="budgets.length" v-model="transactionIn.budget" title="Budgets" :list="budgets" />
		<span v-else class="text-sm text-red-500">no budgets created yet</span>

		<div class="grid grid-cols-2 gap-5">
			<Select
				:class="transactionIn.operation === 'transfer' ? 'col-span-1' : 'col-span-2'"
				v-model="transactionIn.account"
				:list="accounts"
				title="Origin"
			/>
			<Select
				class="grid-cols-1"
				v-if="transactionIn.operation === 'transfer'"
				v-model="transactionIn.destination"
				:list="accounts"
				title="Destination"
			/>
		</div>

		<div>
			<label for="description" class="block text-sm font-medium leading-6 text-gray-900">
				Description
			</label>
			<textarea
				v-model="transactionIn.description"
				id="description"
				name="description"
				rows="3"
				class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
			/>
		</div>

		<div :class="['flex', transaction.id ? 'justify-between' : 'justify-end']">
			<button
				v-if="transaction.id"
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
	addTransaction,
	deleteTransaction,
	editTransaction,
	formatDateIn,
	formatDateOut,
	type Operation,
	type Transaction,
} from '@/lib/transaction'
import { useCurrentUser, useFirestore } from 'vuefire'
import { DialogTitle, RadioGroup, RadioGroupOption } from '@headlessui/vue'
import type { Budget } from '@/lib/budget'
import Select from '@/components/Select.vue'
import type { Account } from '@/lib/account'

const props = defineProps<{
	budgets: Budget[]
	accounts: Account[]
	transaction: Transaction
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const transactionIn = ref<Transaction>(formatDateIn(props.transaction))

const user = useCurrentUser()
const db = useFirestore()

const operations: Operation[] = ['expense', 'transfer', 'income']

function submitForm() {
	const formattedTransaction = formatDateOut(transactionIn.value)

	if (formattedTransaction.id) {
		void editTransaction(db, formattedTransaction, user.value!.uid)
	} else {
		void addTransaction(db, formattedTransaction, user.value!.uid)
	}
	emit('close')
}

function handleDelete() {
	if (transactionIn.value.id) {
		deleteTransaction(db, transactionIn.value.id, user.value!.uid)
		emit('close')
	}
}
</script>
