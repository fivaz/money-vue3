import BudgetsView from '@/views/BudgetsView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import SourcesView from '@/views/SourcesView.vue'
import { createRouter, createWebHistory } from 'vue-router'

export const homeRoute = '/'
export const budgetsRoute = '/budgets'
export const sourcesRoute = '/sources'
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
			component: SourcesView,
			meta: { requiresAuth: true },
			name: 'sources',
			path: sourcesRoute,
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
