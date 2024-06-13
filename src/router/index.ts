import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import TransactionsView from '@/views/TransactionsView.vue'

export const homeRoute = '/'
export const loginRoute = '/login'
export const registerRoute = '/register'
export const transactionsRoute = '/transactions'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: homeRoute,
			name: 'home',
			component: HomeView,
			meta: { requiresAuth: true },
		},
		{
			path: transactionsRoute,
			name: 'transactions',
			component: TransactionsView,
			meta: { requiresAuth: true },
		},
		{
			path: loginRoute,
			name: 'login',
			component: LoginView,
		},
		{
			path: registerRoute,
			name: 'register',
			component: RegisterView,
		},
	],
})

export default router
