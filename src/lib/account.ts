import { useFirestore } from 'vuefire'
import { addDoc, collection, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ACCOUNTS, USERS } from '@/lib/consts'

export type Account = {
	id: string
	name: string
}

export type AccountData = Omit<Account, 'id'>

export function addAccount(
	db: ReturnType<typeof useFirestore>,
	account: Omit<AccountData, 'id'>,
	userId: string,
) {
	const accountCollectionRef = collection(db, USERS, userId, ACCOUNTS)

	void addDoc(accountCollectionRef, account)
}
export function editAccount(
	db: ReturnType<typeof useFirestore>,
	data: AccountData,
	id: string,
	userId: string,
) {
	const accountDocRef = doc(db, USERS, userId, ACCOUNTS, id)
	void updateDoc(accountDocRef, data)
}

export function deleteAccount(db: ReturnType<typeof useFirestore>, userId: string, id: string) {
	const accountDocRef = doc(db, USERS, userId, ACCOUNTS, id)
	void deleteDoc(accountDocRef)
}
