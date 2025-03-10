import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useCollection } from 'vuefire'
import { fetchBudgetsCollection } from '@/components/budgets/repository.ts'
import type { Budget } from '@/components/budgets/service.ts'

export const useBudgetsStore = defineStore('budgets', () => {
  const budgetsCollection = fetchBudgetsCollection()
  const raw = useCollection<Budget>(budgetsCollection)

  const value = computed(() => {
    if (!raw.value) return []
    return [...raw.value].filter((account) => !account.isDeleted).sort((a, b) => a.order - b.order)
  })

  return { raw, value }
})
