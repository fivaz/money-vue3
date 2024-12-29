<template>
	<ModalForm :show="show" :title="source.id ? 'Edit Source' : 'Add Source'" @close="$emit('close')">
		<form @submit.prevent="submitForm" class="flex w-[300px] flex-col gap-5">
			<LabelInput label="Name" required type="text" v-model="sourceIn.name" />

			<div :class="[length > 1 ? 'grid-cols-3' : 'grid-cols-2', 'grid gap-5']">
				<MoneyInput
					class="col-span-2"
					label="Balance"
					required
					type="number"
					v-model="sourceIn.balance"
				/>

				<MSelect class="col-span-1" label="Order" v-if="length > 1" v-model="sourceIn.order">
					<template v-slot:placeholder>
						<span class="block truncate">{{ sourceIn.order || 'no order selected' }}</span>
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

			<div class="flex justify-between">
				<MButton @click="handleDelete" color="white" size="big" type="button" v-if="source.id">
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
import SelectItem from '@/components/form/SelectItem.vue'
import { usePromptStore } from '@/lib/promptStore'
import { type Source, addSource, deleteSource, editSource } from '@/lib/source'
import { ref, watch } from 'vue'
import { useCurrentUser, useFirestore } from 'vuefire'

const props = defineProps<{ length: number; show: boolean; source: Source }>()

const emit = defineEmits<{ (e: 'close'): void }>()

const sourceIn = ref<Source>({ ...props.source, id: props.source.id })

const user = useCurrentUser()
const db = useFirestore()
const store = usePromptStore()

watch(
	[() => props.source, ()=>props.show],
	([newValue]) => {
		sourceIn.value = { ...newValue, id: newValue.id }
	},
)

function submitForm() {
	if (sourceIn.value.id) {
		editSource(db, sourceIn.value, user.value!.uid)
	} else {
		addSource(db, sourceIn.value, user.value!.uid)
	}
	emit('close')
}

async function handleDelete() {
	if (
		await store.createPrompt({
			cancelText: 'Cancel',
			confirmText: 'Delete',
			message: 'Are you sure you want to delete this source ?',
			title: 'Delete source',
		})
	)
		if (sourceIn.value.id) {
			void deleteSource(db, sourceIn.value.id, user.value!.uid)
			emit('close')
		}
}
</script>
