<template>
	<ListboxOption :value="value" v-slot="{ active, selected }" as="template">
		<li
			:class="[
				active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900',
				'relative cursor-default select-none py-2 pl-10 pr-4',
			]"
		>
			<span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate', $attrs.class]">
				<slot></slot>
			</span>
			<span
				v-if="selected"
				class="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600"
			>
				<CheckIcon class="h-5 w-5" aria-hidden="true" />
			</span>
		</li>
	</ListboxOption>
</template>

<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/20/solid'
import { ListboxOption } from '@headlessui/vue'

defineProps<{ value: string | number | boolean | object | null | undefined }>()
</script>
