import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'
import { useFirestore, useCurrentUser } from 'vuefire'
import { DB_PATH } from '@/lib/const.ts'

export type Source = {
  id: string
  name: string
  createdAt: string
  order: number
  icon: string
  balance: number
  isDeleted: string | null
}

export function getEmptySource(): Source {
  return {
    id: '',
    name: '',
    order: 0,
    icon: '',
    balance: 0,
    createdAt: new Date().toISOString(),
    isDeleted: null,
  }
}
