import { defineStore } from 'pinia'
import { computed, type Ref, ref } from 'vue'
import type { Transaction } from '@/components/transactions/service.ts'
import { fetchTransactionsCollection } from '@/components/transactions/repository.ts'
import { useCollection } from 'vuefire'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactionsCollection = fetchTransactionsCollection()
  const raw = useCollection<Transaction>(transactionsCollection)

  const value = computed(() => {
    if (!raw.value) return []
    return [...raw.value]
      .filter((account) => !account.isDeleted)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  })

  return { raw, value }
})
