<template>
	<MModal :z-index="20" @close="close" v-if="promptStore.prompt.show">
		<div class="sm:flex sm:items-start">
			<div
				class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
			>
				<ExclamationTriangleIcon aria-hidden="true" class="h-6 w-6 text-red-600" />
			</div>
			<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
				<h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
					{{ promptStore.prompt.title }}
				</h3>
				<div class="absolute right-0 top-0 pr-3 pt-3">
					<button
						@click="close"
						class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-slate-800"
						type="button"
					>
						<span class="sr-only">Close</span>
						<XMarkIcon aria-hidden="true" class="h-6 w-6" />
					</button>
				</div>

				<div class="mt-2" v-if="promptStore.prompt.message">
					<p class="text-sm text-gray-500 dark:text-gray-300">{{ promptStore.prompt.message }}</p>
				</div>
			</div>
		</div>
		<div class="mt-5 flex flex-col gap-3 sm:mt-4 sm:flex-row-reverse">
			<MButton
				@click="confirm"
				class="w-full justify-center sm:w-auto"
				color="red"
				size="big"
				type="button"
			>
				{{ promptStore.prompt.confirmText }}
			</MButton>

			<MButton
				@click="cancel"
				class="w-full justify-center sm:w-auto"
				color="white"
				size="big"
				type="button"
			>
				{{ promptStore.prompt.cancelText }}
			</MButton>
		</div>
	</MModal>
</template>

<script setup lang="ts">
import MButton from '@/components/MButton.vue'
import MModal from '@/components/form/MModal.vue'
import { usePromptStore } from '@/lib/promptStore'
import { DialogTitle } from '@headlessui/vue'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const promptStore = usePromptStore()

function confirm() {
	promptStore.prompt.resolve(true)
	promptStore.closePrompt()
}

function cancel() {
	promptStore.prompt.resolve(false)
	promptStore.closePrompt()
}

function close() {
	promptStore.prompt.resolve(null)
	promptStore.closePrompt()
}
</script>
