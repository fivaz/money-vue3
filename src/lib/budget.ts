import { useFirestore } from 'vuefire'
import { addDoc, collection, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { BUDGETS, USERS } from '@/lib/consts'

export type Budget = {
	id: string
	name: string
	value: number
	icon: string
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
