import { initializeApp } from 'firebase/app'
import {
	initializeFirestore,
	persistentLocalCache,
	persistentMultipleTabManager,
} from 'firebase/firestore'

const firebaseConfig = {
	apiKey: import.meta.env.VITE_API_KEY,
	authDomain: import.meta.env.VITE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_APP_ID,
}

const firebaseApp = initializeApp(firebaseConfig)

initializeFirestore(firebaseApp, {
	localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
})

export { firebaseApp }
