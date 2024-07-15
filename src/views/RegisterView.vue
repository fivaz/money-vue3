<template>
	<div
		class="flex h-screen min-h-full flex-1 flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8"
	>
		<div class="sm:mx-auto sm:w-full sm:max-w-md">
			<MLogo class="mx-auto h-10 w-auto" />
			<h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">
				Create your account
			</h2>
		</div>

		<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
			<div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
				<form @submit.prevent="handleSubmit" class="space-y-6">
					<MAlert v-if="!!errorMessage">{{ errorMessage }}</MAlert>
					<div class="flex flex-col justify-center" v-if="email">
						<h3 class="block text-center text-sm font-medium leading-6">Your Avatar</h3>
						<img :src="codedAvatar" alt="your avatar" class="h-10 w-auto" />
					</div>

					<LabelInput label="Full name" required type="text" v-model="name" />
					<LabelInput label="Email address" required type="email" v-model="email" />
					<LabelInput label="Password" required type="password" v-model="password" />

					<div>
						<MButton
							:is-loading="isLoading"
							class="w-full justify-center"
							color="indigo"
							size="big"
							type="submit"
						>
							Register
						</MButton>
					</div>
				</form>
			</div>

			<p class="mt-10 text-center text-sm text-gray-500">
				Already a member?
				<RouterLink
					:to="loginRoute"
					class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
				>
					Log in
				</RouterLink>
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Auth } from 'firebase/auth'

import MButton from '@/components/MButton.vue'
import MLogo from '@/components/MLogo.vue'
import LabelInput from '@/components/form/LabelInput.vue'
import MAlert from '@/components/form/MAlert.vue'
import { AVATARS, USERS } from '@/lib/consts'
import { homeRoute, loginRoute } from '@/router'
import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
import { minidenticon } from 'minidenticons'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFirebaseAuth, useFirebaseStorage, useFirestore } from 'vuefire'

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
