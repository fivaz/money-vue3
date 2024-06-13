import { useFirestore } from 'vuefire'
import { collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import type { Budget } from '@/lib/budget'
import { ACCOUNTS, BUDGETS, DATETIME_OUT, TRANSACTIONS, USERS } from '@/lib/consts'
import { format, parse, parseISO } from 'date-fns'
import type { Account } from '@/lib/account'

export type Transaction = {
	id: string
	amount: number
	description: string
	date: string
	budget: Budget | null
	account: Account
}

export type TransactionData = Omit<Transaction, 'id'>

export function formatDateOut(transaction: TransactionData): TransactionData {
	return {
		...transaction,
		date: parse(transaction.date, DATETIME_OUT, new Date()).toISOString(),
	}
}

export function getData(data: TransactionData) {
	return {
		...data,
		account: {
			...data.account,
			id: data.account.id,
		},
		budget: data.budget
			? {
					...data.budget,
					id: data.budget.id,
				}
			: null,
	}
}

function addAccountTransaction(
	db: ReturnType<typeof useFirestore>,
	data: Omit<Transaction, 'id'>,
	accountId: string,
	userId: string,
) {
	const newTransactionRef = doc(collection(db, USERS, userId, ACCOUNTS, accountId, TRANSACTIONS))

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
	accountId: string,
	budgetId: string | undefined,
	userId: string,
) {
	const id = addAccountTransaction(db, data, accountId, userId)
	if (budgetId) {
		addBudgetTransaction(db, data, id, budgetId, userId)
	}
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

export function editAccountTransaction(
	db: ReturnType<typeof useFirestore>,
	data: TransactionData,
	id: string,
	firstAccountId: string,
	userId: string,
) {
	if (data.account.id !== firstAccountId) {
		removeTransactionFromBudget(db, id, firstAccountId, userId)
		addTransactionToBudget(db, data, id, data.account.id, userId)
	} else {
		const accountTransactionDocRef = doc(
			db,
			USERS,
			userId,
			ACCOUNTS,
			firstAccountId,
			TRANSACTIONS,
			id,
		)
		void updateDoc(accountTransactionDocRef, getData(data))
	}
}

export function editBudgetTransaction(
	db: ReturnType<typeof useFirestore>,
	data: TransactionData,
	id: string,
	firstBudgetId: string | undefined,
	userId: string,
) {
	const hasNewGoal = !!data.budget
	const hasFormerGoal = !!firstBudgetId

	if (hasNewGoal && !hasFormerGoal) {
		addTransactionToBudget(db, data, id, data.budget!.id, userId)
	} else if (!hasNewGoal && hasFormerGoal) {
		removeTransactionFromBudget(db, id, firstBudgetId, userId)
	} else if (hasNewGoal && hasFormerGoal) {
		if (data.budget!.id !== firstBudgetId) {
			removeTransactionFromBudget(db, id, firstBudgetId, userId)
		}
		addTransactionToBudget(db, data, id, data.budget!.id, userId)
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
	firstAccountId: string,
	firstBudgetId: string | undefined,
	userId: string,
) {
	editAccountTransaction(db, data, id, firstAccountId, userId)
	editBudgetTransaction(db, data, id, firstBudgetId, userId)
}

export function deleteAccountTransaction(
	db: ReturnType<typeof useFirestore>,
	userId: string,
	accountId: string,
	id: string,
) {
	const transactionDocRef = doc(db, USERS, userId, ACCOUNTS, accountId, TRANSACTIONS, id)
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
	accountId: string,
	budgetId: string | undefined,
	id: string,
) {
	deleteAccountTransaction(db, userId, accountId, id)
	if (budgetId) {
		deleteBudgetTransaction(db, userId, budgetId, id)
	}
}

export function formatDateIn(transaction: TransactionData): TransactionData {
	return {
		...transaction,
		date: format(parseISO(transaction.date), DATETIME_OUT),
	}
}
