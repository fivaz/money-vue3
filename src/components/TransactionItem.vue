<template>
	<li class="py-3 text-gray-500">
		<button class="flex w-full justify-between gap-x-4" @click="$emit('edit', transaction)">
			<span>{{ format(transaction.date, DATETIME_FR) }}</span>
			<span>{{ transaction.description }}</span>
			<span>{{ formatMoney(transaction.amount) }}</span>
		</button>
	</li>
</template>

<script setup lang="ts">
import type { Transaction } from '@/lib/transactions'
import { formatMoney } from '@/lib/utils'
import { DATETIME_FR } from '@/lib/consts'
import { format } from 'date-fns'

defineProps<{ transaction: Transaction }>()
</script>
