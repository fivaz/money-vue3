import type { FunctionalComponent } from 'vue'

import {
	Ambulance,
	Banknote,
	CalendarFold,
	Dumbbell,
	FireExtinguisher,
	Gift,
	Globe,
	HandCoins,
	HandHeart,
	Home,
	Hospital,
	Landmark,
	Laptop,
	PlugZap,
	ReceiptText,
	ShoppingCart,
	Stethoscope,
	TriangleAlert,
	Wallet,
	Wrench,
} from 'lucide-vue-next'

export function formatMoney(cents: number) {
	const decimals = cents / 100
	return `$${decimals.toFixed(2)}`
}

export function getAmountColor(amount: number) {
	if (amount === 0) return ''
	if (amount > 0) return 'text-green-500'
	else return 'text-red-500'
}

const icons = [
	{
		icon: ShoppingCart,
		name: 'shopping-cart',
	},
	{
		icon: HandCoins,
		name: 'money coins',
	},
	{
		icon: Ambulance,
		name: 'heath ambulance',
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
	{
		icon: Dumbbell,
		name: 'gym',
	},
	{
		icon: PlugZap,
		name: 'electricity',
	},
	{
		icon: Laptop,
		name: 'computer',
	},
	{
		icon: Globe,
		name: 'internet',
	},
	{
		icon: Stethoscope,
		name: 'heath',
	},
	{
		icon: TriangleAlert,
		name: 'accident',
	},
	{
		icon: FireExtinguisher,
		name: 'fire',
	},
] as const

export const uniqueIcons: UniqueArray<typeof icons> = icons

// guarantee that the key name is always unique
type UniqueArray<T> = T extends readonly [infer X, ...infer Rest]
	? X extends { name: infer N }
		? InArray<Rest, N> extends true
			? ['Encountered value with duplicates:', N]
			: readonly [X, ...UniqueArray<Rest>]
		: never
	: T

type InArray<T, X> = T extends readonly [{ name: infer N }, ...infer Rest]
	? X extends N
		? true
		: InArray<Rest, X>
	: false

export function getIcon(iconName: string) {
	return (icons.find(({ name }) => name === iconName) || icons[0]).icon
}
