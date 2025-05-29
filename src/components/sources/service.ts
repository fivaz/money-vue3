export type Source = {
  id: string
  name: string
  createdAt: string
  order: number
  icon: string
  balance: number
  isDeleted: string | null
}

export function getEmptySource(): Source {
  return {
    id: '',
    name: '',
    order: 0,
    icon: '',
    balance: 0,
    createdAt: new Date().toISOString(),
    isDeleted: null,
  }
}
