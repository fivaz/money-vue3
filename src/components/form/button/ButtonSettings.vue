<template>
	<button
		type="button"
		class="rounded bg-white px-1.5 py-1 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-500"
		@click="$emit('click')"
	>
		<Settings2 class="h-4 w-4 text-gray-900 dark:text-white" />
	</button>
</template>

<script setup lang="ts">
import { Settings2 } from 'lucide-vue-next'

defineEmits<{ (e: 'click'): void }>()
</script>
