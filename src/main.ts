import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import installVueFire from '@/lib/firebase.ts'
import { tooltipDirective } from '@/directive/tooltip.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('tooltip', tooltipDirective)

installVueFire(app)
app.mount('#app')
