export function parseMoney(cents: number) {
	return `$${(cents / 100).toFixed(2)}`
}
