import { BUDGETS, USERS } from '@/lib/consts'
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

export type Budget = {
	icon: string
	id: string
	name: string
	value: number
}

export function addBudget(db: ReturnType<typeof useFirestore>, budget: Budget, userId: string) {
	const { id, ...data } = budget
	const budgetCollectionRef = collection(db, USERS, userId, BUDGETS)
	void addDoc(budgetCollectionRef, data)
}
export function editBudget(db: ReturnType<typeof useFirestore>, budget: Budget, userId: string) {
	const { id, ...data } = budget
	const budgetDocRef = doc(db, USERS, userId, BUDGETS, id)
	void updateDoc(budgetDocRef, data)
}

export function deleteBudget(db: ReturnType<typeof useFirestore>, id: string, userId: string) {
	const budgetDocRef = doc(db, USERS, userId, BUDGETS, id)
	void deleteDoc(budgetDocRef)
}
