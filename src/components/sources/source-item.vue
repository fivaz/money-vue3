<script setup lang="ts">
import type { Source } from '@/components/sources/service.ts'
import NText from '@/components/base/n-text.vue'
import { CogIcon } from 'lucide-vue-next'
import SourceForm from '@/components/sources/source-form.vue'
import NMoney from '@/components/base/n-money.vue'
import IconRenderer from '@/components/base/Icon/icon-renderer.vue'

defineProps<{
  source: Source
}>()
</script>

<template>
  <li class="rounded-md bg-white p-4 shadow dark:bg-gray-800">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <NText><IconRenderer class="size-5" :name="source.icon" /></NText>
        <NText class="font-medium">{{ source.name }}</NText>
      </div>

      <div class="flex items-center gap-2">
        <NText>
          <NMoney>{{ source.balance }}</NMoney>
        </NText>
        <SourceForm :source="source"><CogIcon class="size-5" /></SourceForm>
      </div>
    </div>
  </li>
</template>
