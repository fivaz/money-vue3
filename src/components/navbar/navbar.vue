<!-- Navigation.vue (or whatever your component is named) -->
<script setup lang="ts">
import { Disclosure, DisclosurePanel } from '@headlessui/vue'
import { signOut } from 'firebase/auth'
import { useFirebaseAuth, useCurrentUser } from 'vuefire'
import MobileMenuButton from './mobile-menu-button.vue'
import NLogo from './n-logo.vue'
import NavLinks from './nav-links.vue'
import DarkMode from './dark-mode.vue'
import ProfileDropdown from './profile-dropdown.vue'
import MobileUserInfo from './mobile-user-info.vue'
import { ROUTES } from '@/lib/const.ts'
import { useRouter } from 'vue-router'

const auth = useFirebaseAuth()!
const router = useRouter()

// Get the current authenticated user
const user = useCurrentUser()

const commitHash = `current commit: ${import.meta.env.VITE_COMMIT_HASH}`

// Define user navigation
const userNavigation = [
  ROUTES.PROFILE,
  {
    name: 'Sign out',
    onClick: handleSignOut,
  },
]

function handleSignOut() {
  signOut(auth)
    .then(() => {
      console.log('Signed out successfully')
      router.push(ROUTES.LOGIN.path)
    })
    .catch((error) => {
      console.error('Sign out failed:', error)
    })
}
</script>

<template>
  <Disclosure as="nav" class="bg-white shadow-xs dark:bg-gray-800" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <div class="flex">
          <n-logo v-tooltip="commitHash" class="size-10 self-center" />
          <NavLinks />
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <DarkMode />
          <!-- Only show ProfileDropdown if user is authenticated -->
          <ProfileDropdown
            v-if="user"
            :user="{
              name: user.displayName || 'User',
              email: user.email || 'No email',
              imageUrl: user.photoURL,
            }"
            :user-navigation="userNavigation"
          />
        </div>
        <div class="-mr-2 flex items-center sm:hidden">
          <MobileMenuButton :open="open" />
        </div>
      </div>
    </div>
    <DisclosurePanel class="sm:hidden">
      <NavLinks mobile />
      <!-- Only show MobileUserInfo if user is authenticated -->
      <MobileUserInfo
        v-if="user"
        :user="{
          name: user.displayName || 'User',
          email: user.email || 'No email',
          imageUrl: user.photoURL,
        }"
        :user-navigation="userNavigation"
      />
    </DisclosurePanel>
  </Disclosure>
</template>
