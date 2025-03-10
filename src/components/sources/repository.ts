import { useCurrentUser, useFirestore } from 'vuefire'
import { collection, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { DB_PATH } from '@/lib/const.ts'
import type { Source } from '@/components/sources/service.ts'
import type { Budget } from '@/components/budgets/service.ts'

export function fetchSourcesCollection() {
  console.log('fetchSourcesCollection')
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')
  return collection(db, DB_PATH.USERS, user.value.uid, DB_PATH.SOURCES)
}

export async function addSource(source: Source) {
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')

  const sourcesCollection = collection(db, DB_PATH.USERS, user.value.uid, DB_PATH.SOURCES)
  return addDoc(sourcesCollection, deepCopy(source))
}

export async function updateSource(sourceId: string, source: Source) {
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')

  const sourceRef = doc(db, DB_PATH.USERS, user.value.uid, DB_PATH.SOURCES, sourceId)
  return updateDoc(sourceRef, deepCopy(source))
}

export function deepCopy(source: Source): Source {
  // this is necessary cause the id of the object we get from firebase has the ids hidden, and they will disappear in a swallow copy
  return {
    ...source,
    id: source.id,
  }
}

export async function deleteSource(sourceId: string) {
  const user = useCurrentUser()
  const db = useFirestore()
  if (!user.value) throw new Error('User not authenticated')

  const sourceRef = doc(db, DB_PATH.USERS, user.value.uid, DB_PATH.SOURCES, sourceId)
  return updateDoc(sourceRef, { isDeleted: new Date().toISOString() })
}
