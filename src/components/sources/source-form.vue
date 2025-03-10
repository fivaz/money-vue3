<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Source } from '@/components/sources/service'
import NButton from '@/components/base/n-button.vue'
import NInput from '@/components/base/n-input.vue'
import NDialog from '@/components/base/n-dialog.vue'
import { addSource, deepCopy, deleteSource, updateSource } from '@/components/sources/repository'
import MoneyInput from '@/components/base/money-input.vue'
import NText from '@/components/base/n-text.vue'
import IconSelector from '@/components/base/Icon/icon-selector.vue'
import NSelect from '@/components/base/Select/n-select.vue'
import SelectItem from '@/components/base/Select/select-item.vue'
import { useSourcesStore } from '@/components/sources/store.ts'

const props = defineProps<{
  source: Source
}>()

const sourceIn = ref<Source>(deepCopy(props.source))

const isOpen = ref<boolean>(false)

const sourcesStore = useSourcesStore()

const orders = computed(() => Array.from({ length: sourcesStore.value.length }, (_, i) => i + 1))

function handleOpen() {
  sourceIn.value = deepCopy(props.source)
  isOpen.value = true
}

function handleSubmit() {
  if (!sourceIn.value) throw "source can't be null"

  try {
    if (sourceIn.value.id) {
      // Edit mode
      updateSource(sourceIn.value.id, sourceIn.value)
    } else {
      // Add mode
      addSource(sourceIn.value)
    }
    isOpen.value = false // Close dialog on success
  } catch (error) {
    console.error('Error saving source:', error)
  }
}

function handleDelete() {
  if (!sourceIn.value) throw "source can't be null"

  try {
    deleteSource(sourceIn.value.id)
    isOpen.value = false // Close dialog on success
  } catch (error) {
    console.error('Error deleting source:', error)
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
      {{ sourceIn.id ? 'Edit Source' : 'Add Source' }}
    </n-text>
    <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
      <div>
        <NInput name="Name" v-model="sourceIn.name" />
      </div>
      <div class="flex gap-2">
        <n-select class="flex-1" name="Order" v-model="sourceIn.order">
          <select-item :key="order" v-for="order in orders" :value="order">
            {{ order }}
          </select-item>
        </n-select>
        <MoneyInput class="flex-1" name="Amount" v-model="sourceIn.balance" />
      </div>
      <div>
        <IconSelector v-model="sourceIn.icon" />
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
