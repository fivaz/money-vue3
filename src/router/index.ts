import BudgetsView from '@/views/BudgetsView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import { createRouter, createWebHistory } from 'vue-router'

export const homeRoute = '/'
export const budgetsRoute = '/budgets'
export const transactionsRoute = '/transactions'
export const loginRoute = '/login'
export const registerRoute = '/register'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			component: HomeView,
			meta: { requiresAuth: true },
			name: 'home',
			path: homeRoute,
		},
		{
			component: BudgetsView,
			meta: { requiresAuth: true },
			name: 'budgets',
			path: budgetsRoute,
		},
		{
			component: LoginView,
			name: 'login',
			path: loginRoute,
		},
		{
			component: RegisterView,
			name: 'register',
			path: registerRoute,
		},
	],
})

export default router
