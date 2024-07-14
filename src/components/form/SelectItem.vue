<template>
	<ListboxOption :value="value" as="template" v-slot="{ active, selected }">
		<li
			:class="[
				active
					? 'bg-indigo-100 text-indigo-900 dark:bg-slate-700 dark:text-indigo-500'
					: 'text-slate-900 dark:text-white',
				'relative cursor-default select-none py-2 pl-10 pr-4',
			]"
		>
			<span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate', $attrs.class]">
				<slot></slot>
			</span>
			<span
				class="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600"
				v-if="selected"
			>
				<CheckIcon aria-hidden="true" class="h-5 w-5" />
			</span>
		</li>
	</ListboxOption>
</template>

<script setup lang="ts">
import { ListboxOption } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/20/solid'

defineProps<{ value: boolean | null | number | object | string | undefined }>()
</script>
