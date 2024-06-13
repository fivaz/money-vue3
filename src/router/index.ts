import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import BudgetsView from '@/views/BudgetsView.vue'

export const homeRoute = '/'
export const budgetsRoute = '/budgets'
export const transactionsRoute = '/transactions'
export const loginRoute = '/login'
export const registerRoute = '/register'

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
			path: budgetsRoute,
			name: 'budgets',
			component: BudgetsView,
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
