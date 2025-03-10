import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from 'vuefire'
import MainLayout from '@/components/main-layout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Accounts',
        component: () => import('@/views/accounts-view.vue'),
      },
      {
        path: 'budgets',
        name: 'Budgets',
        component: () => import('@/views/budgets-view.vue'),
      },
      {
        path: 'sources',
        name: 'Sources',
        component: () => import('@/views/sources-view.vue'),
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile-view.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login-view.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register-view.vue'),
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/not-found.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const user = await getCurrentUser()

  if (requiresAuth && !user) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if ((to.name === 'Login' || to.name === 'Register') && user) {
    next('/')
  } else {
    next()
  }
})

export default router
