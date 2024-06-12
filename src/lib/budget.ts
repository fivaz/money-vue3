import { useFirestore } from 'vuefire'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { BUDGETS, USERS } from '@/lib/consts'

export type Budget = {
	id: string
	name: string
	value: number
}

export type BudgetIn = Omit<Budget, 'id'> & { id?: string }

export function addBudget(db: ReturnType<typeof useFirestore>, budget: BudgetIn, userId: string) {
	const budgetCollectionRef = collection(db, USERS, userId, BUDGETS)

	void addDoc(budgetCollectionRef, budget)
}
export function editBudget(db: ReturnType<typeof useFirestore>, budget: Budget, userId: string) {
	const budgetDocRef = doc(db, USERS, userId, BUDGETS, budget.id)
	void updateDoc(budgetDocRef, budget)
}

export function hasId(budgetIn: BudgetIn): budgetIn is Budget {
	return !!budgetIn.id
}
