export type Budget = {
  id: string
  name: string
  value: number
}

export type BudgetIn = Omit<Budget, 'id'> & { id?: string }
