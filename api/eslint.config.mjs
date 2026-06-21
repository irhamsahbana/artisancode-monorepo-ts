// @ts-check

import { dirname } from 'path'
import { fileURLToPath } from 'url'

import eslint from '@eslint/js'
import pluginImport from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default tseslint.config(
  {
    ignores: ['src/generated/**'],
  },

  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,

  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
  },

  {
    plugins: { import: pluginImport },
    settings: {
      // Enable TypeScript-aware import resolution based on tsconfig paths
      'import/resolver': { typescript: true },
    },
    rules: {
      'import/order': ['error', {
        groups: [
          'builtin', 'external', 'internal',
          ['parent', 'sibling', 'index'], 'object', 'type'
        ],
        pathGroups: [
          // Match custom alias imports (e.g., @/**) as "internal"
          { pattern: '@/**', group: 'internal', position: 'before' },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      }],
    },
  },
)
