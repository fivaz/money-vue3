
import { SOURCES, USERS } from '@/lib/consts'
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	updateDoc,
} from 'firebase/firestore'
import { useFirestore } from 'vuefire'

export type Source = {
	balance: number
	id: string
	name: string
	order: null | number
}

export function addSource(db: ReturnType<typeof useFirestore>, source: Source, userId: string) {
	const { id, ...data } = source
	const sourceCollectionRef = collection(db, USERS, userId, SOURCES)

	void addDoc(sourceCollectionRef, data)
}
export function editSource(db: ReturnType<typeof useFirestore>, source: Source, userId: string) {
	const { id, ...data } = source

	const sourceDocRef = doc(db, USERS, userId, SOURCES, id)
	void updateDoc(sourceDocRef, data)
}

export async function deleteSource(
	db: ReturnType<typeof useFirestore>,
	id: string,
	userId: string,
) {
	const sourceDocRef = doc(db, USERS, userId, SOURCES, id)
	void deleteDoc(sourceDocRef)
}
