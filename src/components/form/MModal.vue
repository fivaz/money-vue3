<template>
	<Teleport to="body">
		<TransitionRoot :show="show" as="template">
			<div
				:style="{ zIndex }"
				@keyup.esc="$emit('close')"
				class="fixed inset-0 flex items-center justify-center"
				tabindex="-1"
			>
				<TransitionChild
					enter="duration-300 ease-out"
					enter-from="opacity-0"
					enter-to="opacity-100"
					leave="duration-200 ease-in"
					leave-from="opacity-100"
					leave-to="opacity-0"
				>
					<!-- Background Overlay for each modal -->
					<div :style="{ zIndex: zIndex - 1 }" class="fixed inset-0 bg-black bg-opacity-50" />
				</TransitionChild>
				<TransitionChild
					enter="duration-300 ease-out"
					enter-from="opacity-0 scale-95"
					enter-to="opacity-100 scale-100"
					leave="duration-200 ease-in"
					leave-from="opacity-100 scale-100"
					leave-to="opacity-0 scale-95"
				>
					<div
						:style="{ zIndex }"
						class="relative rounded-lg bg-white p-4 dark:bg-slate-800"
						ref="modalContent"
					>
						<slot />
					</div>
				</TransitionChild>
			</div>
		</TransitionRoot>
	</Teleport>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { nextTick, onMounted, ref, watch } from 'vue'

defineEmits<{ (e: 'close'): void }>()
const props = withDefaults(defineProps<{ show: boolean; zIndex?: number }>(), { zIndex: 10 })

const modalContent = ref<HTMLDivElement | null>(null)

async function focusSecondElement() {
	await nextTick()
	const focusableElements = modalContent.value?.querySelectorAll<HTMLElement>(
		'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
	)
	if (focusableElements && focusableElements.length > 1) {
		focusableElements[1].focus()
	}
}

watch(
	() => props.show,
	(newVal) => {
		if (newVal) focusSecondElement()
	},
)
</script>
