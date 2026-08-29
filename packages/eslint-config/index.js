import pluginJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['node_modules', 'lib'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    rules: {
      indent: 'off',
      camelcase: 'off',
      'no-useless-assignment': 'off',
      'max-len': [
        'error',
        {
          code: 80,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'prettier/prettier': [
        'error',
        { singleQuote: true, printWidth: 80, trailingComma: 'all' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none',
          destructuredArrayIgnorePattern: '^_',
          vars: 'all',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.{js,ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    files: ['**/*.{mjs,cjs,mts,cts}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'warn',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // Regular (non-type) imports first
            // Built-in modules (e.g., fs, path, or other Node.js built-ins)
            ['^node:'],
            // External packages (e.g., react, lodash)
            ['^@?\\w'],
            // Parent imports (e.g., ../)
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Sibling imports (same directory)
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Index imports (e.g., ./index)
            ['^\\./?$'],
            // Type imports last, sorted by the same rules
            // Built-in type imports
            ['^node:.*\\u0000$'],
            // External package type imports (e.g., type imports from npm packages)
            ['^@?\\w.*\\u0000$'],
            // Parent directory type imports (e.g., ../types)
            ['^\\.\\.(?!/?$).*(\\u0000)$', '^\\.\\./?.*(\\u0000)$'],
            // Sibling directory type imports (e.g., ./types)
            ['^\\./(?=.*/)(?!/?$).*(\\u0000)$', '^\\.(?!/?$).*(\\u0000)$'],
            // Index file type imports
            ['^\\./?.*(\\u0000)$'],
          ],
        },
      ],
    },
  },
];
