<template>
	<label
		:for="name"
		class="block text-sm font-medium capitalize leading-6 text-slate-900 dark:text-white"
	>
		{{ label || name }}
	</label>

	<input
		:name="name"
		:id="name"
		v-model="value"
		v-bind="$attrs"
		class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:ring-indigo-500"
	/>
</template>

<script setup lang="ts">
defineProps<{ name: string; label?: string }>()

const value = defineModel<string | number | null>()
</script>
