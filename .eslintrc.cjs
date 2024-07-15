/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	extends: [
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'plugin:import/recommended',
		'@vue/eslint-config-typescript',
		'@vue/eslint-config-prettier/skip-formatting',
		'plugin:import/typescript',
		"plugin:perfectionist/recommended-natural"
	],
	globals: {
		require: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 'latest',
	},
	plugins: ['unused-imports', 'import', 'perfectionist'],
	root: true,
	rules: {
		"@typescript-eslint/no-unused-vars": "off",
		'no-unused-vars': 'off',
		'unused-imports/no-unused-imports': 'warn',
		'unused-imports/no-unused-vars': [
			'warn',
			{
				args: 'after-used',
				argsIgnorePattern: '^_',
				ignoreRestSiblings: true,
				vars: 'all',
				varsIgnorePattern: '^_',
			},
		],
	},
	settings: {
		'import/resolver': {
			alias: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
				map: [['@', './src']],
			},
			node: true,
			typescript: true,
		},
	},
}
