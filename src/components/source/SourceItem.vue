<template>
	<li class="overflow-hidden rounded-xl border border-gray-200">
		<div :class="['p-3', SECONDARY_COLOR_BG]">
			<div class="flex items-center justify-between gap-x-4">
				<div class="flex items-center gap-2">
					<span class="text-sm font-medium leading-6">
						{{ source.name }}
					</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="text-sm font-medium leading-6">
						{{ formatMoney(source.balance) }}
					</div>
					<MButton @click="$emit('editSource', source)" color="white" size="small" type="button">
						<Settings2 class="h-4 w-4" />
					</MButton>
				</div>
			</div>
		</div>
	</li>
</template>

<script setup lang="ts">
import MButton from '@/components/MButton.vue'
import { SECONDARY_COLOR_BG } from '@/lib/consts'
import { type Source } from '@/lib/source'
import { formatMoney } from '@/lib/utils'
import { Settings2 } from 'lucide-vue-next'

defineProps<{
	currentDate: Date
	source: Source
}>()

defineEmits<{ (e: 'editSource', value: Source): void }>()
</script>
