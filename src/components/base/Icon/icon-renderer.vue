<script setup lang="ts">
import { getIcon } from './service'

defineProps<{
  name?: string
}>()
</script>

<template>
  <component :is="getIcon(name)" v-bind="$attrs" />
</template>
