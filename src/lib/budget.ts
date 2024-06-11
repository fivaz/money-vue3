import { useFirestore } from 'vuefire'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'

export type Budget = {
  id: string
  name: string
  value: number
}

export type BudgetIn = Omit<Budget, 'id'> & { id?: string }

export const addBudget = (
  db: ReturnType<typeof useFirestore>,
  budget: BudgetIn,
  userId: string
) => {
  const budgetCollectionRef = collection(db, 'users', userId, 'budgets')

  void addDoc(budgetCollectionRef, budget)
}
export const editBudget = (db: ReturnType<typeof useFirestore>, budget: Budget, userId: string) => {
  const budgetDocRef = doc(db, 'users', userId, 'budgets', budget.id)
  void updateDoc(budgetDocRef, budget)
}

export const hasId = (budgetIn: BudgetIn): budgetIn is Budget => {
  return !!budgetIn.id
}
