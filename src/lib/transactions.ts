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

export type TransactionData = Omit<Transaction, 'id'>

export function formatDateOut(transaction: TransactionData): TransactionData {
	return {
		...transaction,
		date: parse(transaction.date, DATETIME_OUT, new Date()).toISOString(),
	}
}

function getData(data: TransactionData) {
	return {
		...data,
		budget: {
			...data.budget,
			id: data.budget.id,
		},
	}
}

function addTransactionTopLevel(
	db: ReturnType<typeof useFirestore>,
	data: Omit<Transaction, 'id'>,
	userId: string,
) {
	const newTransactionRef = doc(collection(db, USERS, userId, TRANSACTIONS))

	void setDoc(newTransactionRef, getData(data))

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
	void setDoc(budgetTransactionDocRef, getData(data))
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
	void updateDoc(transactionDocRef, getData(data))
}

export function removeTransactionFromBudget(
	db: ReturnType<typeof useFirestore>,
	id: string,
	budgetId: string,
	userId: string,
) {
	const transactionDocRef = doc(db, USERS, userId, BUDGETS, budgetId, TRANSACTIONS, id)
	void deleteDoc(transactionDocRef)
}

export function editBudgetTransaction(
	db: ReturnType<typeof useFirestore>,
	data: TransactionData,
	id: string,
	firstBudgetId: string,
	userId: string,
) {
	if (data.budget.id !== firstBudgetId) {
		removeTransactionFromBudget(db, id, firstBudgetId, userId)
		addTransactionToBudget(db, data, id, data.budget.id, userId)
	} else {
		const budgetTransactionDocRef = doc(db, USERS, userId, BUDGETS, firstBudgetId, TRANSACTIONS, id)
		void updateDoc(budgetTransactionDocRef, getData(data))
	}
}

function addTransactionToBudget(
	db: ReturnType<typeof useFirestore>,
	data: TransactionData,
	id: string,
	budgetId: string,
	userId: string,
) {
	const budgetTransactionDocRef = doc(db, USERS, userId, BUDGETS, budgetId, TRANSACTIONS, id)
	void setDoc(budgetTransactionDocRef, getData(data))
}

export function editTransaction(
	db: ReturnType<typeof useFirestore>,
	data: TransactionData,
	id: string,
	firstBudgetId: string,
	userId: string,
) {
	editTransactionTopLevel(db, data, id, userId)
	editBudgetTransaction(db, data, id, firstBudgetId, userId)
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
