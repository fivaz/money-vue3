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
						<RouterLink class="font-semibold text-indigo-600 hover:text-indigo-500" to="/register">
							Register
						</RouterLink>
					</p>
				</div>

				<div class="mt-5">
					<Alert v-if="!!errorMessage">
						{{ errorMessage }}
					</Alert>
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
								<button
									type="submit"
									class="w-full rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									Sign in
								</button>
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
import { useRoute, useRouter } from 'vue-router'
import { FirebaseError } from 'firebase/app'
import Alert from '@/components/AlertMessage.vue'

const router = useRouter()
const route = useRoute()

const errorMessage = ref('')
const email = ref('')
const password = ref('')
const auth = useFirebaseAuth()!
async function handleSubmit() {
	try {
		await signInWithEmailAndPassword(auth, email.value, password.value)
	} catch (error) {
		if (error instanceof FirebaseError) {
			if (error.code === 'auth/invalid-credential') {
				errorMessage.value = 'login or password are incorrect'
			} else if (error.code === 'auth/network-request-failed') {
				errorMessage.value = "you can't login if you're not connected to the internet"
			} else {
				errorMessage.value = error.message
			}
		} else {
			errorMessage.value = error as unknown as string
		}
	}

	void router.push(route.query.redirect?.toString() || '/')
}
</script>
