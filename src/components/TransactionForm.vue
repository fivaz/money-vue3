<template>
	<TransitionRoot appear :show="show" as="template">
		<Dialog as="div" @close="$emit('close')" class="relative z-10">
			<TransitionChild
				as="template"
				enter="duration-300 ease-out"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="duration-200 ease-in"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div class="fixed inset-0 bg-black/25" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-y-auto">
				<div class="flex min-h-full items-center justify-center p-4 text-center">
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<DialogPanel
							class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
						>
							<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
								Update transaction
							</DialogTitle>
							<form @submit.prevent="submitForm">
								<div class="space-y-12">
									<div class="border-b border-gray-900/10 pb-12">
										<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
											<div class="sm:col-span-full">
												<label
													for="amount"
													class="block text-sm font-medium leading-6 text-gray-900"
												>
													Amount
												</label>
												<div class="mt-2">
													<div
														class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
													>
														<input
															type="number"
															name="amount"
															id="amount"
															v-model="transactionIn.amount"
															class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
														/>
													</div>
												</div>
											</div>

											<div class="sm:col-span-full">
												<label
													for="amount"
													class="block text-sm font-medium leading-6 text-gray-900"
												>
													Date
												</label>
												{{ transactionIn.date }}
												<div class="mt-2">
													<div
														class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
													>
														<input
															type="datetime-local"
															name="date"
															id="date"
															class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
															v-model="transactionIn.date"
														/>
													</div>
												</div>
											</div>
											<div class="sm:col-span-full">
												<label
													for="description"
													class="block text-sm font-medium leading-6 text-gray-900"
												>
													Description
												</label>
												<div class="mt-2">
													<div
														class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
													>
														<textarea
															v-model="transactionIn.description"
															id="description"
															name="description"
															rows="3"
															class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div class="mt-6 flex items-center justify-end gap-x-6">
									<button
										@click="$emit('close')"
										type="button"
										class="text-sm font-semibold leading-6 text-gray-900"
									>
										Cancel
									</button>
									<button
										type="submit"
										class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
									>
										Save
									</button>
								</div>
							</form>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { defineEmits, ref } from 'vue'
import { addTransaction, editTransaction, hasId, type TransactionIn } from '@/lib/transactions'
import { useCurrentUser, useFirestore } from 'vuefire'

const { transaction, budgetId } = defineProps<{
	show: boolean
	budgetId: string
	transaction: TransactionIn
}>()

const emit = defineEmits<{ (e: 'close'): void }>()

const transactionIn = ref<TransactionIn>(transaction)

const user = useCurrentUser()
const db = useFirestore()

function submitForm() {
	if (hasId(transactionIn.value)) {
		void editTransaction(db, transactionIn.value, budgetId, user.value!.uid)
	} else {
		void addTransaction(db, transactionIn.value, budgetId, user.value!.uid)
	}
	emit('close')
}
</script>
