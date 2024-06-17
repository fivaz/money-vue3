<template>
	<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
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
						v-for="operationObject in operationsObject"
						:key="operationObject.operation"
						:value="operationObject.operation"
						v-slot="{ checked }"
					>
						<div
							:class="[
								checked ? 'bg-indigo-600 text-white' : 'text-gray-500',
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
				<LabelInput v-model="transactionIn.amount" name="amount" />
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

		<div class="flex items-end gap-5">
			<Select
				v-if="budgets.length"
				v-model="transactionIn.budget"
				title="Budgets"
				by="id"
				class="grow"
			>
				<template v-slot:placeholder>
					<span class="block truncate">
						{{ transactionIn.budget?.name || 'no budget selected' }}
					</span>
				</template>
				<SelectItem
					v-for="budget in budgets"
					:key="budget.id"
					:value="budget"
					class="flex items-center gap-2"
				>
					<component :is="getIcon(budget.icon)" class="h-4 w-4" />
					<span>{{ budget.name }}</span>
				</SelectItem>
			</Select>
			<span v-else class="text-sm text-red-500">no budgets created yet</span>
			<label class="flex gap-2 pb-2">
				is paid
				<Toggle v-model="transactionIn.isPaid" />
			</label>
		</div>
		<div class="grid grid-cols-2 gap-5">
			<Select
				:class="transactionIn.operation === 'transfer' ? 'col-span-1' : 'col-span-2'"
				v-model="transactionIn.account"
				title="Origin"
			>
				<template v-slot:placeholder>
					<span class="block truncate">
						{{ transactionIn.account?.name || 'no account selected' }}
					</span>
				</template>

				<SelectItem
					v-for="account in accounts"
					:key="account.id"
					:value="account"
					by="id"
					class="flex items-center gap-2"
				>
					<component :is="getIcon(account.icon)" class="h-4 w-4" />
					<span>{{ account.name }}</span>
				</SelectItem>
			</Select>

			<Select
				class="grid-cols-1"
				v-if="transactionIn.operation === 'transfer'"
				v-model="transactionIn.destination"
				title="Destination"
			>
				<template v-slot:placeholder>
					<span class="block truncate">
						{{ transactionIn.destination?.name || 'no destination selected' }}
					</span>
				</template>

				<SelectItem
					v-for="account in accounts"
					:key="account.id"
					:value="account"
					by="id"
					class="flex items-center gap-2"
				>
					<component :is="getIcon(account.icon)" class="h-4 w-4" />
					<span>{{ account.name }}</span>
				</SelectItem>
			</Select>
		</div>

		<div>
			<label for="description" class="block text-sm font-medium leading-6 text-gray-900">
				Description
			</label>
			<textarea
				v-model="transactionIn.description"
				id="description"
				name="description"
				class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
			/>
		</div>

		<div class="flex flex-col gap-2 rounded-lg border bg-white p-2">
			<div class="flex items-center justify-between">
				<button
					class="flex flex-grow text-start text-sm font-medium leading-6 text-gray-900"
					type="button"
					@click="
						() => {
							if (isRecurring) {
								isRecurringOpen = !isRecurringOpen
							} else {
								isRecurring = true
							}
						}
					"
				>
					is Recurring
				</button>
				<Switch
					v-model="isRecurring"
					:class="[
						isRecurring ? 'bg-indigo-600' : 'bg-gray-200',
						'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
					]"
				>
					<span
						:class="[
							isRecurring ? 'translate-x-5' : 'translate-x-0',
							'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
						]"
					>
						<span
							:class="[
								isRecurring
									? 'opacity-0 duration-100 ease-out'
									: 'opacity-100 duration-200 ease-in',
								'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
							]"
							aria-hidden="true"
						>
							<svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
								<path
									d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</span>
						<span
							:class="[
								isRecurring
									? 'opacity-100 duration-200 ease-in'
									: 'opacity-0 duration-100 ease-out',
								'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
							]"
							aria-hidden="true"
						>
							<svg class="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
								<path
									d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
								/>
							</svg>
						</span>
					</span>
				</Switch>
			</div>

			<transition
				enter-active-class="transition duration-300 ease-out"
				enter-from-class="transform scale-95 opacity-0"
				enter-to-class="transform scale-100 opacity-100"
				leave-active-class="transition duration-300 ease-out"
				leave-from-class="transform scale-100 opacity-100"
				leave-to-class="transform scale-95 opacity-0"
			>
				<div v-if="isRecurringOpen" class="grid grid-cols-2 gap-5">
					<div class="col-span-1">
						<label for="date" class="block text-sm font-medium leading-6 text-gray-900">
							Start date
						</label>
						<input
							v-model="transactionIn.startDate"
							required
							type="date"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
					<div class="col-span-1">
						<label for="date" class="block text-sm font-medium leading-6 text-gray-900">
							End date
						</label>
						<input
							v-model="transactionIn.endDate"
							required
							type="date"
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
					</div>
				</div>
			</transition>
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
import { ref, watch } from 'vue'
import {
	addTransaction,
	deleteTransaction,
	editTransaction,
	formatDateIn,
	formatDateOut,
	type Transaction,
} from '@/lib/transaction'
import { useCurrentUser, useFirestore } from 'vuefire'
import { DialogTitle, RadioGroup, RadioGroupOption, Switch } from '@headlessui/vue'
import type { Budget } from '@/lib/budget'
import Select from '@/components/Select.vue'
import type { Account } from '@/lib/account'
import SelectItem from '@/components/SelectItem.vue'
import { getIcon } from '@/lib/utils'
import { ArrowLeftFromLine, ArrowLeftRight, ArrowRightToLine } from 'lucide-vue-next'
import { format, getMonth, parseISO, set } from 'date-fns'
import { DATETIME_OUT } from '@/lib/consts'
import Toggle from '@/components/Toggle.vue'

const props = defineProps<{
	budgets: Budget[]
	accounts: Account[]
	transaction: Transaction
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const transactionIn = ref<Transaction>(formatDateIn(props.transaction))

const user = useCurrentUser()
const db = useFirestore()

const isRecurring = ref(!!(props.transaction.startDate && props.transaction.endDate))
const isRecurringOpen = ref(false)

const operationsObject = [
	{ operation: 'expense', icon: ArrowLeftFromLine },
	{ operation: 'transfer', icon: ArrowLeftRight },
	{ operation: 'income', icon: ArrowRightToLine },
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

function handleDelete() {
	if (transactionIn.value.id) {
		deleteTransaction(db, transactionIn.value.id, user.value!.uid)
		emit('close')
	}
}
</script>
