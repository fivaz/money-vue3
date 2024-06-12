<template>
	<div class="relative mt-2 overflow-hidden rounded-full bg-gray-200">
		<span class="absolute right-3 text-xs">{{ formatMoney(budget.value) }}</span>
		<div class="relative z-10 h-4 rounded-full bg-indigo-600" :style="`width: ${percentage}%`">
			<span class="absolute right-3 text-xs text-white">{{ formatMoney(spent) }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Budget } from '@/lib/budget'
import { computed } from 'vue'
import { formatMoney } from '@/lib/utils'

const { budget, spent } = defineProps<{ spent: number; budget: Budget }>()

const percentage = computed(() => ((spent / budget.value) * 100).toFixed(0))
</script>
