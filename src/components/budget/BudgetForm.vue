<template>
	<ModalForm :show="show" :title="budget.id ? 'Edit Budget' : 'Add Budget'" @close="$emit('close')">
		<form @submit.prevent="submitForm" class="flex flex-col gap-5">
			<LabelInput label="Name" required type="text" v-model="budgetIn.name" />

			<div class="grid grid-cols-4 gap-5">
				<div class="col-span-3">
					<LabelInput label="Value" required step="0.01" type="number" v-model="budgetIn.value" />
				</div>
				<label class="cols-span-1 flex flex-col gap-2">
					is default
					<MToggle v-model="budgetIn.isDefault" />
				</label>
			</div>

			<IconSelector v-model="budgetIn.icon" />

			<div class="flex justify-between">
				<MButton @click="handleDelete" color="white" size="big" type="button" v-if="budget.id">
					Delete
				</MButton>
				<MButton color="indigo" size="big" type="submit">Save</MButton>
			</div>
		</form>
	</ModalForm>
</template>

<script setup lang="ts">
import MButton from '@/components/MButton.vue'
import ModalForm from '@/components/ModalForm.vue'
import IconSelector from '@/components/form/IconSelector.vue'
import LabelInput from '@/components/form/LabelInput.vue'
import MToggle from '@/components/form/MToggle.vue'
import { type Budget, addBudget, deleteBudget, editBudget } from '@/lib/budget'
import { HOVER_MAIN_COLOR_TEXT, MAIN_COLOR_TEXT, SECONDARY_COLOR_TEXT } from '@/lib/consts'
import { usePromptStore } from '@/lib/promptStore'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { useCurrentUser, useFirestore } from 'vuefire'

const props = defineProps<{ budget: Budget; show: boolean }>()

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
