<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import NButton from '@/components/base/n-button.vue'
import NLogo from '@/components/navbar/n-logo.vue'

const auth = useFirebaseAuth()!
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)

function handleRegister() {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      router.push('/') // Redirect to home after registration
    })
    .catch((err) => {
      error.value = err.message
    })
}

function handleGoogleRegister() {
  const provider = new GoogleAuthProvider()
  signInWithPopup(auth, provider)
    .then(() => {
      router.push('/') // Redirect to home after Google sign-up
    })
    .catch((err) => {
      error.value = err.message
    })
}
</script>

<template>
  <div
    class="flex min-h-screen flex-1 flex-col justify-center bg-gray-100 px-6 py-12 lg:px-8 dark:bg-gray-900"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <n-logo class="mx-auto size-10 w-auto" />
      <h2
        class="text-brown-500 mt-10 text-center text-2xl/9 font-bold tracking-tight dark:text-white"
      >
        Create your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="handleRegister">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900 dark:text-white">
            Email address
          </label>
          <div class="mt-2">
            <input
              v-model="email"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-500 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm/6 font-medium text-gray-900 dark:text-white">
            Password
          </label>
          <div class="mt-2">
            <input
              v-model="password"
              type="password"
              name="password"
              id="password"
              autocomplete="new-password"
              required
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-yellow-500 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10"
            />
          </div>
        </div>

        <div>
          <NButton
            type="submit"
            color="primary"
            class="flex w-full justify-center"
            :disabled="!email || !password"
          >
            Register
          </NButton>
        </div>

        <div class="relative">
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div class="relative flex justify-center text-sm/6 font-medium">
            <span class="bg-gray-100 px-6 text-gray-900 dark:bg-gray-900 dark:text-white">
              Or continue with
            </span>
          </div>
        </div>

        <NButton
          @click="handleGoogleRegister"
          class="flex w-full items-center justify-center gap-2"
        >
          <svg class="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
            <path
              d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
              fill="#EA4335"
            />
            <path
              d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
              fill="#4285F4"
            />
            <path
              d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
              fill="#FBBC05"
            />
            <path
              d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
              fill="#34A853"
            />
          </svg>
          Google
        </NButton>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
        Already have an account?
        <a
          href="/login"
          class="font-semibold text-yellow-600 hover:text-yellow-500 dark:text-yellow-400 dark:hover:text-yellow-300"
        >
          Sign in
        </a>
      </p>

      <p v-if="error" class="mt-4 text-center text-sm/6 text-red-500 dark:text-red-400">
        {{ error }}
      </p>
    </div>
  </div>
</template>
