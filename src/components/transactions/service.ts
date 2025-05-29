import { nFormatDate, nParseDate } from '@/lib/const.ts'
import type { Budget } from '@/components/budgets/service.ts'
import type { Account } from '@/components/accounts/service.ts'
import { addMonths, differenceInMonths, isValid } from 'date-fns'
import * as Sentry from '@sentry/vue'

export type Operation = 'expense' | 'income' | 'transfer'

export type Transaction = {
  id: string
  description: string
  createdAt: string
  amount: number
  budget: Budget | null
  account: Account
  // transaction operation has a destination
  destination: Account | null
  date: string
  isPaid: boolean
  isDeleted: boolean
  operation: Operation
  // when a transaction is paid at a certain date, but it refers to a budget in another date (mostly used when bills are paid late)
  referenceDate: string
  // for recurring payments
  startDate: string
  endDate: string
  // when a transaction is annual, the money must come from a source account
  annualSource: Account | null
}

export function getEmptyTransaction(account: Account, date: string): Transaction {
  return {
    id: '',
    description: '',
    createdAt: new Date().toISOString(),
    amount: 0,
    budget: null,
    account,
    destination: null,
    date,
    isPaid: true,
    isDeleted: false,
    operation: 'expense',
    referenceDate: '',
    startDate: account.isAnnual ? nFormatDate(new Date()) : '',
    endDate: account.isAnnual ? nFormatDate(addMonths(new Date(), 12)) : '',
    annualSource: null,
  }
}

export function calculateMonthsInAnnual(transaction: Transaction): number {
  if (!transaction.startDate || !transaction.endDate) {
    return 0
  }

  const startDate = nParseDate(transaction.startDate)
  const endDate = nParseDate(transaction.endDate)

  // Check if the parsed dates are valid
  if (!isValid(startDate)) {
    return 0
  }
  if (!isValid(endDate)) {
    return 0
  }

  return differenceInMonths(endDate, startDate) + 1
}

export function getMonthlyAmount(transaction: Transaction): number {
  // Calculate number of months between dates
  // Adding 1 to include both start and end months
  const months = calculateMonthsInAnnual(transaction)

  // Handle case where dates are invalid or endDate is before startDate
  if (months <= 0) {
    const errorMessage = `End date must be after start date in transaction.id: ${transaction.id}`
    console.log(errorMessage)
    Sentry.captureException(new Error(errorMessage))

    return transaction.amount
  }

  // Calculate and return monthly amount
  return transaction.amount / months
}

export function getTransactionsSum(transactions: Transaction[]): number {
  return transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
}
