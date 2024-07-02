<template>
	<div
		class="flex h-[100vh] min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
	>
		<div class="w-full max-w-sm space-y-10">
			<div>
				<Logo class="mx-auto h-10 w-auto" />
				<h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
					Sign in to your account
				</h2>
			</div>
			<Alert v-if="!!errorMessage">{{ errorMessage }}</Alert>
			<form class="space-y-6" @submit.prevent="handleSubmit">
				<div class="relative -space-y-px rounded-md shadow-sm">
					<div
						class="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300"
					/>
					<div>
						<label for="email" class="sr-only">Email address</label>
						<input
							v-model="email"
							id="email"
							name="email"
							type="email"
							required
							class="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							placeholder="Email address"
						/>
					</div>
					<div>
						<label for="password" class="sr-only">Password</label>
						<input
							v-model="password"
							id="password"
							name="password"
							type="password"
							required
							class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							placeholder="Password"
						/>
					</div>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
						/>
						<label for="remember-me" class="ml-3 block text-sm leading-6 text-gray-900">
							Remember me
						</label>
					</div>

					<div class="text-sm leading-6">
						<a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">
							Forgot password?
						</a>
					</div>
				</div>

				<div>
					<MButton
						type="submit"
						size="big"
						color="indigo"
						class="w-full justify-center"
						:is-loading="isLoading"
					>
						Sign in
					</MButton>
				</div>
			</form>

			<p class="text-center text-sm leading-6 text-gray-500">
				Not a member?
				{{ ' ' }}
				<RouterLink class="font-semibold text-indigo-600 hover:text-indigo-500" :to="registerRoute">
					Register
				</RouterLink>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import { useRoute, useRouter } from 'vue-router'
import { FirebaseError } from 'firebase/app'
import { homeRoute, registerRoute } from '@/router'
import Logo from '@/components/Logo.vue'
import Alert from '@/components/form/Alert.vue'
import MButton from '@/components/MButton.vue'

const router = useRouter()
const route = useRoute()

const errorMessage = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const auth = useFirebaseAuth()!
async function handleSubmit() {
	isLoading.value = true
	errorMessage.value = ''
	try {
		await signInWithEmailAndPassword(auth, email.value, password.value)

		void router.push(route.query.redirect?.toString() || homeRoute)
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
		isLoading.value = false
	}
}
</script>
