import { useFirestore } from 'vuefire'
import { collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import type { Budget } from '@/lib/budget'
import { DATETIME_OUT, TRANSACTIONS, USERS } from '@/lib/consts'
import { format, parse, parseISO } from 'date-fns'
import type { Account } from '@/lib/account'

export type Transaction = {
	id: string
	amount: number
	description: string
	date: string
	budget: Budget | null
	account: Account
	destination?: Account
}

export function formatDateOut(transaction: Transaction): Transaction {
	return {
		...transaction,
		date: parse(transaction.date, DATETIME_OUT, new Date()).toISOString(),
	}
}

export function getData(transaction: Transaction): Omit<Transaction, 'id'> {
	const { id, ...data } = {
		...transaction,
		account: {
			...transaction.account,
			id: transaction.account.id,
		},
		budget: transaction.budget
			? {
					...transaction.budget,
					id: transaction.budget.id,
				}
			: null,
	}
	return data
}

export function addTransaction(
	db: ReturnType<typeof useFirestore>,
	transaction: Transaction,
	userId: string,
) {
	const newTransactionRef = doc(collection(db, USERS, userId, TRANSACTIONS))

	void setDoc(newTransactionRef, getData(transaction))
}

export function editTransaction(
	db: ReturnType<typeof useFirestore>,
	transaction: Transaction,
	userId: string,
) {
	const transactionDocRef = doc(db, USERS, userId, TRANSACTIONS, transaction.id)
	void updateDoc(transactionDocRef, getData(transaction))
}

export function deleteTransaction(db: ReturnType<typeof useFirestore>, id: string, userId: string) {
	const transactionDocRef = doc(db, USERS, userId, TRANSACTIONS, id)
	void deleteDoc(transactionDocRef)
}

export function formatDateIn(transaction: Transaction): Transaction {
	return {
		...transaction,
		date: format(parseISO(transaction.date), DATETIME_OUT),
	}
}
