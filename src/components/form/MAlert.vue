<script setup lang="ts">
import { BadgeX } from 'lucide-vue-next'
</script>

<template>
	<div class="rounded-md bg-red-50 p-4">
		<div class="flex">
			<div class="flex-shrink-0">
				<BadgeX aria-hidden="true" class="h-5 w-5 bg-red-50 text-red-500" />
			</div>
			<div class="ml-3">
				<p class="bg-red-50 text-sm font-medium text-red-500"><slot /></p>
			</div>
		</div>
	</div>
</template>
