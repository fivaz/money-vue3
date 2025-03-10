<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.push('/')
}
</script>

<template>
  <main class="relative isolate min-h-screen bg-gray-100 dark:bg-gray-900">
    <img
      src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75"
      alt=""
      class="absolute inset-0 -z-10 size-full object-cover object-top"
    />
    <div class="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
      <p class="text-base/8 font-semibold text-gray-900 dark:text-white">404</p>
      <h1
        class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white"
      >
        Page not found
      </h1>
      <p class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 dark:text-white/70">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <div class="mt-10 flex justify-center">
        <button
          @click="goBack"
          class="text-sm/7 font-semibold text-gray-900 hover:text-yellow-600 dark:text-white dark:hover:text-yellow-400"
        >
          <span aria-hidden="true">←</span> Back to home
        </button>
      </div>
    </div>
  </main>
</template>
