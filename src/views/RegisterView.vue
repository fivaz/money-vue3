<script setup lang="ts">
import { computed, ref } from 'vue'
import { minidenticon } from 'minidenticons'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useFirebaseAuth, useFirebaseStorage, useFirestore } from 'vuefire'
import { doc, setDoc } from 'firebase/firestore'
const name = ref('')
const email = ref('')
const password = ref('')

const avatar = computed(() => minidenticon(email.value, 95, 45))

const codedAvatar = computed(() => 'data:image/svg+xml;utf8,' + encodeURIComponent(avatar.value))

async function storeAvatar(userId: string, file: Blob): Promise<string> {
  const avatarsRef = storageRef(useFirebaseStorage(), `avatars/${userId}`)
  await uploadBytes(avatarsRef, file)
  return await getDownloadURL(avatarsRef)
}

const auth = useFirebaseAuth()!

async function handleSubmit() {
  console.log(name.value, email.value, password.value, codedAvatar.value)
  const { user } = await createUserWithEmailAndPassword(auth, email.value, password.value)

  const photoURL = await storeAvatar(
    user.uid,
    new Blob([avatar.value], { type: 'image/svg+xml;charset=utf-8' })
  )

  await updateProfile(user, { displayName: name.value, photoURL: photoURL })

  const userRef = doc(useFirestore(), 'users', user.uid)

  await setDoc(userRef, {
    displayName: name.value,
    email: email.value,
    photoURL
  })
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img
        alt="Your Company"
        class="mx-auto h-10 w-auto"
        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
      />
      <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Create your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
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
            <button class="w-full leading-6" type="submit">Register</button>
          </div>
        </form>
      </div>

      <p class="mt-10 text-center text-sm text-gray-500">
        Already a member?
        <a class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500" href="/login">
          Log in
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped></style>
