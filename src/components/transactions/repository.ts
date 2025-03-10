import { useCurrentUser, useFirestore } from 'vuefire'
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { DB_PATH } from '@/lib/const.ts'
import type { Transaction } from '@/components/transactions/service.ts'

export function fetchTransactionsCollection() {
  console.log('fetchTransactionsCollection')
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')
  return collection(db, DB_PATH.USERS, user.value.uid, DB_PATH.TRANSACTIONS)
}

export async function addTransaction(transaction: Transaction) {
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')

  const transactionsCollection = collection(db, DB_PATH.USERS, user.value.uid, DB_PATH.TRANSACTIONS)
  return addDoc(transactionsCollection, deepCopy(transaction))
}

export async function updateTransaction(transactionId: string, transaction: Transaction) {
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')

  const transactionRef = doc(db, DB_PATH.USERS, user.value.uid, DB_PATH.TRANSACTIONS, transactionId)
  return updateDoc(transactionRef, deepCopy(transaction))
}

export function deepCopy(transaction: Transaction): Transaction {
  // this is necessary cause the id of the object we get from firebase has the ids hidden, and they will disappear in a swallow copy
  return {
    ...transaction,
    id: transaction.id,
    account: {
      ...transaction.account,
      id: transaction.account.id,
    },
    annualSource: transaction.annualSource
      ? {
          ...transaction.annualSource,
          id: transaction.annualSource.id,
        }
      : null,
    budget: transaction.budget
      ? {
          ...transaction.budget,
          id: transaction.budget.id,
        }
      : null,
    destination: transaction.destination
      ? {
          ...transaction.destination,
          id: transaction.destination.id,
        }
      : null,
  }
}

export async function deleteTransaction(transactionId: string) {
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')

  const transactionRef = doc(db, DB_PATH.USERS, user.value.uid, DB_PATH.TRANSACTIONS, transactionId)
  return updateDoc(transactionRef, { isDeleted: new Date().toISOString() })
}
