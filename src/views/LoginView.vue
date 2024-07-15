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
			<form @submit.prevent="handleSubmit" class="space-y-6">
				<div class="relative -space-y-px rounded-md shadow-sm">
					<div
						class="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300"
					/>
					<div>
						<label class="sr-only" for="email">Email address</label>
						<input
							class="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							id="email"
							name="email"
							placeholder="Email address"
							required
							type="email"
							v-model="email"
						/>
					</div>
					<div>
						<label class="sr-only" for="password">Password</label>
						<input
							class="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
							id="password"
							name="password"
							placeholder="Password"
							required
							type="password"
							v-model="password"
						/>
					</div>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
							id="remember-me"
							name="remember-me"
							type="checkbox"
						/>
						<label class="ml-3 block text-sm leading-6 text-gray-900" for="remember-me">
							Remember me
						</label>
					</div>

					<div class="text-sm leading-6">
						<a class="font-semibold text-indigo-600 hover:text-indigo-500" href="#">
							Forgot password?
						</a>
					</div>
				</div>

				<div>
					<MButton
						:is-loading="isLoading"
						class="w-full justify-center"
						color="indigo"
						size="big"
						type="submit"
					>
						Sign in
					</MButton>
				</div>
			</form>

			<p class="text-center text-sm leading-6 text-gray-500">
				Not a member?
				{{ ' ' }}
				<RouterLink :to="registerRoute" class="font-semibold text-indigo-600 hover:text-indigo-500">
					Register
				</RouterLink>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import MButton from '@/components/MButton.vue'
import Logo from '@/components/MLogo.vue'
import Alert from '@/components/form/MAlert.vue'
import { homeRoute, registerRoute } from '@/router'
import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFirebaseAuth } from 'vuefire'

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
