<script setup lang="ts">
import { computed, ref } from 'vue'
import { Calendar1Icon, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import NText from '@/components/base/n-text.vue'
import NButton from '@/components/base/n-button.vue'
import { useDateStore } from '@/store/date.ts'
import { calculateBalance } from '@/components/navbar/balance/service.ts'
import { useTransactionsStore } from '@/components/transactions/store.ts'
import NMoney from '@/components/base/n-money.vue'
import { useSourcesStore } from '@/components/sources/store.ts'

const dateStore = useDateStore()
const dateInput = ref<HTMLInputElement | null>(null) // Ref for the hidden input

function showDatePicker() {
  if (dateInput.value) {
    dateInput.value.showPicker() // Trigger native date picker
  }
}

function handleDateChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.value) {
    dateStore.setDate(new Date(target.value))
  }
}

const transactionsStore = useTransactionsStore()

const expectedBalance = computed(() => {
  return calculateBalance(transactionsStore.value, dateStore.selectedDate)
})

const sourcesStore = useSourcesStore()

const balanceDifference = computed(() => {
  const actualBalance = sourcesStore.value.reduce((sum, source) => sum + source.balance, 0)
  return expectedBalance.value - actualBalance
})

// Compute the class based on value
const balanceClass = computed(() => {
  if (expectedBalance.value === 0) return 'text-gray-900 dark:text-gray-100'
  return expectedBalance.value < 0 ? 'text-red-500' : 'text-green-500'
})
</script>

<template>
  <div class="flex items-center justify-between gap-3 p-3">
    <NButton @click="dateStore.handlePrevMonth">
      <ChevronLeft class="size-7" />
    </NButton>
    <div class="flex flex-col items-center">
      <div class="flex items-center justify-center gap-2">
        <NText size="xl">{{ dateStore.getFormattedDate() }}</NText>
        <NButton padding="p-1" class="focus:outline-none" @click="showDatePicker">
          <Calendar1Icon class="size-4 text-yellow-500 dark:text-yellow-400" aria-hidden="true" />
        </NButton>
        <input
          ref="dateInput"
          type="date"
          :value="dateStore.getISODate()"
          @change="handleDateChange"
          class="pointer-events-none absolute opacity-0"
        />
      </div>
      <div class="flex items-center gap-2">
        <NText>
          <NMoney class="text-sm">{{ expectedBalance }}</NMoney>
        </NText>
        <NText>
          ( <NMoney :class="[balanceClass, 'text-sm']">{{ balanceDifference }} </NMoney> )
        </NText>
      </div>
    </div>
    <NButton @click="dateStore.handleNextMonth">
      <ChevronRight class="size-7" />
    </NButton>
  </div>
</template>
