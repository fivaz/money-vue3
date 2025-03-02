import type { Account } from '@/lib/account'
import type { Budget } from '@/lib/budget'

import { DATE } from '@/lib/consts'
import { endOfMonth, isBefore, isSameDay, parse } from 'date-fns'

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

// convert recurring transactions into multiple individual transactions for each date of the month
function expandTransaction(
	currentDate: Date,
	transaction: { endDate: string; startDate: string } & Transaction,
): Transaction[] {
	const transactions: Transaction[] = []
	const currentOccurrence = new Date(transaction.startDate)

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

function expandAnnualTransaction(
	currentDate: Date,
	transaction: { annualSource: Account; endDate: string; startDate: string } & Transaction,
) {
	const transactions: Transaction[] = [transaction]

	const currentOccurrence = parse(transaction.startDate, DATE, new Date())

	while (
		currentOccurrence <= new Date(transaction.endDate!) &&
		currentOccurrence <= endOfMonth(currentDate)
	) {
		if (currentOccurrence >= new Date(transaction.startDate!)) {
			transactions.push(convertToTransferTransaction(transaction, currentOccurrence))
		}
		currentOccurrence.setMonth(currentOccurrence.getMonth() + 1)
	}

	return transactions
}

function convertToTransferTransaction(
	annualTransaction: { annualSource: Account } & Omit<Transaction, 'annualSource'>,
	currentOccurrence: Date,
): Transaction {
	return {
		...annualTransaction,
		account: annualTransaction.annualSource,
		amount: annualTransaction.amount / 12,
		date: currentOccurrence.toISOString(),
		destination: annualTransaction.account,
		id: annualTransaction.id,
		operation: 'transfer',
	}
}

export function getExpandedTransactions(currentDate: Date, transactions: Transaction[]) {
	return transactions.flatMap((transaction) => {
		if (transaction.annualSource && transaction.startDate && transaction.endDate) {
			return expandAnnualTransaction(
				currentDate,
				transaction as { annualSource: Account; endDate: string; startDate: string } & Transaction,
			)
		} else if (transaction.startDate && transaction.endDate) {
			return expandTransaction(
				currentDate,
				transaction as { endDate: string; startDate: string } & Transaction,
			)
		} else {
			return transaction
		}
	})
}

// filter only the transactions in this month and the previous months, don't count the future transactions
// this is important because the balance is calculated with this
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
