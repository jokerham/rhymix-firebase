import js           from '@eslint/js'
import tseslint     from 'typescript-eslint'
import reactPlugin  from 'eslint-plugin-react'
import reactHooks   from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y      from 'eslint-plugin-jsx-a11y'
import importX      from 'eslint-plugin-import-x'
import prettier     from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist/', 'coverage/', 'node_modules/'] },

  js.configs.recommended,

  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    plugins: {
      react:           reactPlugin,
      'react-hooks':   reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y':      jsxA11y,
      'import-x':      importX,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types':         'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      ...jsxA11y.configs.recommended.rules,

      'import-x/order': ['warn', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      }],
      'import-x/no-duplicates': 'error',

      '@typescript-eslint/no-unused-vars':         ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any':         'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-floating-promises':    'error',
      '@typescript-eslint/no-misused-promises':     'error',

      'no-console':   ['warn', { allow: ['warn', 'error'] }],
      'prefer-const':  'error',
      'eqeqeq':       ['error', 'always'],
    },
  },

  prettier,
)
