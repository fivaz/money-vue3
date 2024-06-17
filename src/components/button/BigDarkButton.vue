<template>
	<button
		type="button"
		class="rounded-md bg-white px-3 py-2 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-slate-700 dark:text-white dark:hover:bg-gray-100 dark:hover:bg-white/30"
		@click="$emit('click')"
	>
		<slot />
	</button>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'click'): void }>()
</script>
