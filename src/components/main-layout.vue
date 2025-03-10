<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './navbar/navbar.vue'
import BalancePanel from '@/components/navbar/balance/balance-panel.vue'
import { ROUTES } from '@/lib/const'

const route = useRoute()

// Compute the title dynamically based on the current route
const pageTitle = computed(() => {
  const currentRoute = Object.values(ROUTES).find((r) => r.path === route.path)
  return currentRoute ? currentRoute.name : 'Dashboard'
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <Navbar />
    <div class="py-10">
      <header>
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex items-start justify-between">
            <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {{ pageTitle }}
            </h1>
            <div id="header-right" class=""></div>
          </div>
        </div>
      </header>
      <main>
        <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <BalancePanel />
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
