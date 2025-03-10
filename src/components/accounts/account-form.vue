<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Account } from '@/components/accounts/service'
import NButton from '@/components/base/n-button.vue'
import NInput from '@/components/base/n-input.vue'
import NDialog from '@/components/base/n-dialog.vue'
import {
  addAccount,
  deepCopy,
  deleteAccount,
  updateAccount,
} from '@/components/accounts/repository'
import NSwitch from '@/components/base/n-switch.vue'
import NSelect from '@/components/base/Select/n-select.vue'
import SelectItem from '@/components/base/Select/select-item.vue'
import { useAccountsStore } from '@/components/accounts/store.ts'
import IconSelector from '@/components/base/Icon/icon-selector.vue'
import NText from '@/components/base/n-text.vue'

const props = defineProps<{
  account: Account
}>()

const accountIn = ref<Account>(deepCopy(props.account))

const isOpen = ref<boolean>(false)

const accountsStore = useAccountsStore()

const orders = computed(() => Array.from({ length: accountsStore.value.length }, (_, i) => i + 1))

function handleOpen() {
  accountIn.value = deepCopy(props.account)
  isOpen.value = true
}

function handleSubmit() {
  if (!accountIn.value) throw "account can't be null"

  try {
    if (accountIn.value.id) {
      // Edit mode
      updateAccount(accountIn.value.id, accountIn.value)
    } else {
      // Add mode
      addAccount(accountIn.value)
    }
    closeDialog() // Close dialog on success
  } catch (error) {
    console.error('Error saving account:', error)
  }
}

function handleDelete() {
  if (!accountIn.value) throw "account can't be null"

  try {
    deleteAccount(accountIn.value.id)
    closeDialog() // Close dialog on success
  } catch (error) {
    console.error('Error deleting account:', error)
  }
}

function closeDialog() {
  isOpen.value = false
}
</script>

<template>
  <NButton v-bind="$attrs" @click="handleOpen">
    <slot />
  </NButton>

  <NDialog :is-open="isOpen" @close="closeDialog">
    <n-text size="lg" class="font-semibold">
      {{ accountIn.id ? 'Edit Account' : 'Add Account' }}
    </n-text>
    <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
      <div>
        <NInput name="Name" v-model="accountIn.name" />
      </div>
      <div class="flex items-center gap-2">
        <n-select class="flex-1" name="Order" v-model="accountIn.order">
          <select-item :key="order" v-for="order in orders" :value="order">
            {{ order }}
          </select-item>
        </n-select>
        <NSwitch v-model="accountIn.isAnnual" name="Is annual" />
      </div>
      <div>
        <IconSelector v-model="accountIn.icon" />
      </div>

      <div class="flex justify-between gap-2">
        <NButton @click="handleDelete" color="error">Delete</NButton>

        <div class="flex gap-2">
          <NButton type="submit" color="primary">Save</NButton>
          <NButton @click="closeDialog" color="secondary">Cancel</NButton>
        </div>
      </div>
    </form>
  </NDialog>
</template>
