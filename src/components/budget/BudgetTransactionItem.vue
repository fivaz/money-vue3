<template>
	<li
		class="border-b p-3 text-slate-500 hover:bg-gray-50 hover:text-slate-700 hover:underline dark:text-slate-400 dark:hover:bg-slate-900"
	>
		<button @click="$emit('edit', transaction)" class="flex w-full justify-between">
			<span class="flex gap-4">
				<span>{{ format(transaction.date, SHORT_DATETIME_FR) }}</span>
				<span>{{ transaction.description }}</span>
			</span>
			<span class="flex items-center gap-2">
				<ArrowRightLeft class="h-5 w-5" v-if="transaction.operation === 'transfer'" />
				{{ formatMoney(transaction.amount) }}
			</span>
		</button>
	</li>
</template>

<script setup lang="ts">
import { SHORT_DATETIME_FR } from '@/lib/consts'
import { type Transaction } from '@/lib/transaction'
import { formatMoney } from '@/lib/utils'
import { format } from 'date-fns'
import { ArrowRightLeft } from 'lucide-vue-next'

defineProps<{ transaction: Transaction }>()
</script>
