<template>
	<div class="relative flex flex-col gap-2">
		<label class="block text-sm font-medium leading-6" for="icon">Icon</label>
		<div
			class="grid grid-cols-10 justify-between gap-1 overflow-y-auto rounded-lg border border-slate-300 p-2 shadow-sm"
		>
			<button
				:class="[
					{ [MAIN_COLORFUL_COLOR_BG]: value === icon.name },
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
import { MAIN_COLORFUL_COLOR_BG } from '@/lib/consts'
import { icons } from '@/lib/utils'
import { computed, ref } from 'vue'

const value = defineModel<string>({ required: true })

const searchQuery = ref('')

const filteredIcons = computed(() =>
	icons.filter(({ name }) => name.toLowerCase().includes(searchQuery.value.toLowerCase())),
)
</script>
