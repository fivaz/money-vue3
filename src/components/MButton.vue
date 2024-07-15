<template>
	<button
		:class="[
			'flex items-center gap-2 rounded-md text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
			sizeClass[size],
			colorClass[color].core,
			colorClass[color][isLoading ? 'loading' : 'normal'],
		]"
		:disabled="isLoading"
	>
		<LoaderCircle class="h-5 w-5 animate-spin" v-if="isLoading" />
		<slot />
	</button>
</template>

<script setup lang="ts">
import {
	MAIN_COLORFUL_COLOR_BG,
	MAIN_HOVER_COLORFUL_COLOR_BG,
	SECONDARY_COLORFUL_COLOR_BG,
} from '@/lib/consts'
import { LoaderCircle } from 'lucide-vue-next'

defineProps<{ color: keyof typeof colorClass; isLoading?: boolean; size: keyof typeof sizeClass }>()

const colorClass = {
	indigo: {
		core: MAIN_HOVER_COLORFUL_COLOR_BG,
		loading: SECONDARY_COLORFUL_COLOR_BG,
		normal: MAIN_COLORFUL_COLOR_BG,
	},
	red: {
		core: 'text-white hover:bg-red-400',
		loading: 'bg-red-400',
		normal: 'bg-red-600',
	},
	white: {
		core: 'ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-gray-100 dark:hover:bg-white/30',
		loading: 'bg-gray-100',
		normal: '',
	},
}

const sizeClass = {
	big: 'px-3 py-2',
	small: 'px-1.5 py-1',
}
</script>
