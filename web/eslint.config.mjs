// @ts-check

import { dirname } from 'path'
import { fileURLToPath } from 'url'

import eslint from '@eslint/js'
import pluginImport from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default tseslint.config(
  { ignores: ['dist/**'] },

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
      'import/resolver': { typescript: true },
    },
    rules: {
      'import/order': ['error', {
        groups: [
          'builtin', 'external', 'internal',
          ['parent', 'sibling', 'index'], 'object', 'type',
        ],
        pathGroups: [
          { pattern: '@/**', group: 'internal', position: 'before' },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      }],
    },
  },

  // React 17+ JSX transform (no import needed) + hooks rules
  // @ts-expect-error – flat['jsx-runtime'] exists at runtime but types say maybe-undefined
  reactPlugin.configs.flat['jsx-runtime'],
  {
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },

  // Service worker runs in its own global scope, not the DOM's
  {
    files: ['src/service-worker.js'],
    languageOptions: {
      globals: {
        self: 'readonly',
        caches: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        Response: 'readonly',
      },
    },
  },
)
