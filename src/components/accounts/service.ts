import { nParseDate } from '@/lib/const.ts'

import { addMonths, isSameMonth, parseISO } from 'date-fns'
import type { Transaction } from '@/components/transactions/service.ts'

export type Account = {
  id: string
  name: string
  createdAt: string
  order: number
  icon: string
  isAnnual: boolean
  isDeleted: string | null
}

export function getEmptyAccount(): Account {
  return {
    id: '',
    name: '',
    order: 0,
    isAnnual: false,
    icon: '',
    createdAt: new Date().toISOString(),
    isDeleted: null,
  }
}

/**
 * Checks if a transaction belongs to a specific account in a given month
 *
 * @param transaction The transaction to check
 * @param account The account to check against
 * @param currentDate The date to check (month/year)
 * @returns Boolean indicating if the transaction belongs to the account in that month
 */
export function transactionBelongsToAccount(
  transaction: Transaction,
  account: Account,
  currentDate: Date,
): boolean {
  // Check if the transaction involves the given account
  const isAccountInvolved =
    transaction.account?.id === account.id ||
    transaction.destination?.id === account.id ||
    transaction.annualSource?.id === account.id

  if (!isAccountInvolved) return false

  // Regular transactions - check if date is in the same month
  if (!transaction.startDate || !transaction.endDate) {
    const transactionDate = parseISO(transaction.date)
    return isSameMonth(transactionDate, currentDate)
  }

  // Annual recurring transactions - check if any occurrence falls in the current month
  const startDate = nParseDate(transaction.startDate)
  const endDate = nParseDate(transaction.endDate)

  // If current month is before start month or after end month, return false
  if (
    (startDate && !isSameMonth(startDate, currentDate) && startDate > currentDate) ||
    (endDate && !isSameMonth(endDate, currentDate) && endDate < currentDate)
  ) {
    return false
  }

  // Check if any recurring instance falls within the current month
  let checkDate = startDate
  while (checkDate <= endDate) {
    if (isSameMonth(checkDate, currentDate)) {
      return true
    }
    checkDate = addMonths(checkDate, 1)
  }

  return false
}

/**
 * Filters transactions that belong to a specific account in a given month
 *
 * @param transactions List of transactions to filter
 * @param account The account to filter by
 * @param currentDate The date to check (month/year)
 * @returns Filtered list of transactions
 */
export function findTransactionsByAccount(
  transactions: Transaction[],
  account: Account,
  currentDate: Date,
): Transaction[] {
  return transactions.filter((transaction) =>
    transactionBelongsToAccount(transaction, account, currentDate),
  )
}
