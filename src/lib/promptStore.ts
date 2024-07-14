import { defineStore } from 'pinia'
import { ref } from 'vue'

const closedPrompt = {
	cancelText: '',
	confirmText: '',
	message: '',
	resolve: (_: boolean | null) => {},
	show: false,
	title: '',
}

export const usePromptStore = defineStore('prompt', () => {
	const prompt = ref({ ...closedPrompt })
	function createPrompt({
		cancelText = 'cancel',
		confirmText = 'confirm',
		message = '',
		title,
	}: {
		cancelText?: string
		confirmText?: string
		message?: string
		title: string
	}) {
		return new Promise<boolean | null>((resolve) => {
			prompt.value.show = true
			prompt.value.cancelText = cancelText
			prompt.value.confirmText = confirmText
			prompt.value.message = message
			prompt.value.resolve = resolve
			prompt.value.title = title
		})
	}

	function closePrompt() {
		prompt.value.show = false
	}

	return {
		closePrompt,
		createPrompt,
		prompt,
	}
})
