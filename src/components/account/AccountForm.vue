<template>
	<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
		{{ account.id ? 'Edit Account' : 'Add Account' }}
	</DialogTitle>
	<form @submit.prevent="submitForm" class="mt-2 flex w-[300px] flex-col gap-5">
		<LabelInput label="Name" required type="text" v-model="accountIn.name" />

		<div class="grid grid-cols-2 gap-5">
			<Select label="Order" v-model="accountIn.order">
				<template v-slot:placeholder>
					<span class="block truncate">{{ accountIn.order || 'no order selected' }}</span>
				</template>
				<SelectItem
					:key="order"
					:value="order"
					v-for="order in Array.from({ length }, (_, i) => i + 1)"
				>
					{{ order }}
				</SelectItem>
			</Select>

			<LabelInput
				label="Current amount"
				step="0.01"
				type="number"
				v-model="accountIn.currentAmount"
			/>
		</div>

		<IconSelector v-model="accountIn.icon" />

		<div class="flex justify-between">
			<MButton @click="handleDelete" color="white" size="big" type="button" v-if="account.id">
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
import Select from '@/components/form/Select.vue'
import SelectItem from '@/components/form/SelectItem.vue'
import { type Account, addAccount, deleteAccount, editAccount } from '@/lib/account'
import { usePromptStore } from '@/lib/promptStore'
import { DialogTitle } from '@headlessui/vue'
import { ref } from 'vue'
import { useCurrentUser, useFirestore } from 'vuefire'

const props = defineProps<{ account: Account; length: number }>()

const emit = defineEmits<{ (e: 'close'): void }>()

const accountIn = ref<Account>({ ...props.account, id: props.account.id })

const user = useCurrentUser()
const db = useFirestore()

const store = usePromptStore()

function submitForm() {
	if (accountIn.value.id) {
		editAccount(db, accountIn.value, user.value!.uid)
	} else {
		addAccount(db, accountIn.value, user.value!.uid)
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
		if (accountIn.value.id) {
			deleteAccount(db, accountIn.value.id, user.value!.uid)
			emit('close')
		}
}
</script>
