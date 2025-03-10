import { useCurrentUser, useFirestore } from 'vuefire'
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { DB_PATH } from '@/lib/const.ts'
import type { Budget } from '@/components/budgets/service.ts'
import type { Transaction } from '@/components/transactions/service.ts'

export function fetchBudgetsCollection() {
  console.log('fetchBudgetsCollection')
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')
  return collection(db, DB_PATH.USERS, user.value.uid, DB_PATH.BUDGETS)
}

export async function addBudget(budget: Budget) {
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')

  const budgetsCollection = collection(db, DB_PATH.USERS, user.value.uid, DB_PATH.BUDGETS)
  return addDoc(budgetsCollection, deepCopy(budget))
}

export async function updateBudget(budgetId: string, budget: Budget) {
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')

  const budgetRef = doc(db, DB_PATH.USERS, user.value.uid, DB_PATH.BUDGETS, budgetId)
  return updateDoc(budgetRef, deepCopy(budget))
}

export function deepCopy(budget: Budget): Budget {
  // this is necessary cause the id of the object we get from firebase has the ids hidden, and they will disappear in a swallow copy
  return {
    ...budget,
    id: budget.id,
    parent: budget.parent
      ? {
          ...budget.parent,
          id: budget.parent.id,
        }
      : null,
  }
}

export async function deleteBudget(budgetId: string) {
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')

  const budgetRef = doc(db, DB_PATH.USERS, user.value.uid, DB_PATH.BUDGETS, budgetId)
  return updateDoc(budgetRef, { isDeleted: new Date().toISOString() })
}
