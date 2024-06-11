export type Transaction = {
  id: string
  amount: number
  description: string
  date: string
}

export type TransactionIn = Omit<Transaction, 'id'> & { id?: string }
