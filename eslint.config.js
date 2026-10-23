import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
	{ ignores: ['dist/**', 'node_modules/**', '.ai/**', '.local/**', '.codex/**', '.agents/**'] },
	{
		files: ['src/**/*.{ts,tsx}', 'tests/**/*.ts', '*.config.{js,ts}'],
		extends: [js.configs.recommended, tseslint.configs.recommended],
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			eqeqeq: ['error', 'always'],
			'no-var': 'error',
			'prefer-const': 'error',
			'@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
		},
	},
	{
		files: ['src/**/*.{ts,tsx}'],
		plugins: { 'react-hooks': reactHooks },
		rules: { 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'error' },
	},
	prettier,
	{ files: ['src/**/*.{ts,tsx}', 'tests/**/*.ts'], rules: { curly: ['error', 'all'] } }
);
