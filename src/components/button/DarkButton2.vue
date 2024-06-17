<template>
	<button
		type="button"
		class="rounded-md bg-white bg-white/10 px-3 py-2 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-slate-700 dark:text-white dark:hover:bg-gray-100 dark:hover:bg-white/20"
		@click="$emit('click')"
	>
		<slot />
	</button>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'click'): void }>()
</script>
