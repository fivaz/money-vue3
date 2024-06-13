/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	root: true,
	extends: [
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'plugin:import/recommended',
		'@vue/eslint-config-typescript',
		'@vue/eslint-config-prettier/skip-formatting',
		'plugin:import/typescript',
	],
	settings: {
		'import/resolver': {
			typescript: true,
			node: true,
			alias: {
				map: [['@', './src']],
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		},
	},
	parserOptions: {
		ecmaVersion: 'latest',
	},
	plugins: ['unused-imports', 'import', 'perfectionist'],
	globals: {
		require: 'readonly',
	},
	rules: {
		'perfectionist/sort-interfaces': 'error',
		'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
		'unused-imports/no-unused-imports': 'warn',
		'unused-imports/no-unused-vars': [
			'warn',
			{
				vars: 'all',
				varsIgnorePattern: '^_',
				args: 'after-used',
				argsIgnorePattern: '^_',
				ignoreRestSiblings: true,
			},
		],
	},
}
