import { DB_PATH, nParseDate } from '@/lib/const.ts'
import { parseISO, isSameMonth, addMonths } from 'date-fns'
import { getTransactionsSum, type Transaction } from '@/components/transactions/service.ts'

export type Budget = {
  id: string
  name: string
  createdAt: string
  order: number
  icon: string
  value: number
  parent: Budget | null
  isDeleted: string | null
}

export function getEmptyBudget(): Budget {
  return {
    id: '',
    name: '',
    order: 0,
    icon: '',
    value: 0,
    createdAt: new Date().toISOString(),
    parent: null,
    isDeleted: null,
  }
}

/**
 * Checks if a transaction belongs to a specific budget in a given month
 *
 * @param transaction The transaction to check
 * @param budget The budget to check against
 * @param currentDate The date to check (month/year)
 * @returns Boolean indicating if the transaction belongs to the budget in that month
 */
export function transactionBelongsToBudget(
  transaction: Transaction,
  budget: Budget,
  currentDate: Date,
): boolean {
  // Check if the transaction involves the given budget
  const isBudgetInvolved = transaction.budget?.id === budget.id

  if (!isBudgetInvolved) return false

  // Regular transactions - check if date is in the same month
  if (!transaction.startDate || !transaction.endDate) {
    const transactionDate = transaction.referenceDate
      ? nParseDate(transaction.referenceDate)
      : parseISO(transaction.date)
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
 * Filters transactions that belong to a specific budget in a given month
 *
 * @param transactions List of transactions to filter
 * @param budget The budget to filter by
 * @param currentDate The date to check (month/year)
 * @returns Filtered list of transactions
 */
export function findTransactionsByBudget(
  transactions: Transaction[],
  budget: Budget,
  currentDate: Date,
): Transaction[] {
  return transactions.filter((transaction) =>
    transactionBelongsToBudget(transaction, budget, currentDate),
  )
}

export function getBudgetsSum(budgets: Budget[]): number {
  return budgets.reduce((total, budget) => total + budget.value, 0)
}

export function getBudgetsSpent(
  budgets: Budget[],
  transactions: Transaction[],
  currentDate: Date,
): number {
  return budgets.reduce((total, budget) => {
    const budgetTransactions = findTransactionsByBudget(transactions, budget, currentDate)
    const budgetSpent = getTransactionsSum(budgetTransactions)
    const x = total + budgetSpent
    console.log('x', x)
    return x
  }, 0)
}
