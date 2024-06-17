<template>
	<li class="border-b p-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:underline">
		<button class="flex w-full justify-between" @click="$emit('edit', transaction)">
			<span class="flex items-center gap-4">
				<span class="block w-20 text-left md:hidden">{{
					format(transaction.date, SHORT_DATETIME_FR)
				}}</span>
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
					v-if="transaction.budget"
					:is="getIcon(transaction.budget.icon)"
					class="h-4 w-4"
				/>
			</span>
			<span
				:class="[
					'flex items-center gap-2',
					parseAmount(transaction, accountId) >= 0 ? 'text-green-500' : 'text-red-500',
				]"
			>
				<ArrowRightLeft v-if="transaction.operation === 'transfer'" class="h-5 w-5" />
				{{ formatAmount() }}
			</span>
		</button>
	</li>
</template>

<script setup lang="ts">
import { parseAmount, type Transaction } from '@/lib/transaction'
import { format } from 'date-fns'
import { ArrowRightLeft, Clock, CalendarCheck } from 'lucide-vue-next'
import { getIcon } from '@/lib/utils'
import { SHORT_DATETIME_FR } from '../../lib/consts'

const props = defineProps<{ accountId: string; transaction: Transaction }>()

function formatAmount() {
	const amount = parseAmount(props.transaction, props.accountId)
	return `$${amount > 0 ? '+' : ''}${amount.toFixed(2)}`
}
</script>
