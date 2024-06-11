<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div class="bg-white p-4 rounded shadow">
      <form @submit.prevent="submitForm">
        <div>
          <label for="name">Name</label>
          <input id="name" v-model="budget.name" type="text" class="border p-2 rounded w-full" required>
        </div>
        <div>
          <label for="total">Total</label>
          <input id="total" v-model="budget.total" type="number" class="border p-2 rounded w-full" required>
        </div>
        <div class="flex justify-end mt-4">
          <button type="button" @click="closeForm" class="mr-2">Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, onMounted } from 'vue';

const props = defineProps<{
  budgetId?: string;
}>();

const emit = defineEmits(['close', 'update']);
const budget = ref( {
  name: '',
  total: 0,
});

const closeForm = () => {
  emit('close');
};

const submitForm = async () => {
  emit('update');
  closeForm();
};

</script>
