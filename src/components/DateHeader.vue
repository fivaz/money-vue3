<template>
	<div class="flex w-full items-center justify-between">
		<button @click="prevMonth"><ChevronLeft /></button>
		<h1
			class="text-base font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
		>
			{{ currentMonth }}
		</h1>
		<button @click="nextMonth"><ChevronRight /></button>
	</div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { addMonths, format, subMonths } from 'date-fns'
import { computed } from 'vue'

const currentDate = defineModel<Date>({ required: true })

const currentMonth = computed(() => format(currentDate.value, 'MMMM'))

function prevMonth() {
	currentDate.value = subMonths(currentDate.value, 1)
}

function nextMonth() {
	currentDate.value = addMonths(currentDate.value, 1)
}
</script>
