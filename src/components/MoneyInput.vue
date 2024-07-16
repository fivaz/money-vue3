<template>
	<label :for="label" class="block text-sm font-medium leading-6">
		{{ label }}
	</label>

	<input
		:id="label"
		:value="formattedValue"
		@input="onInput"
		v-bind="$attrs"
		class="color-scheme-light dark:color-scheme-dark block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-white/5 dark:ring-white/10 dark:focus:ring-indigo-500"
		type="number"
	/>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ label: string; modelValue: number }>()

const emit = defineEmits<{ (e: 'update:modelValue', value: number): void }>()

const formattedValue = computed(() => {
	return (props.modelValue / 100).toFixed(2)
})

function onInput(event: Event): void {
	const input = (event.target as HTMLInputElement)?.value
	// Remove all non-numeric characters
	const numericInput = input.replace(/\D/g, '')

	// Convert to integer and handle empty input case
	const value = numericInput ? parseInt(numericInput) : 0

	// Emit the value in cents
	emit('update:modelValue', value)
}
</script>
