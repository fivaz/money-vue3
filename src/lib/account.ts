import { ACCOUNTS, USERS } from '@/lib/consts'
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

export type Account = {
	currentAmount: number
	icon: string
	id: string
	name: string
	order: null | number
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
