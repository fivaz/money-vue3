import { useFirestore } from 'vuefire'
import { addDoc, collection, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { BUDGETS, USERS } from '@/lib/consts'

export type Budget = {
	id: string
	name: string
	value: number
}

export type BudgetData = Omit<Budget, 'id'>

export function addBudget(
	db: ReturnType<typeof useFirestore>,
	budget: Omit<BudgetData, 'id'>,
	userId: string,
) {
	const budgetCollectionRef = collection(db, USERS, userId, BUDGETS)

	void addDoc(budgetCollectionRef, budget)
}
export function editBudget(
	db: ReturnType<typeof useFirestore>,
	data: BudgetData,
	id: string,
	userId: string,
) {
	const budgetDocRef = doc(db, USERS, userId, BUDGETS, id)
	void updateDoc(budgetDocRef, data)
}

export function deleteBudget(db: ReturnType<typeof useFirestore>, userId: string, id: string) {
	const budgetDocRef = doc(db, USERS, userId, BUDGETS, id)
	void deleteDoc(budgetDocRef)
}
