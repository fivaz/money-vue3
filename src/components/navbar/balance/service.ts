import { isBefore, isEqual, parseISO } from 'date-fns'
import type { Transaction } from '@/components/transactions/service.ts'

export function calculateBalance(transactions: Transaction[], currentDate: Date): number {
  let balance = 0

  transactions.forEach((transaction) => {
    // Skip unpaid transactions
    if (!transaction.isPaid) return

    // Skip transfers (they don't affect overall balance)
    if (transaction.operation === 'transfer') return

    const transactionDate = parseISO(transaction.date)

    // Only include transactions before or on the current date
    if (isBefore(transactionDate, currentDate) || isEqual(transactionDate, currentDate)) {
      // Add or subtract based on operation type
      if (transaction.operation === 'income') {
        balance += transaction.amount
      } else if (transaction.operation === 'expense') {
        balance -= transaction.amount
      }
    }
  })

  return balance
}
