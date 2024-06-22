<template>
	<div class="flex min-h-full flex-1 flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
		<div class="sm:mx-auto sm:w-full sm:max-w-md">
			<Logo class="mx-auto h-10 w-auto" />
			<h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
				Create your account
			</h2>
		</div>

		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
			<div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
				<Alert v-if="!!errorMessage">{{ errorMessage }}</Alert>
				<form class="space-y-6" @submit.prevent="handleSubmit">
					<div v-if="email" class="flex flex-col justify-center">
						<h3 class="block text-center text-sm font-medium leading-6 text-gray-900">
							Your Avatar
						</h3>
						<img alt="your avatar" class="h-10 w-auto" :src="codedAvatar" />
					</div>
					<div>
						<label class="block text-sm font-medium leading-6 text-gray-900" for="name">
							Full Name
						</label>
						<div class="mt-2">
							<input
								class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								id="name"
								name="displayName"
								type="text"
								v-model="name"
							/>
						</div>
					</div>
					<div>
						<label class="block text-sm font-medium leading-6 text-gray-900" for="email">
							Email address
						</label>
						<div class="mt-2">
							<input
								autocomplete="email"
								v-model="email"
								class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
								class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								id="password"
								name="password"
								type="password"
								v-model="password"
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							:class="[
								isLoading ? 'bg-indigo-400' : 'bg-indigo-600',
								'flex w-full items-center justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
							]"
							:disabled="isLoading"
						>
							<LoaderCircle v-if="isLoading" class="h-5 w-5 animate-spin" />
							<span v-else>Register</span>
						</button>
					</div>
				</form>
			</div>

			<p class="mt-10 text-center text-sm text-gray-500">
				Already a member?
				<RouterLink
					class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
					:to="loginRoute"
				>
					Log in
				</RouterLink>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { minidenticon } from 'minidenticons'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useFirebaseAuth, useFirebaseStorage, useFirestore } from 'vuefire'
import { doc, setDoc } from 'firebase/firestore'
import { AVATARS, USERS } from '@/lib/consts'
import { homeRoute, loginRoute } from '@/router'
import Logo from '@/components/Logo.vue'
import { LoaderCircle } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { FirebaseError } from 'firebase/app'
import Alert from '@/components/form/Alert.vue'
import type { Auth } from 'firebase/auth'

const errorMessage = ref('')
const name = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const avatar = computed(() => minidenticon(email.value, 95, 45))

const codedAvatar = computed(() => 'data:image/svg+xml;utf8,' + encodeURIComponent(avatar.value))

async function storeAvatar(userId: string, file: Blob): Promise<string> {
	const avatarsRef = storageRef(useFirebaseStorage(), `${USERS}/${userId}/${AVATARS}/`)
	await uploadBytes(avatarsRef, file)
	return await getDownloadURL(avatarsRef)
}

const auth = useFirebaseAuth()!
const db = useFirestore()
const router = useRouter()

async function createUser(
	auth: Auth,
	db: ReturnType<typeof useFirestore>,
	email: string,
	password: string,
	name: string,
	avatar: string,
): Promise<void> {
	const { user } = await createUserWithEmailAndPassword(auth, email, password)

	const photoURL = await storeAvatar(
		user.uid,
		new Blob([avatar], { type: 'image/svg+xml;charset=utf-8' }),
	)

	await updateProfile(user, { displayName: name, photoURL })

	const userRef = doc(db, USERS, user.uid)

	void setDoc(userRef, {
		displayName: name,
		email,
		photoURL,
	})
}

async function handleSubmit() {
	isLoading.value = true
	errorMessage.value = ''
	try {
		await createUser(auth, db, email.value, password.value, name.value, avatar.value)
		void router.push(homeRoute)
	} catch (error) {
		if (error instanceof FirebaseError) {
			if (error.code === 'auth/email-already-in-use') {
				errorMessage.value = 'This email is already in use'
			} else if (error.code === 'auth/weak-password') {
				errorMessage.value = 'Password should be at least 6 characters'
			} else if (error.code === 'auth/network-request-failed') {
				errorMessage.value = "you can't register if you're not connected to the internet"
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
