<template>
	<div class="flex w-full items-center justify-between">
		<button @click="prevMonth"><ChevronLeft /></button>
		<h1
			class="text-base font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
		>
			{{ formattedCurrentDate() }}
		</h1>
		<button @click="nextMonth"><ChevronRight /></button>
	</div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { addMonths, format, isThisYear, subMonths } from 'date-fns'

const currentDate = defineModel<Date>({ required: true })

function formattedCurrentDate() {
	if (isThisYear(currentDate.value)) {
		return format(currentDate.value, 'MMMM')
	} else {
		return format(currentDate.value, 'MMMM yyyy')
	}
}

function prevMonth() {
	currentDate.value = subMonths(currentDate.value, 1)
}

function nextMonth() {
	currentDate.value = addMonths(currentDate.value, 1)
}
</script>
