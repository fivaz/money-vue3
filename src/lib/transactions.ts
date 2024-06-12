import { useFirestore } from 'vuefire'
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import type { Budget } from '@/lib/budget'

export type Transaction = {
  id: string
  amount: number
  description: string
  date: string
  budget: Budget
}

export type TransactionIn = Omit<Transaction, 'id'> & { id?: string }

function addTransactionTopLevel(
  db: ReturnType<typeof useFirestore>,
  data: Omit<Transaction, 'id'>,
  userId: string
) {
  const newTransactionRef = doc(collection(db, 'users', userId, 'transactions'))

  void setDoc(newTransactionRef, data)

  return newTransactionRef.id
}

function addBudgetTransaction(
  db: ReturnType<typeof useFirestore>,
  data: Omit<Transaction, 'id'>,
  id: string,
  budgetId: string,
  userId: string
) {
  console.log('data', data)
  const budgetTransactionCollectionRef = doc(
    db,
    'users',
    userId,
    'budgets',
    budgetId,
    'transactions',
    id
  )
  void setDoc(budgetTransactionCollectionRef, data)
}

export function addTransaction(
  db: ReturnType<typeof useFirestore>,
  data: Omit<Transaction, 'id'>,
  budgetId: string,
  userId: string
) {
  const id = addTransactionTopLevel(db, data, userId)
  addBudgetTransaction(db, data, id, budgetId, userId)
}
export function editTransaction(
  db: ReturnType<typeof useFirestore>,
  transaction: Transaction,
  budgetId: string,
  userId: string
) {
  const transactionDocRef = doc(
    db,
    'users',
    userId,
    'budgets',
    budgetId,
    'transactions',
    transaction.id
  )
  void updateDoc(transactionDocRef, transaction)
}

export function hasId(transactionIn: TransactionIn): transactionIn is Transaction {
  return !!transactionIn.id
}
