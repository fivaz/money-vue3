<template>
	<Teleport to="body">
		<div
			:style="{ zIndex }"
			@keyup.esc="$emit('close')"
			class="fixed inset-0 flex items-center justify-center"
		>
			<!-- Background Overlay for each modal -->
			<div :style="{ zIndex: zIndex - 1 }" class="fixed inset-0 bg-black bg-opacity-50"></div>
			<div :style="{ zIndex }" class="relative">
				<slot />
			</div>
		</div>
	</Teleport>
</template>

<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineEmits<{ (e: 'close'): void }>()
withDefaults(defineProps<{ zIndex?: number }>(), { zIndex: 10 })
</script>
