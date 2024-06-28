<template>
	<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
		{{ account.id ? 'Edit Account' : 'Add Account' }}
	</DialogTitle>
	<form @submit.prevent="submitForm" class="mt-2 flex w-[300px] flex-col gap-5">
		<div class="grid grid-cols-2 gap-5">
			<div class="col-span-1">
				<LabelInput type="text" name="name" v-model="accountIn.name" required />
			</div>

			<div class="col-span-1">
				<Select v-model="accountIn.order" title="Order">
					<template v-slot:placeholder>
						<span class="block truncate">{{ accountIn.order || 'no order selected' }}</span>
					</template>
					<SelectItem
						:key="order"
						v-for="order in Array.from({ length }, (_, i) => i + 1)"
						:value="order"
					>
						{{ order }}
					</SelectItem>
				</Select>
			</div>
		</div>

		<IconSelector v-model="accountIn.icon" />

		<div class="flex justify-between">
			<Button size="big" color="white" v-if="account.id" type="button" @click="handleDelete">
				Delete
			</Button>
			<Button size="big" color="indigo" type="submit">Save</Button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { addAccount, editAccount, deleteAccount, type Account } from '@/lib/account'
import { useCurrentUser, useFirestore } from 'vuefire'
import { DialogTitle } from '@headlessui/vue'
import IconSelector from '@/components/form/IconSelector.vue'
import SelectItem from '@/components/form/SelectItem.vue'
import Select from '@/components/form/Select.vue'
import LabelInput from '@/components/form/LabelInput.vue'
import Button from '@/components/Button.vue'

const props = defineProps<{ account: Account; length: number }>()

const emit = defineEmits<{ (e: 'close'): void }>()

const accountIn = ref<Account>({ ...props.account, id: props.account.id })

const user = useCurrentUser()
const db = useFirestore()

function submitForm() {
	if (accountIn.value.id) {
		editAccount(db, accountIn.value, user.value!.uid)
	} else {
		addAccount(db, accountIn.value, user.value!.uid)
	}
	emit('close')
}

function handleDelete() {
	if (accountIn.value.id) {
		deleteAccount(db, accountIn.value.id, user.value!.uid)
		emit('close')
	}
}
</script>
