<!-- AccountSelect.vue -->
<script setup lang="ts">
import { computed, defineEmits } from 'vue'
import NSelect from '@/components/base/Select/n-select.vue'
import SelectItem from '@/components/base/Select/select-item.vue'
import { useAccountsStore } from '@/components/accounts/store.ts'
import type { Account } from '@/components/accounts/service.ts'
import IconRenderer from '@/components/base/Icon/icon-renderer.vue' // Assuming accountsStore is a reactive store or ref from somewhere

// Assuming accountsStore is a reactive store or ref from somewhere
const props = defineProps<{
  modelValue: Account | null // The selected account object (for v-model)
  name: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Account | null): void // For v-model support
}>()

const accountsStore = useAccountsStore()

// Computed property to handle two-way binding with v-model
const transactionAccount = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<template>
  <n-select by="id" class="flex-1" :name="name" v-model="transactionAccount">
    <!-- Placeholder slot -->
    <template #placeholder>
      <div v-if="transactionAccount" class="flex items-center gap-2">
        <IconRenderer :name="transactionAccount.icon" class="size-4 flex-shrink-0" />
        <span class="truncate">
          {{ transactionAccount.name }}
        </span>
      </div>
      <span v-else>Select an account</span>
    </template>
    <!-- Dynamically render select items from accountsStore -->
    <select-item
      class="flex items-center gap-2"
      v-for="account in accountsStore.value"
      :key="account.id"
      :value="account"
    >
      <IconRenderer :name="account.icon" class="size-4 flex-shrink-0" />
      <span class="truncate">
        {{ account.name }}
      </span>
    </select-item>
  </n-select>
</template>
