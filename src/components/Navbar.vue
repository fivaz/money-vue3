<template>
	<div class="h-screen bg-white dark:bg-slate-800">
		<header>
			<nav
				class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
				aria-label="Global"
			>
				<div class="flex flex-1">
					<div class="hidden lg:flex lg:gap-x-12">
						<RouterLink
							v-for="item in navigation"
							:key="item.name"
							:to="item.href"
							class="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
						>
							{{ item.name }}
						</RouterLink>
					</div>
					<div class="flex lg:hidden">
						<button
							type="button"
							class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-slate-400"
							@click="mobileMenuOpen = true"
						>
							<span class="sr-only">Open main menu</span>
							<Bars3Icon class="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
				</div>
				<div class="-m-1.5 p-1.5">
					<span class="sr-only">Money</span>
					<Logo class="h-8 w-auto" />
				</div>
				<div class="flex flex-1 justify-end gap-5">
					<NavbarMenu />
				</div>
			</nav>
			<Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
				<div class="fixed inset-0 z-10" />
				<DialogPanel
					class="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 dark:bg-slate-800"
				>
					<div class="flex items-center justify-between">
						<div class="flex flex-1">
							<button
								type="button"
								class="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-slate-400"
								@click="mobileMenuOpen = false"
							>
								<span class="sr-only">Close menu</span>
								<XMarkIcon class="h-6 w-6" aria-hidden="true" />
							</button>
						</div>
						<div class="-m-1.5 p-1.5">
							<span class="sr-only">Money</span>
							<Logo class="h-8 w-auto" />
						</div>
						<div class="flex flex-1 justify-end gap-5">
							<NavbarMenu />
						</div>
					</div>
					<div class="mt-6 space-y-2">
						<RouterLink
							v-for="item in navigation"
							:key="item.name"
							:to="item.href"
							@click="mobileMenuOpen = false"
							class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-900"
						>
							{{ item.name }}
						</RouterLink>
					</div>
				</DialogPanel>
			</Dialog>
		</header>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="mx-auto max-w-3xl">
				<slot />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { budgetsRoute, homeRoute } from '@/router'
import Logo from '@/components/Logo.vue'
import NavbarMenu from '@/components/NavbarMenu.vue'

const navigation = [
	{ name: 'Home', href: homeRoute },
	{ name: 'Budgets', href: budgetsRoute },
]

const mobileMenuOpen = ref(false)
</script>
