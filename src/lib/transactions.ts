import { useFirestore } from 'vuefire'
import { collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import type { Budget } from '@/lib/budget'
import { BUDGETS, DATETIME_OUT, TRANSACTIONS, USERS } from '@/lib/consts'
import { parse } from 'date-fns'

export type Transaction = {
	id: string
	amount: number
	description: string
	date: string
	budget: Budget
}

export type TransactionIn = Omit<Transaction, 'id'> & { id?: string }

export function parseTransaction(transaction: TransactionIn): TransactionIn {
	return {
		...transaction,
		date: parse(transaction.date, DATETIME_OUT, new Date()).toISOString(),
	}
}

export function hasId(transactionIn: TransactionIn): transactionIn is Transaction {
	return !!transactionIn.id
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
	transaction: Transaction,
	userId: string,
) {
	const { id, ...data } = transaction

	const transactionDocRef = doc(db, USERS, userId, TRANSACTIONS, id)
	void updateDoc(transactionDocRef, data)
}

export function editBudgetTransaction(
	db: ReturnType<typeof useFirestore>,
	transaction: Transaction,
	budgetId: string,
	userId: string,
) {
	const { id, ...data } = transaction

	const budgetTransactionDocRef = doc(db, USERS, userId, BUDGETS, budgetId, TRANSACTIONS, id)
	void updateDoc(budgetTransactionDocRef, data)
}

export function editTransaction(
	db: ReturnType<typeof useFirestore>,
	transaction: Transaction,
	budgetId: string,
	userId: string,
) {
	editTransactionTopLevel(db, transaction, userId)
	editBudgetTransaction(db, transaction, budgetId, userId)
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
	transaction: Transaction,
) {
	const transactionDocRef = doc(
		db,
		USERS,
		userId,
		BUDGETS,
		transaction.budget.id,
		TRANSACTIONS,
		transaction.id,
	)

	void deleteDoc(transactionDocRef)
}

export function deleteTransaction(
	db: ReturnType<typeof useFirestore>,
	userId: string,
	transaction: Transaction,
) {
	deleteTransactionTopLevel(db, userId, transaction.id)
	deleteBudgetTransaction(db, userId, transaction)
}
