<template>
	<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
		{{ budget.id ? 'Edit Budget' : 'Add Budget' }}
	</DialogTitle>
	<form @submit.prevent="submitForm" class="mt-2 flex flex-col gap-5">
		<LabelInput type="text" name="name" v-model="budgetIn.name" required />

		<LabelInput type="number" name="value" step="0.01" v-model="budgetIn.value" required />

		<IconSelector v-model="budgetIn.icon" />

		<div class="flex justify-between">
			<MButton size="big" color="white" v-if="budget.id" type="button" @click="handleDelete">
				Delete
			</MButton>
			<MButton size="big" color="indigo" type="submit">Save</MButton>
		</div>
	</form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { addBudget, editBudget, type Budget, deleteBudget } from '@/lib/budget'
import { useCurrentUser, useFirestore } from 'vuefire'
import { DialogTitle } from '@headlessui/vue'
import IconSelector from '@/components/form/IconSelector.vue'
import LabelInput from '@/components/form/LabelInput.vue'
import { usePromptStore } from '@/lib/promptStore'
import MButton from '@/components/MButton.vue'

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
			title: 'Delete Budget',
			message: 'Are you sure you want to delete this budget ?',
			cancelText: 'Cancel',
			confirmText: 'Delete',
		})
	)
		if (budgetIn.value.id) {
			deleteBudget(db, budgetIn.value.id, user.value!.uid)
			emit('close')
		}
}
</script>
