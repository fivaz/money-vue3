<template>
	<div class="relative flex flex-col gap-2">
		<input autocomplete="off" v-model="searchQuery" placeholder="Search icon..." />
		<div
			class="grid grid-cols-10 justify-between gap-1 overflow-y-auto rounded-lg border border-gray-300 p-2"
		>
			<button
				v-for="icon in filteredIcons"
				:class="[
					{ 'bg-indigo-200 text-indigo-700': value === icon.name },
					'flex cursor-pointer items-center justify-center rounded p-1 text-2xl',
				]"
				@click="() => (value = icon.name)"
				type="button"
			>
				<component :is="icon" class="h-6" />
			</button>
			{/each}
		</div>
	</div>
</template>
<script setup lang="ts">
import { ShoppingCart, Hospital, ReceiptText, Home } from 'lucide-vue-next'
import { ref } from 'vue'

const value = defineModel<string>({ required: true })

const icons = [
	{
		icon: ShoppingCart,
		name: 'shopping-cart',
	},
	{
		icon: Hospital,
		name: 'hospital',
	},
	{
		icon: ReceiptText,
		name: 'receipt-text',
	},
	{
		icon: Home,
		name: 'home',
	},
]

const searchQuery = ref('')

const filteredIcons = icons.filter(({ name }) =>
	name.toLowerCase().includes(searchQuery.value.toLowerCase()),
)
</script>
