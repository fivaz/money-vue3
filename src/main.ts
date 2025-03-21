import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import installVueFire from '@/lib/firebase.ts'
import { tooltipDirective } from '@/directive/tooltip.ts'
import * as Sentry from '@sentry/vue'

const app = createApp(App)

Sentry.init({
  app,
  dsn: 'https://9796e59bc96724d8a8f44b9011abed12@o4508857555550208.ingest.de.sentry.io/4509013759164496',
})

app.use(createPinia())
app.use(router)
app.directive('tooltip', tooltipDirective)

installVueFire(app)
app.mount('#app')
