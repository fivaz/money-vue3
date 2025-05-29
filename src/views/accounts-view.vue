<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type Account, getEmptyAccount } from '@/components/accounts/service'
import AccountItem from '@/components/accounts/account-item.vue'
import AccountForm from '@/components/accounts/account-form.vue'
import { useAccountsStore } from '@/components/accounts/store'
import { VaultIcon } from 'lucide-vue-next'
import TransactionSearchList from '@/components/transactions/transaction-search-list.vue'
import SearchInput from '@/components/base/search-input.vue'
import NText from '@/components/base/n-text.vue'

const accountsStore = useAccountsStore()

const newAccount = ref<Account>(getEmptyAccount())

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

const searchQuery = ref<string>('')
</script>

<template>
  <div>
    <transaction-search-list v-if="searchQuery" :searchQuery="searchQuery" />

    <div v-else-if="accountsStore.value.length">
      <ul class="mt-4 space-y-2">
        <AccountItem v-for="account in accountsStore.value" :key="account.id" :account="account" />
      </ul>
    </div>
    <NText v-else>Loading accounts...</NText>

    <Teleport to="#header-right" v-if="isMounted">
      <div class="flex flex-col items-end gap-2 md:flex-row-reverse md:items-center md:gap-4">
        <AccountForm class="" :account="newAccount">
          <VaultIcon class="size-5" />
          Add Account
        </AccountForm>

        <search-input placeholder="Search transaction" v-model="searchQuery" />
      </div>
    </Teleport>
  </div>
</template>
