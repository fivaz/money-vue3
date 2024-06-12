import { useFirestore } from 'vuefire'
import { collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import type { Budget } from '@/lib/budget'
import { BUDGETS, DATETIME_OUT, TRANSACTIONS, USERS } from '@/lib/consts'
import { format, parse, parseISO } from 'date-fns'

export type Transaction = {
	id: string
	amount: number
	description: string
	date: string
	budget: Budget
}

export type TransactionData = Omit<Transaction, 'id'> & { id?: string }

export function formatDateOut(transaction: TransactionData): TransactionData {
	return {
		...transaction,
		date: parse(transaction.date, DATETIME_OUT, new Date()).toISOString(),
	}
}

function addTransactionTopLevel(
	db: ReturnType<typeof useFirestore>,
	data: Omit<Transaction, 'id'>,
	userId: string,
) {
	const newTransactionRef = doc(collection(db, USERS, userId, TRANSACTIONS))

	void setDoc(newTransactionRef, data)

	return newTransactionRef.id
}

function addBudgetTransaction(
	db: ReturnType<typeof useFirestore>,
	data: Omit<Transaction, 'id'>,
	id: string,
	budgetId: string,
	userId: string,
) {
	const budgetTransactionDocRef = doc(db, USERS, userId, BUDGETS, budgetId, TRANSACTIONS, id)
	void setDoc(budgetTransactionDocRef, data)
}

export function addTransaction(
	db: ReturnType<typeof useFirestore>,
	data: Omit<Transaction, 'id'>,
	budgetId: string,
	userId: string,
) {
	const id = addTransactionTopLevel(db, data, userId)
	addBudgetTransaction(db, data, id, budgetId, userId)
}

export function editTransactionTopLevel(
	db: ReturnType<typeof useFirestore>,
	data: TransactionData,
	id: string,
	userId: string,
) {
	const transactionDocRef = doc(db, USERS, userId, TRANSACTIONS, id)
	void updateDoc(transactionDocRef, data)
}

export function editBudgetTransaction(
	db: ReturnType<typeof useFirestore>,
	data: TransactionData,
	id: string,
	budgetId: string,
	userId: string,
) {
	const budgetTransactionDocRef = doc(db, USERS, userId, BUDGETS, budgetId, TRANSACTIONS, id)
	void updateDoc(budgetTransactionDocRef, data)
}

export function editTransaction(
	db: ReturnType<typeof useFirestore>,
	data: TransactionData,
	id: string,
	budgetId: string,
	userId: string,
) {
	editTransactionTopLevel(db, data, id, userId)
	editBudgetTransaction(db, data, id, budgetId, userId)
}

export function deleteTransactionTopLevel(
	db: ReturnType<typeof useFirestore>,
	userId: string,
	id: string,
) {
	const transactionDocRef = doc(db, USERS, userId, TRANSACTIONS, id)
	void deleteDoc(transactionDocRef)
}

export function deleteBudgetTransaction(
	db: ReturnType<typeof useFirestore>,
	userId: string,
	budgetId: string,
	id: string,
) {
	const transactionDocRef = doc(db, USERS, userId, BUDGETS, budgetId, TRANSACTIONS, id)
	void deleteDoc(transactionDocRef)
}

export function deleteTransaction(
	db: ReturnType<typeof useFirestore>,
	userId: string,
	budgetId: string,
	id: string,
) {
	deleteTransactionTopLevel(db, userId, id)
	deleteBudgetTransaction(db, userId, budgetId, id)
}

export function formatDateIn(transaction: TransactionData): TransactionData {
	return {
		...transaction,
		date: format(parseISO(transaction.date), DATETIME_OUT),
	}
}
