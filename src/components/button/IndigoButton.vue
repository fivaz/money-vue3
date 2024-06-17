<template>
	<button
		type="button"
		class="rounded bg-indigo-600 px-1.5 py-1 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-400"
		@click="$emit('click')"
	>
		<slot />
	</button>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'click'): void }>()
</script>
