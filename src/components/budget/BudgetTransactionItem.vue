<template>
	<li class="border-b p-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:underline">
		<button class="flex w-full justify-between" @click="$emit('edit', transaction)">
			<span class="flex gap-4">
				<span>{{ format(transaction.date, SHORT_DATETIME_FR) }}</span>
				<span>{{ transaction.description }}</span>
			</span>
			<span class="flex items-center gap-2">
				<ArrowRightLeft v-if="transaction.operation === 'transfer'" class="h-5 w-5" />
				{{ formatMoney(transaction.amount) }}
			</span>
		</button>
	</li>
</template>

<script setup lang="ts">
import { type Transaction } from '@/lib/transaction'
import { SHORT_DATETIME_FR } from '@/lib/consts'
import { format } from 'date-fns'
import { formatMoney } from '@/lib/utils'
import { ArrowRightLeft } from 'lucide-vue-next'

defineProps<{ transaction: Transaction }>()
</script>
