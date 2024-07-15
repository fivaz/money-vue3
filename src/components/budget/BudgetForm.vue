<template>
	<form @submit.prevent="submitForm" class="relative flex flex-col gap-5 rounded-md bg-white p-4">
		<div class="flex items-center justify-between">
			<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
				{{ budget.id ? 'Edit Budget' : 'Add Budget' }}
			</h3>
			<div class="">
				<button
					@click="$emit('close')"
					class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-slate-800"
					type="button"
				>
					<span class="sr-only">Close</span>
					<XMarkIcon aria-hidden="true" class="h-6 w-6" />
				</button>
			</div>
		</div>

		<LabelInput label="Name" required type="text" v-model="budgetIn.name" />

		<LabelInput label="Value" required step="0.01" type="number" v-model="budgetIn.value" />

		<IconSelector v-model="budgetIn.icon" />

		<div class="flex justify-between">
			<MButton @click="handleDelete" color="white" size="big" type="button" v-if="budget.id">
				Delete
			</MButton>
			<MButton color="indigo" size="big" type="submit">Save</MButton>
		</div>
	</form>
</template>

<script setup lang="ts">
import MButton from '@/components/MButton.vue'
import IconSelector from '@/components/form/IconSelector.vue'
import LabelInput from '@/components/form/LabelInput.vue'
import { type Budget, addBudget, deleteBudget, editBudget } from '@/lib/budget'
import { usePromptStore } from '@/lib/promptStore'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useCurrentUser, useFirestore } from 'vuefire'

const props = defineProps<{ budget: Budget }>()

const emit = defineEmits<{ (e: 'close'): void }>()

const budgetIn = ref<Budget>({ ...props.budget, id: props.budget.id })

const user = useCurrentUser()
const db = useFirestore()

const store = usePromptStore()

function submitForm() {
	if (budgetIn.value.id) {
		editBudget(db, budgetIn.value, user.value!.uid)
	} else {
		addBudget(db, budgetIn.value, user.value!.uid)
	}
	emit('close')
}

async function handleDelete() {
	if (
		await store.createPrompt({
			cancelText: 'Cancel',
			confirmText: 'Delete',
			message: 'Are you sure you want to delete this budget ?',
			title: 'Delete Budget',
		})
	)
		if (budgetIn.value.id) {
			deleteBudget(db, budgetIn.value.id, user.value!.uid)
			emit('close')
		}
}
</script>
