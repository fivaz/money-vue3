// stores/dateStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { addMonths, subMonths, format, isSameYear } from 'date-fns'
import { nFormatDate } from '@/lib/const.ts'

export const useDateStore = defineStore('date', () => {
  const selectedDate = ref(new Date())

  function handlePrevMonth() {
    selectedDate.value = subMonths(selectedDate.value, 1)
  }

  function handleNextMonth() {
    selectedDate.value = addMonths(selectedDate.value, 1)
  }

  function setDate(date: Date) {
    selectedDate.value = date
  }

  function getFormattedDate(): string {
    if (isSameYear(selectedDate.value, new Date())) {
      // Same year as browser: show only month
      return format(selectedDate.value, 'MMMM') // e.g., "March"
    } else {
      // Different year: show month and year
      return format(selectedDate.value, 'MMMM, yyyy') // e.g., "March, 2025"
    }
  }

  function getISODate(): string {
    return nFormatDate(selectedDate.value)
  }

  function getISODateTimeLocal() {
    return format(selectedDate.value, "yyyy-MM-dd'T'HH:mm") // e.g., "2025-03-08T14:30"
  }

  return {
    selectedDate,
    handlePrevMonth,
    handleNextMonth,
    setDate,
    getFormattedDate,
    getISODate,
    getISODateTimeLocal,
  }
})
