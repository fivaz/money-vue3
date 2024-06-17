<template>
	<button
		type="button"
		class="rounded bg-white px-1.5 py-1 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:text-white dark:hover:bg-gray-100 dark:hover:bg-white/30"
		@click="$emit('click')"
	>
		<slot />
	</button>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'click'): void }>()
</script>
