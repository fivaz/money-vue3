<template>
	<li class="py-3 text-gray-500">
		<button class="flex w-full justify-between gap-x-4" @click="$emit('edit', transaction)">
			<span>{{ transaction.date }}</span>
			<span>{{ transaction.description }}</span>
			<span>{{ parseMoney(transaction.amount) }}</span>
		</button>
	</li>
</template>

<script setup lang="ts">
import type { Transaction } from '@/lib/transactions'
import { parseMoney } from '@/lib/utils'

defineProps<{ transaction: Transaction }>()
</script>
