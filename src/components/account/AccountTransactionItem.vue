<template>
	<li
		:class="[
			SECONDARY_COLOR_TEXT,
			MAIN_HOVER_COLOR_BG,
			MAIN_HOVER_COLOR_TEXT,
			'border-b p-3 hover:underline',
		]"
	>
		<button
			@click="$emit('edit', transaction)"
			class="flex w-full items-center justify-between gap-2 md:gap-5"
		>
			<span class="flex flex-shrink-0 gap-2 whitespace-nowrap">
				<span class="block text-left md:hidden">
					{{ format(transaction.date, 'dd') }}
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
			</span>

			<div class="h-4 w-4 flex-shrink-0">
				<component
					:is="getIcon(transaction.budget.icon)"
					class="h-4 w-4"
					v-if="transaction.budget"
				/>
			</div>

			<span class="flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-left">
				<span v-if="transaction.description">
					{{ transaction.description }}
				</span>
				<span v-else>
					{{ transaction.budget?.name }}
				</span>
				<span v-if="transaction.referenceDate">
					( {{ format(parse(transaction.referenceDate, DATE, new Date()), 'MM.yy') }} )
				</span>
			</span>

			<span
				:class="[
					'flex flex-shrink-0 items-center gap-2 whitespace-nowrap',
					getTransactionAmountColor(),
				]"
			>
				<ArrowRightLeft class="h-5 w-5" v-if="transaction.operation === 'transfer'" />
				{{ formatAmount() }}
			</span>
		</button>
	</li>
</template>

<script setup lang="ts">
import {
	DATE,
	MAIN_HOVER_COLOR_BG,
	MAIN_HOVER_COLOR_TEXT,
	SECONDARY_COLOR_TEXT,
} from '@/lib/consts'
import { type Transaction, parseAmount } from '@/lib/transaction'
import { getAmountColor, getIcon } from '@/lib/utils'
import { format, parse } from 'date-fns'
import { ArrowRightLeft, CalendarCheck, Clock } from 'lucide-vue-next'

const props = defineProps<{ accountId: string; transaction: Transaction }>()

function getTransactionAmountColor() {
	if (props.transaction.isPaid) {
		return getAmountColor(parseAmount(props.transaction, props.accountId))
	}
}

function formatAmount() {
	const amountInCents = parseAmount(props.transaction, props.accountId)
	const decimals = amountInCents / 100
	return `$${decimals > 0 ? '+' : ''}${decimals.toFixed(2)}`
}
</script>
