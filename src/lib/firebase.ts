// src/firebase.ts
import { initializeApp } from 'firebase/app'
import { VueFire, VueFireAuth } from 'vuefire'
import type { App } from 'vue'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  appId: import.meta.env.VITE_APP_ID,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
}

export const firebaseApp = initializeApp(firebaseConfig)

export default function installVueFire(app: App) {
  app.use(VueFire, {
    firebaseApp,
    modules: [VueFireAuth()],
  })
}
