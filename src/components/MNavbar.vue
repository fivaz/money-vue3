<template>
	<div :class="['min-h-screen', MAIN_COLOR_BG, MAIN_COLOR_TEXT]">
		<header>
			<nav
				aria-label="Global"
				class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
			>
				<div class="flex flex-1">
					<!-- desktop links-->
					<div class="hidden lg:flex lg:gap-x-12">
						<RouterLink
							:key="page.name"
							:to="page.link"
							class="text-sm font-semibold leading-6"
							v-for="page in pages"
						>
							{{ page.name }}
						</RouterLink>
					</div>
					<!-- open mobile menu button -->
					<div class="flex lg:hidden">
						<button
							:class="[
								'-m-2.5 inline-flex items-center justify-center rounded-md p-2.5',
								SECONDARY_COLOR_TEXT,
							]"
							@click="mobileMenuOpen = true"
							type="button"
						>
							<span class="sr-only">Open main menu</span>
							<Bars3Icon aria-hidden="true" class="h-6 w-6" />
						</button>
					</div>
				</div>
				<div class="-m-1.5 p-1.5">
					<MLogo class="h-8 w-auto" />
				</div>
				<div class="flex flex-1 justify-end gap-5">
					<NavbarMenu />
				</div>
			</nav>
			<Dialog :open="mobileMenuOpen" @close="mobileMenuOpen = false" class="lg:hidden">
				<div class="fixed inset-0 z-10" />
				<DialogPanel
					:class="[
						MAIN_COLOR_BG,
						MAIN_COLOR_TEXT,
						'fixed inset-y-0 left-0 z-10 w-full overflow-y-auto p-6',
					]"
				>
					<div class="flex items-center justify-between">
						<div class="flex flex-1">
							<button
								:class="['-m-2.5 rounded-md p-2.5', SECONDARY_COLOR_TEXT]"
								@click="mobileMenuOpen = false"
								type="button"
							>
								<span class="sr-only">Close menu</span>
								<XMarkIcon aria-hidden="true" class="h-6 w-6" />
							</button>
						</div>
						<div class="-m-1.5 p-1.5">
							<span class="sr-only">Money</span>
							<MLogo class="h-8 w-auto" />
						</div>
						<div class="flex flex-1 justify-end gap-5">
							<NavbarMenu />
						</div>
					</div>
					<div class="mt-6 space-y-2">
						<RouterLink
							:class="[
								MAIN_HOVER_COLOR_BG,
								'-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7',
							]"
							:key="item.name"
							:to="item.link"
							@click="mobileMenuOpen = false"
							v-for="item in pages"
						>
							{{ item.name }}
						</RouterLink>
					</div>
				</DialogPanel>
			</Dialog>
		</header>
		<div class="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
			<div class="mx-auto max-w-3xl">
				<slot />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import MLogo from '@/components/MLogo.vue'
import NavbarMenu from '@/components/NavbarMenu.vue'
import {
	MAIN_COLOR_BG,
	MAIN_COLOR_TEXT,
	MAIN_HOVER_COLOR_BG,
	SECONDARY_COLOR_TEXT,
} from '@/lib/consts'
import { budgetsRoute, homeRoute, sourcesRoute } from '@/router'
import { Dialog, DialogPanel } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const pages = [
	{ link: homeRoute, name: 'Home' },
	{ link: budgetsRoute, name: 'Budgets' },
	{ link: sourcesRoute, name: 'Sources' },
]

const mobileMenuOpen = ref(false)
</script>
