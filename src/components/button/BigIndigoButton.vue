<template>
	<button
		type="button"
		class="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
		@click="$emit('click')"
	>
		<slot />
	</button>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'click'): void }>()
</script>
