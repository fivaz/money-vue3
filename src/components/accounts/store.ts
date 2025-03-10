import { defineStore } from 'pinia'
import { computed, type Ref, ref } from 'vue'
import type { Account } from '@/components/accounts/service.ts'
import { fetchAccountsCollection } from '@/components/accounts/repository.ts'
import { useCollection } from 'vuefire'

export const useAccountsStore = defineStore('accounts', () => {
  const accountsCollection = fetchAccountsCollection()
  const raw = useCollection<Account>(accountsCollection)

  const value = computed(() => {
    if (!raw.value) return []
    return [...raw.value].filter((account) => !account.isDeleted).sort((a, b) => a.order - b.order)
  })

  return { raw, value }
})
