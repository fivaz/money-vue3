<template>
	<Menu as="div" class="relative inline-block text-left">
		<div>
			<MenuButton
				class="rounded px-1.5 py-1 text-sm font-semibold leading-6 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-gray-100 dark:hover:bg-white/30"
			>
				<Settings class="h-4 w-4" />
			</MenuButton>
			<transition
				enter-active-class="transition duration-100 ease-out"
				enter-from-class="transform scale-95 opacity-0"
				enter-to-class="transform scale-100 opacity-100"
				leave-active-class="transition duration-75 ease-in"
				leave-from-class="transform scale-100 opacity-100"
				leave-to-class="transform scale-95 opacity-0"
			>
				<MenuItems
					class="absolute right-0 mt-2 w-24 origin-top-right divide-y divide-gray-200 rounded-md border border-gray-200 shadow-lg ring-1 ring-black/5 focus:outline-none dark:divide-gray-700 dark:border-gray-700"
				>
					<MenuItem v-slot="{ active }">
						<div
							:class="[
								active ? 'bg-violet-500 text-white' : '',
								'group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm',
							]"
						>
							<MToggle v-model="isDark">
								<template v-slot:active>
									<Sun class="h-full w-full" />
								</template>
								<template v-slot:inactive>
									<Moon class="h-full w-full" />
								</template>
							</MToggle>
						</div>
					</MenuItem>
					<MenuItem v-slot="{ active }">
						<div
							:class="[
								active ? 'bg-violet-500 text-white' : '',
								'group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm',
							]"
						>
							<button @click="logout" class="text-sm font-semibold leading-6 hover:text-white">
								Log out <span aria-hidden="true">&rarr;</span>
							</button>
						</div>
					</MenuItem>
				</MenuItems>
			</transition>
		</div>
	</Menu>
</template>

<script setup lang="ts">
import MToggle from '@/components/form/MToggle.vue'
import { loginRoute } from '@/router'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { signOut } from 'firebase/auth'
import { Moon, Settings, Sun } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFirebaseAuth } from 'vuefire'

const isDark = ref(false)

watch(isDark, (newValue) => {
	if (newValue) document.documentElement.classList.add('dark')
	else document.documentElement.classList.remove('dark')

	localStorage.setItem('darkMode', isDark.value.toString())
})

onMounted(() => (isDark.value = localStorage.getItem('darkMode') === 'true'))

const router = useRouter()

const auth = useFirebaseAuth()
async function logout() {
	await signOut(auth!)
	void router.push(loginRoute)
}
</script>
