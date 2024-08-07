import { firebaseApp } from '@/lib/firebaseConfig'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { VueFire, VueFireAuth, getCurrentUser } from 'vuefire'

import App from './App.vue'
import './assets/main.css'
import router, { loginRoute } from './router'

const app = createApp(App)

app.use(createPinia())

router.beforeEach(async (to) => {
	// routes with `meta: { requiresAuth: true }` will check for
	// the users, others won't
	if (to.meta.requiresAuth) {
		const currentUser = await getCurrentUser()
		// if the user is not logged in, redirect to the login page
		if (!currentUser) {
			return {
				path: loginRoute,
				query: {
					// we keep the current path in the query so we can
					// redirect to it after login with
					// `router.push(route.query.redirect || '/')`
					redirect: to.fullPath,
				},
			}
		}
	}
})

app.use(router)

app.use(VueFire, {
	// imported above but could also just be created here
	firebaseApp,
	modules: [
		// we will see other modules later on
		VueFireAuth(),
	],
})

app.mount('#app')
