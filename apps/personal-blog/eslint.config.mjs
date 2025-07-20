import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // TypeScript rules - more conservative approach
      // '@typescript-eslint/no-floating-promises': 'warn', // Changed to warn
      '@typescript-eslint/await-thenable': 'error',
      // '@typescript-eslint/no-misused-promises': [
      //   'error',
      //   {
      //     checksVoidReturn: {
      //       attributes: false, // Allow async functions in event handlers
      //     },
      //   },
      // ],
      // '@typescript-eslint/require-await': 'warn', // Changed to warn

      // React specific rules
      // 'react/no-danger': 'warn',
      'react/no-danger-with-children': 'error',

      // General code quality
      'no-unused-vars': 'off', // Turn off base rule
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
]

export default eslintConfig
