<template>
	<MModal :show="promptStore.prompt.show" @close="close">
		<div class="sm:flex sm:items-start">
			<div
				class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
			>
				<ExclamationTriangleIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
			</div>
			<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
				<DialogTitle
					as="h3"
					class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
				>
					{{ promptStore.prompt.title }}
				</DialogTitle>
				<div v-if="promptStore.prompt.message" class="mt-2">
					<p class="text-sm text-gray-500 dark:text-gray-300">{{ promptStore.prompt.message }}</p>
				</div>
			</div>
		</div>
		<div class="mt-5 gap-3 sm:mt-4 sm:flex sm:flex-row-reverse">
			<MButton color="red" size="big" type="button" @click="confirm">
				{{ promptStore.prompt.confirmText }}
			</MButton>

			<MButton color="white" size="big" type="button" @click="cancel">
				{{ promptStore.prompt.cancelText }}
			</MButton>
		</div>
	</MModal>
</template>

<script setup lang="ts">
import { DialogTitle } from '@headlessui/vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { usePromptStore } from '@/lib/promptStore'
import MButton from '@/components/MButton.vue'
import MModal from '@/components/form/MModal.vue'

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
