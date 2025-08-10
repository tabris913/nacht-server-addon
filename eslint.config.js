import eslint from '@eslint/js';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsesParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import * as importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { files: ['src/**/*.ts'] },
  { ignores: ['dist', 'nacht_server_BP/src/types/*.ts', 'node_modules', 'scripts'] },
  {
    languageOptions: {
      globals: globals.browser,
      parser: tsesParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
  },
  { settings: { 'import/resolver': { typescript: [] } } },
  {
    ...eslint.configs.recommended,
    rules: {
      ...eslint.configs.recommended.rules,
      'no-undef': 'off',
    },
  },
  {},
  ...tseslint.configs.recommended,
  {
    // eslint-plugin-import
    ...importPlugin.configs.typescript,
    plugins: { import: importPlugin },
    rules: {
      'eslint-plugin-import/no-named-as-default': 0,
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'warn',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          pathGroups: [
            {
              pattern: '{react,react-dom/**,react-router-dom}',
              group: 'builtin',
              position: 'before',
            },
            {
              pattern: '@src/**',
              group: 'parent',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'external',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSortPlugin,
    },
    rules: {
      'sort-imports': 0,
    },
  },
  {
    plugins: { '@typescript-eslint': typescriptEslintPlugin },
    rules: {
      // ...typescriptEslintPlugin.configs.recommended.rules,
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    rules: {
      // conflict with Prettier: "indent": ["error", 2],
      indent: 'off',
      'linebreak-style': ['error', 'unix'],
      'no-case-declarations': 'off',
      'no-irregular-whitespace': 'warn',
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'FunctionExpression[generator=false]:not(:has(ThisExpression))',
          message: 'アロー関数を利用してください',
        },
        {
          selector: 'FunctionDeclaration[generator=false]:not(:has(ThisExpression))',
          message: 'アロー関数を利用してください',
        },
        'WithStatement',
      ],
      'no-unused-vars': 'off',
      'prefer-arrow-callback': ['error'],
      quotes: ['error', 'single', { avoidEscape: true }],
    },
  },
  prettierConfig
);
