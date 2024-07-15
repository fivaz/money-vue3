<template>
	<MModal :show="show" @close="$emit('close')">
		<div class="mb-5 flex items-center justify-between">
			<h3 class="text-lg font-medium leading-6">
				{{ title }}
			</h3>
			<button
				:class="[
					MAIN_COLOR_TEXT,
					SECONDARY_HOVER_COLOR_TEXT,
					'rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
				]"
				@click="$emit('close')"
				type="button"
			>
				<span class="sr-only">Close</span>
				<XMarkIcon aria-hidden="true" class="h-6 w-6" />
			</button>
		</div>
		<slot />
	</MModal>
</template>

<script lang="ts" setup>
import MModal from '@/components/form/MModal.vue'
import { MAIN_COLOR_TEXT, SECONDARY_HOVER_COLOR_TEXT } from '@/lib/consts'
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps<{ show: boolean; title: string }>()

defineEmits<{ (e: 'close'): void }>()
</script>
