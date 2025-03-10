import { format, parse } from 'date-fns'

export const DB_PATH = {
  USERS: 'users',
  ACCOUNTS: 'accounts',
  BUDGETS: 'budgets',
  SOURCES: 'sources',
  TRANSACTIONS: 'transactions',
}

export const ROUTES = {
  ROOT: {
    name: 'Accounts',
    path: '/',
  },
  BUDGETS: {
    name: 'Budgets',
    path: '/budgets',
  },
  SOURCES: {
    name: 'Sources',
    path: '/sources',
  },
  PROFILE: {
    name: 'Profile',
    path: '/profile',
  },
  LOGIN: {
    name: 'Login',
    path: '/login',
  },
  REGISTER: {
    name: 'Register',
    path: '/register',
  },
}

export const navLinks: { name: string; path: string }[] = [
  ROUTES.ROOT,
  ROUTES.BUDGETS,
  ROUTES.SOURCES,
]

const DATE_FORMAT = 'yyyy-MM-dd'

export function nFormatDate(date: Date) {
  return format(date, DATE_FORMAT)
}

export function nParseDate(date: string) {
  return parse(date, DATE_FORMAT, new Date())
}

export type SelectType = string | number | boolean | object | null | undefined
