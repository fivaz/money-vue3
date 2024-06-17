<template>
	<button
		type="button"
		class="rounded bg-indigo-600 px-1.5 py-1 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-400"
		@click="$emit('click')"
	>
		<Plus class="h-4 w-4 text-white" />
	</button>
</template>

<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

defineEmits<{ (e: 'click'): void }>()
</script>
