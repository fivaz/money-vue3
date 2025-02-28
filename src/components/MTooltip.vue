<template>
	<div :class="props.class" class="relative inline-block" ref="triggerRef">
		<slot></slot>
		<Teleport to="body">
			<div
				:class="{ 'translate-y-1 opacity-0': !isOpen, 'translate-y-0 opacity-100': isOpen }"
				:style="tooltipStyles"
				class="pointer-events-none absolute z-50 max-w-xs rounded-md bg-gray-800 px-3 py-2 text-sm text-white shadow-lg transition-opacity duration-200 ease-in-out"
				ref="tooltipRef"
				v-if="isOpen"
			>
				{{ text }}
				<div
					:style="arrowStyles"
					class="absolute h-3 w-3 rotate-45 transform bg-gray-800"
					ref="arrowRef"
				></div>
			</div>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import {
	type Placement,
	type Strategy,
	arrow,
	autoUpdate,
	flip,
	offset,
	shift,
	useFloating,
} from '@floating-ui/vue'
import { type CSSProperties, computed, onBeforeUnmount, onMounted, ref } from 'vue'

interface TooltipProps {
	class?: string
	offsetDistance?: number
	placement?: Placement
	text: string
}

const props = withDefaults(defineProps<TooltipProps>(), {
	class: '',
	offsetDistance: 8,
	placement: 'top',
})

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const arrowRef = ref<HTMLElement | null>(null)

const middleware = computed(() => [
	offset(props.offsetDistance),
	flip(),
	shift({ padding: 5 }),
	arrow({ element: arrowRef }),
])

const { middlewareData, placement, strategy, x, y } = useFloating(triggerRef, tooltipRef, {
	middleware: middleware.value,
	placement: props.placement,
	whileElementsMounted: autoUpdate,
})

const tooltipStyles = computed<CSSProperties>(() => ({
	left: x.value != null ? `${x.value}px` : '',
	position: strategy.value as Strategy,
	top: y.value != null ? `${y.value}px` : '',
}))

const arrowStyles = computed<CSSProperties>(() => {
	if (!middlewareData.value.arrow) {
		return {}
	}

	const { x, y } = middlewareData.value.arrow as { x: null | number; y: null | number }

	const staticSide = {
		bottom: 'top',
		left: 'right',
		right: 'left',
		top: 'bottom',
	}[placement.value.split('-')[0]]

	return {
		left: x != null ? `${x}px` : '',
		[staticSide as string]: '-6px',
		top: y != null ? `${y}px` : '',
		zIndex: -1,
	}
})

const showTooltip = (): void => {
	isOpen.value = true
}

const hideTooltip = (): void => {
	isOpen.value = false
}

onMounted(() => {
	if (triggerRef.value) {
		triggerRef.value.addEventListener('mouseenter', showTooltip)
		triggerRef.value.addEventListener('mouseleave', hideTooltip)
		triggerRef.value.addEventListener('focus', showTooltip)
		triggerRef.value.addEventListener('blur', hideTooltip)
	}
})

onBeforeUnmount(() => {
	if (triggerRef.value) {
		triggerRef.value.removeEventListener('mouseenter', showTooltip)
		triggerRef.value.removeEventListener('mouseleave', hideTooltip)
		triggerRef.value.removeEventListener('focus', showTooltip)
		triggerRef.value.removeEventListener('blur', hideTooltip)
	}
})
</script>
