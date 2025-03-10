import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useCollection } from 'vuefire'
import { fetchSourcesCollection } from '@/components/sources/repository.ts'
import type { Source } from '@/components/sources/service.ts'

export const useSourcesStore = defineStore('sources', () => {
  const sourcesCollection = fetchSourcesCollection()
  const raw = useCollection<Source>(sourcesCollection)

  const value = computed(() => {
    if (!raw.value) return []
    return [...raw.value].filter((account) => !account.isDeleted).sort((a, b) => a.order - b.order)
  })

  return { raw, value }
})
