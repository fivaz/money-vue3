import type { Account } from '@/lib/account'
import type { Budget } from '@/lib/budget'

import { endOfMonth, isBefore, isSameDay } from 'date-fns'

export type Operation = 'expense' | 'income' | 'transfer'

export type Transaction = {
	account: Account
	amount: number
	annualSource: Account | null
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

export function getBalance(transactions: Transaction[]): number {
	return transactions.reduce((sum, transaction) => {
		if (transaction.isPaid) {
			if (transaction.operation == 'income') {
				return sum + transaction.amount
			}
			if (transaction.operation == 'expense') {
				return sum - transaction.amount
			}
		}
		return sum
	}, 0)
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
