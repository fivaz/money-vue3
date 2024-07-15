<template>
	<Teleport to="body">
		<div
			:style="{ zIndex }"
			@keyup.esc="$emit('close')"
			class="fixed inset-0 flex items-center justify-center"
			tabindex="-1"
		>
			<!-- Background Overlay for each modal -->
			<div :style="{ zIndex: zIndex - 1 }" class="fixed inset-0 bg-black bg-opacity-50"></div>
			<div
				:style="{ zIndex }"
				class="relative rounded-lg bg-white p-4 dark:bg-slate-800"
				ref="modalContent"
			>
				<slot />
			</div>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref } from 'vue'

defineEmits<{ (e: 'close'): void }>()
withDefaults(defineProps<{ zIndex?: number }>(), { zIndex: 10 })

const modalContent = ref<HTMLDivElement | null>(null)

function focusSecondElement() {
	const focusableElements = modalContent.value?.querySelectorAll<HTMLElement>(
		'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
	)
	if (focusableElements && focusableElements.length > 1) {
		focusableElements[1].focus()
	}
}

onMounted(() => focusSecondElement())
</script>
