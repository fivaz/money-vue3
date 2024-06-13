<template>
	<Listbox v-model="model" as="div">
		<ListboxLabel class="block text-sm font-medium leading-6 text-gray-900">Budget</ListboxLabel>
		<div class="relative mt-1">
			<ListboxButton
				class="relative w-full cursor-default rounded-lg border-0 bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm sm:leading-6"
			>
				<span class="block truncate">{{ model!.name }}</span>
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
					class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
				>
					<ListboxOption
						v-slot="{ active, selected }"
						v-for="item in list"
						:key="item.id"
						:value="item"
						as="template"
					>
						<li
							:class="[
								active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900',
								'relative cursor-default select-none py-2 pl-10 pr-4',
							]"
						>
							<span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
								{{ item.name }}
							</span>
							<span
								v-if="selected"
								class="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600"
							>
								<CheckIcon class="h-5 w-5" aria-hidden="true" />
							</span>
						</li>
					</ListboxOption>
				</ListboxOptions>
			</transition>
		</div>
	</Listbox>
</template>

<script setup lang="ts">
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import {
	Listbox,
	ListboxButton,
	ListboxLabel,
	ListboxOption,
	ListboxOptions,
} from '@headlessui/vue'

type UnknownItem = { id: string; name: string }

defineProps<{ list: UnknownItem[] }>()

const model = defineModel<UnknownItem>()
</script>
