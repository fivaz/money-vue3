<template>
	<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
		{{ account.id ? 'Edit Account' : 'Add Account' }}
	</DialogTitle>
	<form @submit.prevent="submitForm" class="mt-2 flex w-[300px] flex-col gap-5">
		<div class="grid grid-cols-2 gap-5">
			<div class="col-span-1">
				<label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
				<input
					type="text"
					name="name"
					v-model="accountIn.name"
					required
					id="name"
					class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				/>
			</div>

			<div class="col-span-1">
				<Select v-model="accountIn.order" title="Order">
					<template v-slot:placeholder>
						<span class="block truncate">{{ accountIn.order || 'no order selected' }}</span>
					</template>
					<SelectItem
						:key="order"
						v-for="order in Array.from({ length }, (v, i) => i + 1)"
						:value="order"
					>
						{{ order }}
					</SelectItem>
				</Select>
			</div>
		</div>

		<IconSelector v-model="accountIn.icon" />

		<div class="flex justify-between">
			<button
				v-if="account.id"
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
import { ref } from 'vue'
import { addAccount, editAccount, deleteAccount, type Account } from '@/lib/account'
import { useCurrentUser, useFirestore } from 'vuefire'
import { DialogTitle } from '@headlessui/vue'
import IconSelector from '@/components/budget/IconSelector.vue'
import SelectItem from '@/components/SelectItem.vue'
import Select from '@/components/Select.vue'

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
