<template>
	<button
		:class="[
			'flex items-center gap-2 rounded-md text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
			sizeClass[size],
			colorClass[color].core,
			colorClass[color][isLoading ? 'loading' : 'normal'],
		]"
		:disabled="isLoading"
	>
		<LoaderCircle v-if="isLoading" class="h-5 w-5 animate-spin" />
		<slot />
	</button>
</template>

<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'

defineProps<{ size: 'small' | 'big'; color: 'indigo' | 'white'; isLoading?: boolean }>()

const sizeClass = {
	small: 'px-1.5 py-1',
	big: 'px-3 py-2',
}

const colorClass = {
	indigo: {
		loading: 'bg-indigo-400',
		normal: 'bg-indigo-600',
		core: 'text-white hover:bg-indigo-400',
	},
	white: {
		loading: 'bg-gray-100',
		normal: 'bg-white',
		core: 'text-gray-900 hover:bg-gray-100 dark:bg-slate-700 dark:text-white dark:hover:bg-gray-100 dark:hover:bg-white/30',
	},
}
</script>
