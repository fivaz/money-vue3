import { useFirestore } from 'vuefire'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'

export type Transaction = {
  id: string
  amount: number
  description: string
  date: string
}

export type TransactionIn = Omit<Transaction, 'id'> & { id?: string }

export const addTransaction = (
  db: ReturnType<typeof useFirestore>,
  transaction: TransactionIn,
  budgetId: string,
  userId: string
) => {
  const transactionCollectionRef = collection(
    db,
    'users',
    userId,
    'budgets',
    budgetId,
    'transactions'
  )

  void addDoc(transactionCollectionRef, transaction)
}
export const editTransaction = (
  db: ReturnType<typeof useFirestore>,
  transaction: Transaction,
  budgetId: string,
  userId: string
) => {
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

export const hasId = (transactionIn: TransactionIn): transactionIn is Transaction => {
  return !!transactionIn.id
}
