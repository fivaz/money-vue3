<template>
	<li
		class="border-b p-3 text-slate-500 hover:bg-gray-50 hover:text-gray-700 hover:underline dark:text-gray-400 dark:hover:bg-slate-900 dark:hover:text-gray-300"
	>
		<button @click="$emit('edit', transaction)" class="flex w-full justify-between">
			<span class="flex items-center gap-4">
				<span class="block w-20 text-left md:hidden">
					{{ format(transaction.date, SHORT_DATETIME_FR) }}
				</span>
				<span class="hidden gap-2 md:flex">
					<span class="flex w-10 items-center gap-2">
						<CalendarCheck class="h-4 w-4" />
						<span>{{ format(transaction.date, 'dd') }}</span>
					</span>
					<span class="flex w-16 items-center gap-2">
						<Clock class="h-4 w-4" />
						<span>{{ format(transaction.date, 'HH:mm') }}</span>
					</span>
				</span>
				<span v-if="transaction.description">{{ transaction.description }}</span>
				<component
					:is="getIcon(transaction.budget.icon)"
					class="h-4 w-4"
					v-if="transaction.budget"
				/>
			</span>
			<span :class="['flex items-center gap-2', getTransactionAmountColor()]">
				<ArrowRightLeft class="h-5 w-5" v-if="transaction.operation === 'transfer'" />
				{{ formatAmount() }}
			</span>
		</button>
	</li>
</template>

<script setup lang="ts">
import { SHORT_DATETIME_FR } from '@/lib/consts'
import { type Transaction, parseAmount } from '@/lib/transaction'
import { getAmountColor, getIcon } from '@/lib/utils'
import { format } from 'date-fns'
import { ArrowRightLeft, CalendarCheck, Clock } from 'lucide-vue-next'

const props = defineProps<{ accountId: string; transaction: Transaction }>()

function getTransactionAmountColor() {
	if (props.transaction.isPaid) {
		return getAmountColor(parseAmount(props.transaction, props.accountId))
	}
}

function formatAmount() {
	const amount = parseAmount(props.transaction, props.accountId)
	return `$${amount > 0 ? '+' : ''}${amount.toFixed(2)}`
}
</script>
