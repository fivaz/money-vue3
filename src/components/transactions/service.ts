import { nFormatDate, nParseDate } from '@/lib/const.ts'
import type { Budget } from '@/components/budgets/service.ts'
import type { Account } from '@/components/accounts/service.ts'
import { addMonths, differenceInMonths, isValid } from 'date-fns'

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

export function getMonthlyAmount(transaction: Transaction): number {
  // Parse string dates to Date objects
  const start = nParseDate(transaction.startDate)
  const end = nParseDate(transaction.endDate)

  // Check if the parsed dates are valid
  if (!isValid(start)) {
    return 0
  }
  if (!isValid(end)) {
    return 0
  }

  // Calculate number of months between dates
  // Adding 1 to include both start and end months
  const months = differenceInMonths(end, start) + 1

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
