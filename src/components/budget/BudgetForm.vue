<template>
	<ModalForm :show="show" :title="budget.id ? 'Edit Budget' : 'Add Budget'" @close="$emit('close')">
		<form @submit.prevent="submitForm" class="flex w-[320px] flex-col gap-5">
			<div class="grid grid-cols-3 gap-5">
				<LabelInput class="col-span-2" label="Name" required type="text" v-model="budgetIn.name" />

				<label class="cols-span-1 flex flex-col gap-2">
					is default
					<MToggle v-model="budgetIn.isDefault" />
				</label>
			</div>

			<div :class="[length > 1 ? 'grid-cols-3' : 'grid-cols-2', 'grid gap-5']">
				<MoneyInput
					class="col-span-2"
					label="Value"
					required
					type="number"
					v-model="budgetIn.value"
				/>

				<MSelect class="col-span-1" label="Order" v-if="length > 1" v-model="budgetIn.order">
					<template v-slot:placeholder>
						<span class="block truncate">{{ budgetIn.order || 'no order selected' }}</span>
					</template>
					<SelectItem
						:key="order"
						:value="order"
						v-for="order in Array.from({ length }, (_, i) => i + 1)"
					>
						{{ order }}
					</SelectItem>
				</MSelect>
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
import MoneyInput from '@/components/MoneyInput.vue'
import IconSelector from '@/components/form/IconSelector.vue'
import LabelInput from '@/components/form/LabelInput.vue'
import MSelect from '@/components/form/MSelect.vue'
import MToggle from '@/components/form/MToggle.vue'
import SelectItem from '@/components/form/SelectItem.vue'
import { type Budget, addBudget, deleteBudget, editBudget } from '@/lib/budget'
import { usePromptStore } from '@/lib/promptStore'
import { ref, watch } from 'vue'
import { useCurrentUser, useFirestore } from 'vuefire'

const props = defineProps<{ budget: Budget; length: number; show: boolean }>()

const emit = defineEmits<{ (e: 'close'): void }>()

const budgetIn = ref<Budget>({ ...props.budget, id: props.budget.id })

watch(
	[() => props.budget, ()=>props.show],
	([newValue]) => {
		budgetIn.value = { ...newValue, id: newValue.id }
	},
)

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
			title: 'Delete budget',
		})
	)
		if (budgetIn.value.id) {
			deleteBudget(db, budgetIn.value.id, user.value!.uid)
			emit('close')
		}
}
</script>
