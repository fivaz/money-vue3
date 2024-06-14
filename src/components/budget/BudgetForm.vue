<template>
	<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
		{{ budget.id ? 'Edit Budget' : 'Add Budget' }}
	</DialogTitle>
	<form @submit.prevent="submitForm" class="mt-2 flex flex-col gap-5">
		<div>
			<label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
			<input
				type="text"
				name="name"
				v-model="budgetIn.name"
				required
				id="name"
				class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
			/>
		</div>

		<div>
			<label for="value" class="block text-sm font-medium leading-6 text-gray-900">Value</label>
			<input
				type="number"
				name="value"
				step="0.01"
				v-model="budgetIn.value"
				required
				id="value"
				class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
			/>
		</div>

		<IconSelector v-model="budgetIn.icon" />

		<div class="flex justify-between">
			<button
				v-if="budget.id"
				type="button"
				@click="handleDelete"
				class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
			>
				Delete
			</button>
			<button
				class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				type="submit"
			>
				Save
			</button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue'
import { addBudget, editBudget, deleteBudget, type Budget } from '@/lib/budget'
import { useCurrentUser, useFirestore } from 'vuefire'
import { DialogTitle } from '@headlessui/vue'
import IconSelector from '@/components/budget/IconSelector.vue'

const props = defineProps<{ budget: Budget }>()

const emit = defineEmits<{ (e: 'close'): void }>()

const budgetIn = ref<Budget>({ ...props.budget, id: props.budget.id })

const user = useCurrentUser()
const db = useFirestore()

function submitForm() {
	if (budgetIn.value.id) {
		editBudget(db, budgetIn.value, user.value!.uid)
	} else {
		addBudget(db, budgetIn.value, user.value!.uid)
	}
	emit('close')
}

function handleDelete() {
	if (budgetIn.value.id) {
		deleteBudget(db, budgetIn.value.id, user.value!.uid)
		emit('close')
	}
}
</script>
