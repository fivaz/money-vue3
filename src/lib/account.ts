import { ACCOUNTS, TRANSACTIONS, USERS } from '@/lib/consts'
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
	writeBatch,
} from 'firebase/firestore'
import { useFirestore } from 'vuefire'

export type Account = {
	createdAt: string
	icon: string
	id: string
	isAnnual: boolean
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

export async function deleteAccount(
	db: ReturnType<typeof useFirestore>,
	id: string,
	userId: string,
) {
	const accountDocRef = doc(db, USERS, userId, ACCOUNTS, id)
	void deleteDoc(accountDocRef)
	const transactionsCollectionRef = collection(db, USERS, userId, TRANSACTIONS)
	const q = query(transactionsCollectionRef, where('account.id', '==', id))
	const querySnapshot = await getDocs(q)
	const batch = writeBatch(db)
	const currentDate = new Date().toISOString()
	querySnapshot.forEach((docSnapshot) => {
		// For each document, set the isDeleted field to the current date
		batch.update(docSnapshot.ref, { isDeleted: currentDate })
	})
	await batch.commit()
}
