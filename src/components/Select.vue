<template>
	<Listbox v-model="model" as="div" :by="by">
		<ListboxLabel class="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
			{{ title }}
		</ListboxLabel>
		<div class="relative mt-1">
			<ListboxButton
				class="relative block w-full cursor-default rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm sm:leading-6 dark:bg-white/5 dark:text-white dark:ring-white/10 dark:focus:ring-indigo-500"
			>
				<slot name="placeholder" />
				<span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
					<ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
				</span>
			</ListboxButton>
			<transition
				leave-active-class="transition duration-100 ease-in"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<ListboxOptions
					class="absolute z-10 mt-1 block max-h-60 w-full overflow-auto rounded-md border-0 bg-white py-1.5 text-base text-gray-900 shadow-sm ring-1 ring-inset ring-black/5 ring-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-[#293445] dark:text-white dark:ring-white/10 dark:focus:ring-indigo-500"
				>
					<slot></slot>
				</ListboxOptions>
			</transition>
		</div>
	</Listbox>
</template>

<script setup lang="ts">
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { Listbox, ListboxButton, ListboxLabel, ListboxOptions } from '@headlessui/vue'

defineProps<{ title: string; by?: string }>()

const model = defineModel<string | number | boolean | object | null | undefined>({ required: true })
</script>
