<template>
	<div class="relative flex flex-col gap-2">
		<label class="block text-sm font-medium leading-6" for="icon"> Icon </label>
		<!--    activate the research if there are too many icons-->
		<!--		<input-->
		<!--			type="text"-->
		<!--			id="icon"-->
		<!--			name="icon"-->
		<!--			class="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"-->
		<!--			autocomplete="off"-->
		<!--			v-model="searchQuery"-->
		<!--			placeholder="Search icon..."-->
		<!--		/>-->
		<div
			class="grid grid-cols-10 justify-between gap-1 overflow-y-auto rounded-lg border border-gray-300 p-2 shadow-sm"
		>
			<button
				:class="[
					value === icon.name ? 'bg-indigo-700 text-white' : '',
					'flex cursor-pointer items-center justify-center rounded p-1 text-2xl',
				]"
				:key="icon.name"
				@click="() => (value = icon.name)"
				type="button"
				v-for="icon in filteredIcons"
			>
				<component :is="icon.icon" class="h-6" />
			</button>
		</div>
	</div>
</template>
<script setup lang="ts">
import { icons } from '@/lib/utils'
import { computed, ref } from 'vue'

const value = defineModel<string>({ required: true })

const searchQuery = ref('')

const filteredIcons = computed(() =>
	icons.filter(({ name }) => name.toLowerCase().includes(searchQuery.value.toLowerCase())),
)
</script>
