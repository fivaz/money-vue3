<template>
	<ModalForm
		:show="show"
		:title="transaction.id ? 'Edit annual transaction' : 'Add annual transaction'"
		@close="$emit('close')"
	>
		<form @submit.prevent="submitForm" class="flex w-[320px] flex-col gap-5">
			<div class="grid grid-cols-5 gap-5">
				<MoneyInput
					class="col-span-2"
					label="Amount"
					type="number"
					v-model="transactionIn.amount"
				/>

				<LabelInput
					class="col-span-3"
					label="Date"
					type="datetime-local"
					v-model="transactionIn.date"
				/>
			</div>

			<div class="grid grid-cols-5 items-end gap-5">
				<MSelect
					by="id"
					class="col-span-3"
					label="Budgets"
					v-if="budgets.length"
					v-model="transactionIn.budget"
				>
					<template v-slot:placeholder>
						<div class="flex items-center gap-2">
							<component
								:is="getIcon(transactionIn.budget.icon)"
								class="h-4 w-4"
								v-if="transactionIn.budget"
							/>
							<span class="block w-[calc(100%-16px)] truncate">
								{{ transactionIn.budget?.name || 'no budget selected' }}
							</span>
						</div>
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
						<span class="flex-1 truncate">{{ budget.name }}</span>
					</SelectItem>
				</MSelect>
				<div v-else>
					<span class="block text-sm font-medium leading-6"> Account </span>
					<span class="text-sm text-red-500">no budgets created yet</span>
				</div>

				<label class="col-span-2 flex gap-2 pb-2">
					is paid
					<MToggle v-model="transactionIn.isPaid" />
				</label>
			</div>

			<div class="grid grid-cols-2 gap-5" v-if="accounts.length">
				<MSelect class="col-span-1" label="Origin" v-model="transactionIn.account">
					<template v-slot:placeholder>
						<div class="flex items-center gap-2">
							<component
								:is="getIcon(transactionIn.account.icon)"
								class="h-4 w-4"
								v-if="transactionIn.account"
							/>
							<span class="block w-[calc(100%-16px)] truncate">
								{{ transactionIn.account?.name || 'no account selected' }}
							</span>
						</div>
					</template>

					<SelectItem
						:key="account.id"
						:value="account"
						by="id"
						class="flex items-center gap-2"
						v-for="account in accounts"
					>
						<component :is="getIcon(account.icon)" class="h-4 w-4" />
						<span class="flex-1 truncate">{{ account.name }}</span>
					</SelectItem>
				</MSelect>

				<MSelect class="grid-cols-1" label="Money source" v-model="transactionIn.annualSource">
					<template v-slot:placeholder>
						<div class="flex items-center gap-2">
							<component
								:is="getIcon(transactionIn.annualSource?.icon)"
								class="h-4 w-4"
								v-if="transactionIn.annualSource"
							/>
							<span class="flex-1 truncate">
								{{ transactionIn.annualSource?.name || 'no source selected' }}
							</span>
						</div>
					</template>

					<SelectItem
						:key="account.id"
						:value="account"
						by="id"
						class="flex items-center gap-2"
						v-for="account in accounts"
					>
						<component :is="getIcon(account.icon)" class="h-4 w-4" />
						<span class="flex-1 truncate">{{ account.name }}</span>
					</SelectItem>
				</MSelect>
			</div>

			<div v-else>
				<span class="block text-sm font-medium leading-6">Account</span>
				<span class="text-sm text-red-500">no accounts created yet</span>
			</div>

			<div>
				<label class="block text-sm font-medium leading-6" for="description">Description</label>
				<textarea
					class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-white/5 dark:ring-white/10 dark:focus:ring-indigo-500"
					id="description"
					name="description"
					v-model="transactionIn.description"
				/>
			</div>

			<div class="flex flex-col gap-2 rounded-lg border p-2">
				<div
					class="flex flex-grow gap-1 text-start text-sm font-medium leading-6"
					v-if="transaction.operation === 'expense'"
				>
					<span class="text-red-500">{{ formatMoney(transactionIn.amount / 12) }}</span>
					<span>will be transferred every month</span>
				</div>
				<div class="text-sm font-medium leading-6" v-else>Recurring</div>

				<div class="grid grid-cols-2 gap-5">
					<LabelInput label="From" required type="Date" v-model="transactionIn.startDate" />
					<LabelInput label="To" required type="Date" v-model="transactionIn.endDate" />
				</div>
			</div>

			<div :class="['flex', transaction.id ? 'justify-between' : 'justify-end']">
				<MButton
					:disabled="transaction.operation === 'transfer'"
					@click="handleDelete"
					color="white"
					size="big"
					type="button"
					v-if="transaction.id"
				>
					Delete
				</MButton>
				<MButton
					:disabled="transaction.operation === 'transfer'"
					color="indigo"
					size="big"
					type="submit"
				>
					Save
				</MButton>
			</div>
		</form>
	</ModalForm>
</template>

<script setup lang="ts">
import type { Account } from '@/lib/account'
import type { Budget } from '@/lib/budget'

import MButton from '@/components/MButton.vue'
import ModalForm from '@/components/ModalForm.vue'
import MoneyInput from '@/components/MoneyInput.vue'
import LabelInput from '@/components/form/LabelInput.vue'
import MSelect from '@/components/form/MSelect.vue'
import MToggle from '@/components/form/MToggle.vue'
import SelectItem from '@/components/form/SelectItem.vue'
import { DATE, DATETIME_OUT } from '@/lib/consts'
import { usePromptStore } from '@/lib/promptStore'
import { type Transaction } from '@/lib/transaction'
import {
	addTransaction,
	deleteTransaction,
	editTransaction,
	formatDateIn,
	formatDateOut,
} from '@/lib/transaction-form'
import { formatMoney, getIcon } from '@/lib/utils'
import { addMonths, format, getMonth, parseISO, set } from 'date-fns'
import { ref, watch } from 'vue'
import { useCurrentUser, useFirestore } from 'vuefire'

const props = defineProps<{
	accounts: Account[]
	budgets: Budget[]
	show: boolean
	transaction: Transaction
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const user = useCurrentUser()
const db = useFirestore()
const store = usePromptStore()

const transactionIn = ref<Transaction>(formatDateIn(props.transaction))

watch([() => props.transaction, () => props.show], ([newValue]) => {
	transactionIn.value = formatDateIn(newValue)
})

watch(
	() => transactionIn.value.startDate,
	(startDate) => {
		if (startDate) {
			transactionIn.value.endDate = format(addMonths(new Date(startDate), 12), DATE)
		}
	},
)

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
			title: 'Delete transaction',
		})
	)
		if (transactionIn.value.id) {
			deleteTransaction(db, transactionIn.value.id, user.value!.uid)
			emit('close')
		}
}
</script>
