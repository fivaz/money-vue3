import { nFormatDate } from '@/lib/const.ts'
import type { Budget } from '@/components/budgets/service.ts'
import type { Account } from '@/components/accounts/service.ts'
import { addMonths } from 'date-fns'

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
