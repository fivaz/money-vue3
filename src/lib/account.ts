import { useFirestore } from 'vuefire'
import { addDoc, collection, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ACCOUNTS, USERS } from '@/lib/consts'

export type Account = {
	id: string
	name: string
	icon: string
	order: number | null
}

export function addAccount(db: ReturnType<typeof useFirestore>, account: Account, userId: string) {
	const { id, ...data } = account
	const accountCollectionRef = collection(db, USERS, userId, ACCOUNTS)

	void addDoc(accountCollectionRef, data)
}
export function editAccount(db: ReturnType<typeof useFirestore>, account: Account, userId: string) {
	const { id, ...data } = account

	const accountDocRef = doc(db, USERS, userId, ACCOUNTS, id)
	void updateDoc(accountDocRef, data)
}

export function deleteAccount(db: ReturnType<typeof useFirestore>, id: string, userId: string) {
	const accountDocRef = doc(db, USERS, userId, ACCOUNTS, id)
	void deleteDoc(accountDocRef)
}
