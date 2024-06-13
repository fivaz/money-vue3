<template>
	<li
		class="overflow-hidden rounded-md bg-white px-6 py-4 text-sm leading-6 text-gray-500 shadow hover:bg-gray-50 hover:text-gray-700 hover:underline"
	>
		<button class="flex w-full justify-between" @click="$emit('edit', transaction)">
			<span class="flex gap-4">
				<span>{{ format(transaction.date, DATETIME_FR) }}</span>
				<span>{{ transaction.description }}</span>
			</span>
			<span :class="transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'">{{
				formatMoney(transaction.amount)
			}}</span>
		</button>
	</li>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { DATETIME_FR } from '@/lib/consts'
import { formatMoney } from '@/lib/utils'
import type { Transaction } from '@/lib/transaction'

defineProps<{ transaction: Transaction }>()
</script>
