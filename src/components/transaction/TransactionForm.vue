<template>
	<form @submit.prevent="submitForm" class="flex w-[320px] flex-col gap-5">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-medium leading-6">
				{{ transaction.id ? 'Edit Transaction' : 'Add Transaction' }}
			</h3>
			<button
				@click="$emit('close')"
				class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				type="button"
			>
				<span class="sr-only">Close</span>
				<XMarkIcon aria-hidden="true" class="h-6 w-6" />
			</button>
		</div>

		<div class="flex justify-center">
			<fieldset aria-label="transaction operation">
				<RadioGroup
					class="grid grid-cols-3 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
					v-model="transactionIn.operation"
				>
					<RadioGroupOption
						:key="operationObject.operation"
						:value="operationObject.operation"
						as="template"
						v-for="operationObject in operationsObject"
						v-slot="{ checked }"
					>
						<div
							:class="[
								checked ? 'bg-indigo-600 text-white' : 'text-gray-500 dark:text-gray-200',
								'flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1',
							]"
						>
							<component :is="operationObject.icon" class="h-4 w-4" />
							<span>{{ operationObject.operation }}</span>
						</div>
					</RadioGroupOption>
				</RadioGroup>
			</fieldset>
		</div>

		<div class="grid grid-cols-5 gap-5">
			<div class="col-span-2">
				<LabelInput label="Amount" step="0.01" type="number" v-model="transactionIn.amount" />
			</div>
			<div class="col-span-3">
				<LabelInput
					class="col-span-3"
					label="Date"
					type="datetime-local"
					v-model="transactionIn.date"
				/>
			</div>
		</div>

		<div class="flex items-end gap-5">
			<MSelect
				by="id"
				class="grow"
				label="Budgets"
				v-if="budgets.length"
				v-model="transactionIn.budget"
			>
				<template v-slot:placeholder>
					<span class="block truncate">
						{{ transactionIn.budget?.name || 'no budget selected' }}
					</span>
				</template>
				<SelectItem :value="null" class="flex items-center gap-2">
					<span>no budget</span>
				</SelectItem>
				<SelectItem
					:key="budget.id"
					:value="budget"
					class="flex items-center gap-2"
					v-for="budget in budgets"
				>
					<component :is="getIcon(budget.icon)" class="h-4 w-4" />
					<span>{{ budget.name }}</span>
				</SelectItem>
			</MSelect>
			<div v-else>
				<span class="block text-sm font-medium leading-6"> Account </span>
				<span class="text-sm text-red-500">no budgets created yet</span>
			</div>

			<label class="flex gap-2 pb-2">
				is paid
				<MToggle v-model="transactionIn.isPaid" />
			</label>
		</div>
		<div class="grid grid-cols-2 gap-5" v-if="accounts.length">
			<MSelect
				:class="transactionIn.operation === 'transfer' ? 'col-span-1' : 'col-span-2'"
				label="Origin"
				v-model="transactionIn.account"
			>
				<template v-slot:placeholder>
					<span class="block truncate">
						{{ transactionIn.account?.name || 'no account selected' }}
					</span>
				</template>

				<SelectItem
					:key="account.id"
					:value="account"
					by="id"
					class="flex items-center gap-2"
					v-for="account in accounts"
				>
					<component :is="getIcon(account.icon)" class="h-4 w-4" />
					<span>{{ account.name }}</span>
				</SelectItem>
			</MSelect>

			<MSelect
				class="grid-cols-1"
				label="Destination"
				v-if="transactionIn.operation === 'transfer'"
				v-model="transactionIn.destination"
			>
				<template v-slot:placeholder>
					<span class="block truncate">
						{{ transactionIn.destination?.name || 'no destination selected' }}
					</span>
				</template>

				<SelectItem
					:key="account.id"
					:value="account"
					by="id"
					class="flex items-center gap-2"
					v-for="account in accounts"
				>
					<component :is="getIcon(account.icon)" class="h-4 w-4" />
					<span>{{ account.name }}</span>
				</SelectItem>
			</MSelect>
		</div>

		<div v-else>
			<span class="block text-sm font-medium leading-6"> Account </span>
			<span class="text-sm text-red-500">no accounts created yet</span>
		</div>

		<div>
			<label class="block text-sm font-medium leading-6" for="description"> Description </label>
			<textarea
				class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-white/5 dark:ring-white/10 dark:focus:ring-indigo-500"
				id="description"
				name="description"
				v-model="transactionIn.description"
			/>
		</div>

		<div class="flex flex-col gap-2 rounded-lg border p-2">
			<div class="flex items-center justify-between">
				<button
					@click="
						() => {
							if (isRecurring) {
								isRecurringOpen = !isRecurringOpen
							} else {
								isRecurring = true
							}
						}
					"
					class="flex flex-grow text-start text-sm font-medium leading-6"
					type="button"
				>
					Recurring
				</button>
				<MToggle v-model="isRecurring" />
			</div>

			<transition
				enter-active-class="transition duration-300 ease-out"
				enter-from-class="transform scale-95 opacity-0"
				enter-to-class="transform scale-100 opacity-100"
				leave-active-class="transition duration-300 ease-out"
				leave-from-class="transform scale-100 opacity-100"
				leave-to-class="transform scale-95 opacity-0"
			>
				<div class="grid grid-cols-2 gap-5" v-if="isRecurringOpen">
					<LabelInput label="Start date" required type="Date" v-model="transactionIn.startDate" />
					<LabelInput label="End Date" required type="Date" v-model="transactionIn.endDate" />
				</div>
			</transition>
		</div>

		<div :class="['flex', transaction.id ? 'justify-between' : 'justify-end']">
			<MButton @click="handleDelete" color="white" size="big" type="button" v-if="transaction.id">
				Delete
			</MButton>
			<MButton color="indigo" size="big" type="submit"> Save </MButton>
		</div>
	</form>
</template>

<script setup lang="ts">
import type { Account } from '@/lib/account'
import type { Budget } from '@/lib/budget'

import MButton from '@/components/MButton.vue'
import LabelInput from '@/components/form/LabelInput.vue'
import MSelect from '@/components/form/MSelect.vue'
import MToggle from '@/components/form/MToggle.vue'
import SelectItem from '@/components/form/SelectItem.vue'
import { DATETIME_OUT } from '@/lib/consts'
import { usePromptStore } from '@/lib/promptStore'
import {
	type Transaction,
	addTransaction,
	deleteTransaction,
	editTransaction,
	formatDateIn,
	formatDateOut,
} from '@/lib/transaction'
import { getIcon } from '@/lib/utils'
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { format, getMonth, parseISO, set } from 'date-fns'
import { ArrowLeftFromLine, ArrowLeftRight, ArrowRightToLine } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { useCurrentUser, useFirestore } from 'vuefire'

const props = defineProps<{
	accounts: Account[]
	budgets: Budget[]
	transaction: Transaction
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const transactionIn = ref<Transaction>(formatDateIn(props.transaction))

const user = useCurrentUser()
const db = useFirestore()
const store = usePromptStore()

const isRecurring = ref(!!(props.transaction.startDate && props.transaction.endDate))
const isRecurringOpen = ref(false)

const operationsObject = [
	{ icon: ArrowLeftFromLine, operation: 'expense' },
	{ icon: ArrowLeftRight, operation: 'transfer' },
	{ icon: ArrowRightToLine, operation: 'income' },
]

watch(
	() => transactionIn.value.startDate,
	(startDate) => {
		if (startDate) {
			transactionIn.value.date = format(
				set(parseISO(transactionIn.value.date), {
					month: getMonth(new Date(startDate)),
				}),
				DATETIME_OUT,
			)
		}
	},
)

function submitForm() {
	const formattedTransaction = formatDateOut(transactionIn.value)

	if (formattedTransaction.id) {
		void editTransaction(db, formattedTransaction, user.value!.uid)
	} else {
		void addTransaction(db, formattedTransaction, user.value!.uid)
	}
	emit('close')
}

async function handleDelete() {
	if (
		await store.createPrompt({
			cancelText: 'Cancel',
			confirmText: 'Delete',
			message: 'Are you sure you want to delete this transaction ?',
			title: 'Delete Transaction',
		})
	)
		if (transactionIn.value.id) {
			deleteTransaction(db, transactionIn.value.id, user.value!.uid)
			emit('close')
		}
}
</script>
