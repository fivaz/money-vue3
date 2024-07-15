<template>
	<ListboxOption :value="value" as="template" v-slot="{ active, selected }">
		<li
			:class="[
				active ? MAIN_COLORFUL_COLOR_BG : MAIN_COLOR_BG,
				'relative cursor-default select-none py-2 pl-10 pr-4',
			]"
		>
			<span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate', $attrs.class]">
				<slot></slot>
			</span>
			<span class="absolute inset-y-0 left-0 flex items-center pl-3" v-if="selected">
				<CheckIcon aria-hidden="true" class="h-5 w-5" />
			</span>
		</li>
	</ListboxOption>
</template>

<script setup lang="ts">
import {
	MAIN_COLOR_BG,
	MAIN_COLORFUL_COLOR_BG,
	MAIN_COLORFUL_COLOR_TEXT,
	SECONDARY_COLOR_BG,
	SECONDARY_COLOR_TEXT,
	SECONDARY_COLORFUL_COLOR_BG,
} from '@/lib/consts'
import { ListboxOption } from '@headlessui/vue'
import { CheckIcon } from '@heroicons/vue/20/solid'

defineProps<{ value: boolean | null | number | object | string | undefined }>()
</script>
