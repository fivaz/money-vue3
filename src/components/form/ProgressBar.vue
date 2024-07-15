<template>
	<div class="relative mt-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
		<span class="absolute right-3 text-xs">{{ formatMoney(budget.value) }}</span>
		<div
			:class="[
				'relative z-10 h-4 rounded-full text-white',
				percentage > 100 ? 'bg-red-600' : 'bg-indigo-600',
			]"
			:style="{ width: computedWidth }"
		>
			<span class="absolute right-3 text-xs">{{ formatMoney(spent) }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Budget } from '@/lib/budget'
import type { Transaction } from '@/lib/transaction'

import { formatMoney } from '@/lib/utils'
import { computed } from 'vue'

const props = defineProps<{ budget: Budget; transactions: Transaction[] }>()

const spent = computed(() =>
	props.transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
)

const percentage = computed(() => (spent.value / props.budget.value) * 100)

const computedWidth = computed(() => `${Math.min(percentage.value, 100)}%`)
</script>
