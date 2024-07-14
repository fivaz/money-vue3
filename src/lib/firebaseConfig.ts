import { initializeApp } from 'firebase/app'
import {
	initializeFirestore,
	persistentLocalCache,
	persistentMultipleTabManager,
} from 'firebase/firestore'

const firebaseConfig = {
	apiKey: import.meta.env.VITE_API_KEY,
	appId: import.meta.env.VITE_APP_ID,
	authDomain: import.meta.env.VITE_AUTH_DOMAIN,
	messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
	projectId: import.meta.env.VITE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
}

const firebaseApp = initializeApp(firebaseConfig)

initializeFirestore(firebaseApp, {
	localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
})

export { firebaseApp }
