<template>
	<div :class="divClasses">
		<label :for="label" class="block text-sm font-medium leading-6">
			{{ label }}
		</label>

		<input
			:id="label"
			v-model="value"
			v-bind="inputAttributes"
			class="color-scheme-light dark:color-scheme-dark block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-white/5 dark:ring-white/10 dark:focus:ring-indigo-500"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineProps<{ label: string }>()

const value = defineModel<null | number | string>()

defineOptions({
	inheritAttrs: false,
})

const attrs = useAttrs()

const divClasses = computed(() => attrs?.class || '')

const inputAttributes = computed(() => {
	const { class: divClass, ...restAttrs } = attrs
	return restAttrs
})
</script>
