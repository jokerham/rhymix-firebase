// _gen.cjs
// WBS 1.1.2 - Writes ESLint, Prettier and lint-staged config files.
// Run from inside the rhymix-react/ project folder.

'use strict';

const fs   = require('fs');
const path = require('path');

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('  wrote:', filePath);
}

// ── eslint.config.js (ESLint v9 flat config) ──────────────────
write('eslint.config.js', [
  "import js           from '@eslint/js'",
  "import tseslint     from 'typescript-eslint'",
  "import reactPlugin  from 'eslint-plugin-react'",
  "import reactHooks   from 'eslint-plugin-react-hooks'",
  "import reactRefresh from 'eslint-plugin-react-refresh'",
  "import jsxA11y      from 'eslint-plugin-jsx-a11y'",
  "import importX      from 'eslint-plugin-import-x'",
  "import prettier     from 'eslint-config-prettier'",
  "",
  "export default tseslint.config(",
  "  { ignores: ['dist/', 'coverage/', 'node_modules/'] },",
  "",
  "  js.configs.recommended,",
  "",
  "  ...tseslint.configs.recommendedTypeChecked,",
  "  {",
  "    languageOptions: {",
  "      parserOptions: {",
  "        project: ['./tsconfig.json'],",
  "        tsconfigRootDir: import.meta.dirname,",
  "      },",
  "    },",
  "  },",
  "",
  "  {",
  "    plugins: {",
  "      react:           reactPlugin,",
  "      'react-hooks':   reactHooks,",
  "      'react-refresh': reactRefresh,",
  "      'jsx-a11y':      jsxA11y,",
  "      'import-x':      importX,",
  "    },",
  "    settings: {",
  "      react: { version: 'detect' },",
  "    },",
  "    rules: {",
  "      ...reactPlugin.configs.recommended.rules,",
  "      ...reactHooks.configs.recommended.rules,",
  "      'react/react-in-jsx-scope': 'off',",
  "      'react/prop-types':         'off',",
  "      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],",
  "",
  "      ...jsxA11y.configs.recommended.rules,",
  "",
  "      'import-x/order': ['warn', {",
  "        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],",
  "        'newlines-between': 'always',",
  "        alphabetize: { order: 'asc', caseInsensitive: true },",
  "      }],",
  "      'import-x/no-duplicates': 'error',",
  "",
  "      '@typescript-eslint/no-unused-vars':         ['error', { argsIgnorePattern: '^_' }],",
  "      '@typescript-eslint/no-explicit-any':         'warn',",
  "      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],",
  "      '@typescript-eslint/no-floating-promises':    'error',",
  "      '@typescript-eslint/no-misused-promises':     'error',",
  "",
  "      'no-console':   ['warn', { allow: ['warn', 'error'] }],",
  "      'prefer-const':  'error',",
  "      'eqeqeq':       ['error', 'always'],",
  "    },",
  "  },",
  "",
  "  prettier,",
  ")",
  "",
].join('\n'));

// ── .prettierrc.json ──────────────────────────────────────────
write('.prettierrc.json', JSON.stringify({
  semi:            false,
  singleQuote:     true,
  jsxSingleQuote:  false,
  trailingComma:   'all',
  printWidth:      100,
  tabWidth:        2,
  useTabs:         false,
  bracketSpacing:  true,
  bracketSameLine: false,
  arrowParens:     'always',
  endOfLine:       'lf',
}, null, 2));

// ── .prettierignore ───────────────────────────────────────────
write('.prettierignore', [
  'node_modules/',
  'dist/',
  'coverage/',
  '.firebase/',
  '*.min.js',
  '*.min.css',
  'public/',
  '',
].join('\n'));

// ── .editorconfig ─────────────────────────────────────────────
write('.editorconfig', [
  'root = true',
  '',
  '[*]',
  'charset = utf-8',
  'end_of_line = lf',
  'indent_style = space',
  'indent_size = 2',
  'insert_final_newline = true',
  'trim_trailing_whitespace = true',
  '',
  '[*.md]',
  'trim_trailing_whitespace = false',
  '',
].join('\n'));

// ── Update package.json ───────────────────────────────────────
const pkgPath = 'package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

pkg.scripts = {
  ...pkg.scripts,
  'lint':         'eslint src',
  'lint:fix':     'eslint src --fix',
  'format':       'prettier --write "src/**/*.{ts,tsx,css,json}"',
  'format:check': 'prettier --check "src/**/*.{ts,tsx,css,json}"',
  'prepare':      'husky',
};

pkg['lint-staged'] = {
  'src/**/*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  'src/**/*.{css,json,md}': [
    'prettier --write',
  ],
};

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
console.log('  updated: package.json (scripts + lint-staged)');

console.log('');
console.log('Config files written successfully.');
