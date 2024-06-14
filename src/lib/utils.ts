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
import type { Transaction } from '@/lib/transaction'
import { isWithinInterval } from 'date-fns'

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

function isExpandable(currentDate: Date, transaction: Transaction) {
	return !!(
		transaction.startDate &&
		transaction.endDate &&
		isWithinInterval(currentDate, {
			start: new Date(transaction.startDate),
			end: new Date(transaction.endDate),
		})
	)
}

function expandTransaction(currentDate: Date, transaction: Transaction) {
	const transactions: Transaction[] = []
	const currentOccurrence = new Date(transaction.date)

	while (currentOccurrence <= new Date(transaction.endDate!) && currentOccurrence <= currentDate) {
		if (currentOccurrence >= new Date(transaction.startDate!)) {
			transactions.push({
				...transaction,
				date: currentOccurrence.toISOString(),
			})
		}
		currentOccurrence.setMonth(currentOccurrence.getMonth() + 1)
	}

	return transactions
}

export function getExpandedTransactions(currentDate: Date, transactions: Transaction[]) {
	return transactions.flatMap((transaction) => {
		if (isExpandable(currentDate, transaction)) {
			return expandTransaction(currentDate, transaction)
		} else {
			return transaction
		}
	})
}
