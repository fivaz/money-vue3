<template>
	<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
		{{ transaction.id ? 'Edit Transaction' : 'Add Transaction' }}
	</DialogTitle>
	<form @submit.prevent="submitForm" class="mt-2 flex flex-col gap-5">
		<div class="flex justify-center">
			<fieldset aria-label="Payment operation">
				<RadioGroup
					v-model="operation"
					class="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
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
		<div>
			<label for="amount" class="block text-sm font-medium leading-6 text-gray-900">Amount</label>
			<input
				type="number"
				name="amount"
				id="amount"
				step=".01"
				v-model="transactionData.amount"
				required
				class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
			/>
		</div>

		<div>
			<label for="date" class="block text-sm font-medium leading-6 text-gray-900"> Date </label>
			<input
				type="datetime-local"
				name="date"
				id="date"
				required
				class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				v-model="transactionData.date"
			/>
		</div>

		<Select v-model="transactionData.budget" :list="budgets" />

		<div>
			<label for="description" class="block text-sm font-medium leading-6 text-gray-900">
				Description
			</label>
			<textarea
				v-model="transactionData.description"
				id="description"
				name="description"
				rows="3"
				class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
			/>
		</div>

		<div class="flex justify-between">
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
import { defineEmits, ref, watch } from 'vue'
import {
	addTransaction,
	deleteTransaction,
	editTransaction,
	formatDateIn,
	formatDateOut,
	type TransactionData,
	type Transaction,
} from '@/lib/transactions'
import { useCurrentUser, useFirestore } from 'vuefire'
import { DialogTitle, RadioGroup, RadioGroupOption } from '@headlessui/vue'
import type { Budget } from '@/lib/budget'
import Select from '@/components/Select.vue'

const props = defineProps<{
	budgets: Budget[]
	transaction: Transaction
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const { id, ...data } = props.transaction

const firstBudgetId = props.transaction.budget.id

const transactionData = ref<TransactionData>(formatDateIn(data))

type Operation = 'expense' | 'income'

const operations: Operation[] = ['expense', 'income']

const operation = ref<Operation>(data.amount >= 0 ? 'income' : 'expense')

const user = useCurrentUser()
const db = useFirestore()

watch(operation, () => {
	transactionData.value.amount =
		operation.value === 'expense'
			? -Math.abs(transactionData.value.amount)
			: Math.abs(transactionData.value.amount)
})

watch(
	() => transactionData.value.amount,
	(amount) => {
		operation.value = amount >= 0 ? 'income' : 'expense'
	},
)

function submitForm() {
	const formattedTransactionData = formatDateOut(transactionData.value)

	if (id) {
		void editTransaction(db, formattedTransactionData, id, firstBudgetId, user.value!.uid)
	} else {
		void addTransaction(db, formattedTransactionData, firstBudgetId, user.value!.uid)
	}
	emit('close')
}

function handleDelete() {
	if (id) {
		deleteTransaction(db, user.value!.uid, firstBudgetId, id)
		emit('close')
	}
}
</script>
