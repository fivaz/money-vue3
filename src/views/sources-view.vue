<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getEmptySource, type Source } from '@/components/sources/service'
import SourceItem from '@/components/sources/source-item.vue'
import SourceForm from '@/components/sources/source-form.vue'
import { useSourcesStore } from '@/components/sources/store.ts'
import { LandmarkIcon } from 'lucide-vue-next'
import NText from '@/components/base/n-text.vue'

const sourcesStore = useSourcesStore()

const newSource = ref<Source>(getEmptySource())

const isMounted = ref(false)
onMounted(() => (isMounted.value = true))
</script>

<template>
  <div>
    <div v-if="sourcesStore.value.length">
      <ul class="mt-4 space-y-2">
        <SourceItem v-for="source in sourcesStore.value" :key="source.id" :source="source" />
      </ul>
    </div>
    <NText v-else>Loading sources...</NText>

    <Teleport to="#header-right" v-if="isMounted">
      <SourceForm :source="newSource">
        <LandmarkIcon class="size-5" />
        Add Source
      </SourceForm>
    </Teleport>
  </div>
</template>
