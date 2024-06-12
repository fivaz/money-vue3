<template>
	<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
		{{ transaction.id ? 'Edit Transaction' : 'Add Transaction' }}
	</DialogTitle>
	<form @submit.prevent="submitForm">
		<div class="space-y-12">
			<div class="border-b border-gray-900/10 pb-12">
				<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
					<div class="sm:col-span-full">
						<label for="amount" class="block text-sm font-medium leading-6 text-gray-900">
							Amount
						</label>
						<div class="mt-2">
							<div
								class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
							>
								<input
									type="number"
									name="amount"
									id="amount"
									v-model="transactionIn.amount"
									class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
					</div>

					<div class="sm:col-span-full">
						<label for="amount" class="block text-sm font-medium leading-6 text-gray-900">
							Date
						</label>
						<div class="mt-2">
							<div
								class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
							>
								<input
									type="datetime-local"
									name="date"
									id="date"
									class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
									v-model="transactionIn.date"
								/>
							</div>
						</div>
					</div>
					<div class="sm:col-span-full">
						<label for="description" class="block text-sm font-medium leading-6 text-gray-900">
							Description
						</label>
						<div class="mt-2">
							<div
								class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
							>
								<textarea
									v-model="transactionIn.description"
									id="description"
									name="description"
									rows="3"
									class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-6 flex items-center justify-end gap-x-6">
			<button
				@click="$emit('close')"
				type="button"
				class="text-sm font-semibold leading-6 text-gray-900"
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
	editTransaction,
	hasId,
	parseTransaction,
	type TransactionIn,
} from '@/lib/transactions'
import { useCurrentUser, useFirestore } from 'vuefire'
import { DialogTitle } from '@headlessui/vue'

const { transaction, budgetId } = defineProps<{
	budgetId: string
	transaction: TransactionIn
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const transactionIn = ref<TransactionIn>({ ...transaction })

const user = useCurrentUser()
const db = useFirestore()

function submitForm() {
	const parsedTransaction = parseTransaction(transactionIn.value)

	if (hasId(parsedTransaction)) {
		void editTransaction(db, parsedTransaction, budgetId, user.value!.uid)
	} else {
		void addTransaction(db, parsedTransaction, budgetId, user.value!.uid)
	}
	emit('close')
}
</script>
