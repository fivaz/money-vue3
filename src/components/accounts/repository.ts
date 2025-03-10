import { useCurrentUser, useFirestore } from 'vuefire'
import { collection, addDoc, updateDoc, query, orderBy, doc, deleteDoc } from 'firebase/firestore'
import { DB_PATH } from '@/lib/const.ts'
import type { Account } from '@/components/accounts/service.ts'
import type { Budget } from '@/components/budgets/service.ts'

export function fetchAccountsCollection() {
  console.log('fetchAccountsCollection')
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')
  return collection(db, DB_PATH.USERS, user.value.uid, DB_PATH.ACCOUNTS)
}

export async function addAccount(account: Account) {
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')

  const accountsCollection = collection(db, DB_PATH.USERS, user.value.uid, DB_PATH.ACCOUNTS)
  return addDoc(accountsCollection, deepCopy(account))
}

export async function updateAccount(accountId: string, account: Account) {
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')

  const accountRef = doc(db, DB_PATH.USERS, user.value.uid, DB_PATH.ACCOUNTS, accountId)
  return updateDoc(accountRef, deepCopy(account))
}

export function deepCopy(account: Account): Account {
  // this is necessary cause the id of the object we get from firebase has the ids hidden, and they will disappear in a swallow copy
  return {
    ...account,
    id: account.id,
  }
}

export async function deleteAccount(accountId: string) {
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')

  const accountRef = doc(db, DB_PATH.USERS, user.value.uid, DB_PATH.ACCOUNTS, accountId)
  return updateDoc(accountRef, { isDeleted: new Date().toISOString() })
}
