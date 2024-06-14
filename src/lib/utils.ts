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
