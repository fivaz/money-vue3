import { useFirestore } from 'vuefire'
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import type { Budget } from '@/lib/budget'
import { BUDGETS, DATETIME, TRANSACTIONS, USERS } from '@/lib/consts'
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
		date: parse(transaction.date, DATETIME, new Date()).toISOString(),
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
	transaction: Transaction,
	userId: string,
) {
	const { id, ...data } = transaction

	const transactionDocRef = doc(db, USERS, userId, TRANSACTIONS, id)
	void updateDoc(transactionDocRef, data)
}

export function editBudgetTransactionTopLevel(
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
	editBudgetTransactionTopLevel(db, transaction, budgetId, userId)
}

export function hasId(transactionIn: TransactionIn): transactionIn is Transaction {
	return !!transactionIn.id
}
