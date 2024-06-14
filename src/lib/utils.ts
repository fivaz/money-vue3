import {
	Banknote,
	CalendarFold,
	Gift,
	HandCoins,
	HandHeart,
	Home,
	Hospital,
	Landmark,
	ReceiptText,
	ShoppingCart,
	Wallet,
	Wrench,
} from 'lucide-vue-next'
import { isSameMonth, isWithinInterval, parse, parseISO } from 'date-fns'
import type { Transaction } from '@/lib/transaction'
import { DATE } from '@/lib/consts'

export function formatMoney(cents: number) {
	return `$${cents.toFixed(2)}`
}

export const icons = [
	{
		icon: ShoppingCart,
		name: 'shopping-cart',
	},
	{
		icon: HandCoins,
		name: 'money coins',
	},
	{
		icon: Hospital,
		name: 'hospital',
	},
	{
		icon: ReceiptText,
		name: 'receipt-text',
	},
	{
		icon: Home,
		name: 'home',
	},
	{
		icon: Gift,
		name: 'fun gift',
	},
	{
		icon: Banknote,
		name: 'money',
	},
	{
		icon: Wallet,
		name: 'wallet',
	},
	{
		icon: Wrench,
		name: 'wrench setting repair',
	},
	{
		icon: HandHeart,
		name: 'heart love give',
	},
	{
		icon: CalendarFold,
		name: 'calendar year',
	},
	{
		icon: Landmark,
		name: 'bank',
	},
]

export function getIcon(iconName: string) {
	return (icons.find(({ name }) => name === iconName) || icons[0]).icon
}

export function isCurrent(currentDate: Date, transaction: Transaction): boolean {
	return (
		isSameMonth(currentDate, parseISO(transaction.date)) ||
		!!(
			transaction.startDate &&
			transaction.endDate &&
			isWithinInterval(currentDate, {
				start: parse(transaction.startDate, DATE, new Date()),
				end: parse(transaction.endDate, DATE, new Date()),
			})
		)
	)
}
