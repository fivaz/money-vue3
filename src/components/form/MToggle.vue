<template>
	<Switch
		:class="[
			value ? MAIN_COLORFUL_COLOR_BG : 'bg-gray-200 dark:bg-gray-500',
			'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
		]"
		v-model="value"
	>
		<span
			:class="[
				value ? 'translate-x-5' : 'translate-x-0',
				'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
			]"
		>
			<span
				:class="[
					value ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in',
					'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
				]"
				aria-hidden="true"
			>
				<span :class="['h-3 w-3', SECONDARY_COLOR_TEXT]">
					<slot name="inactive">
						<svg fill="none" viewBox="0 0 12 12">
							<path
								d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
							/>
						</svg>
					</slot>
				</span>
			</span>
			<span
				:class="[
					value ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out',
					'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
				]"
				aria-hidden="true"
			>
				<span :class="['h-3 w-3', MAIN_COLORFUL_COLOR_TEXT]">
					<slot name="active">
						<svg fill="currentColor" viewBox="0 0 12 12">
							<path
								d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
							/>
						</svg>
					</slot>
				</span>
			</span>
		</span>
	</Switch>
</template>

<script setup lang="ts">
import {
	MAIN_COLORFUL_COLOR_BG,
	MAIN_COLORFUL_COLOR_TEXT,
	SECONDARY_COLOR_TEXT,
} from '@/lib/consts'
import { Switch } from '@headlessui/vue'

const value = defineModel<boolean>()
</script>
