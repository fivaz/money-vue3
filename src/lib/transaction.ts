import type { Account } from '@/lib/account'
import type { Budget } from '@/lib/budget'

import { DATETIME_OUT, TRANSACTIONS, USERS } from '@/lib/consts'
import { endOfMonth, format, isBefore, isSameDay, parseISO } from 'date-fns'
import { collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

export type Operation = 'expense' | 'income' | 'transfer'

export type Transaction = {
	account: Account
	amount: number
	budget: Budget | null
	date: string
	description: string
	destination: Account | null
	endDate: null | string
	id: string
	isDeleted: null | string
	isPaid: boolean
	operation: Operation
	referenceDate: null | string
	startDate: null | string
}

export function parseAmount(transaction: Transaction, accountId: string) {
	if (
		transaction.operation === 'expense' ||
		(transaction.operation === 'transfer' && accountId === transaction.account.id)
	) {
		return transaction.amount * -1
	}
	return transaction.amount
}

export function formatDateOut(transaction: Transaction): Transaction {
	return {
		...transaction,
		amount: Number(transaction.amount),
		date: new Date(transaction.date).toISOString(),
	}
}

export function getData(transaction: Transaction): Omit<Transaction, 'id'> {
	// this is necessary cause the id of the object we get from firebase has the ids hidden and they will disappear in a swallow copy
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

export function formatDateIn(transaction: Transaction): Transaction {
	return {
		...transaction,
		date: format(parseISO(transaction.date), DATETIME_OUT),
		id: transaction.id,
	}
}

function expandTransaction(currentDate: Date, transaction: Transaction) {
	const transactions: Transaction[] = []
	const currentOccurrence = new Date(transaction.date)

	while (
		currentOccurrence <= new Date(transaction.endDate!) &&
		currentOccurrence <= endOfMonth(currentDate)
	) {
		if (currentOccurrence >= new Date(transaction.startDate!)) {
			transactions.push({
				...transaction,
				date: currentOccurrence.toISOString(),
				id: transaction.id,
			})
		}
		currentOccurrence.setMonth(currentOccurrence.getMonth() + 1)
	}

	return transactions
}

export function getExpandedTransactions(currentDate: Date, transactions: Transaction[]) {
	return transactions.flatMap((transaction) => {
		if (transaction.startDate && transaction.endDate) {
			return expandTransaction(currentDate, transaction)
		} else {
			return transaction
		}
	})
}

export function getHistoricalTransactions(
	currentDate: Date,
	transactions: Transaction[],
	useReferenceDate = false,
) {
	const expandedTransactions = getExpandedTransactions(currentDate, transactions)
	return expandedTransactions.filter((transaction) => {
		const endOfCurrentMonth = endOfMonth(currentDate)

		const transactionDate = new Date(
			useReferenceDate && transaction.referenceDate ? transaction.referenceDate : transaction.date,
		)
		return (
			isBefore(transactionDate, endOfCurrentMonth) || isSameDay(transactionDate, endOfCurrentMonth)
		)
	})
}
