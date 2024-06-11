<template>
  <div class="flex min-h-full flex-1">
    <div
      class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <img
            alt="Your Company"
            class="h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          />
          <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p class="mt-2 text-sm leading-6 text-gray-500">
            Not a member?
            <a class="font-semibold text-indigo-600 hover:text-indigo-500" href="/register">
              Register
            </a>
          </p>
        </div>

        <div class="mt-5">
          <div class="mt-5">
            <form class="space-y-6" @submit.prevent="handleSubmit">
              <div>
                <label class="block text-sm font-medium leading-6 text-gray-900" for="email">
                  Email address
                </label>
                <div class="mt-2">
                  <input
                    v-model="email"
                    autocomplete="email"
                    class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    id="email"
                    name="email"
                    type="email"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium leading-6 text-gray-900" for="password">
                  Password
                </label>
                <div class="mt-2">
                  <input
                    autocomplete="current-password"
                    class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    id="password"
                    name="password"
                    type="password"
                    v-model="password"
                  />
                </div>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    disabled
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                  />
                  <label class="ml-3 block text-sm leading-6 text-gray-700" for="remember-me">
                    Remember me
                  </label>
                </div>

                <div class="text-sm leading-6">
                  <button class="font-semibold text-indigo-600 hover:text-indigo-500" disabled>
                    Forgot password?
                  </button>
                </div>
              </div>

              <div>
                <button class="w-full leading-6" type="submit">Sign in</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="relative hidden w-0 flex-1 lg:block">
      <img
        alt="logo"
        class="absolute inset-0 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'

const password = ref('')
const email = ref('')
async function handleSubmit() {
  console.log('Form submitted with:', { password: password.value, email: email.value })
  await signInWithEmailAndPassword(useFirebaseAuth()!, email.value, password.value)
}
</script>
