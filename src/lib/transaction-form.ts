import type { Account } from '@/lib/account'
import type { Budget } from '@/lib/budget'
import type { Transaction } from '@/lib/transaction'

import { DATETIME_OUT, TRANSACTIONS, USERS } from '@/lib/consts'
import { endOfMonth, format, isBefore, isSameDay, parseISO } from 'date-fns'
import { collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

export function formatDateIn(transaction: Transaction): Transaction {
	return {
		...transaction,
		date: format(parseISO(transaction.date), DATETIME_OUT),
		id: transaction.id,
	}
}

export function formatDateOut(transaction: Transaction): Transaction {
	return {
		...transaction,
		amount: Number(transaction.amount),
		date: new Date(transaction.date).toISOString(),
	}
}

export function getData(transaction: Transaction): Omit<Transaction, 'id'> {
	// this is necessary cause the id of the object we get from firebase has the ids hidden, and they will disappear in a swallow copy
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
		destination: transaction.destination
			? {
					...transaction.destination,
					id: transaction.destination.id,
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
