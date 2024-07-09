module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
    node: true,
    amd: true,
    es6: true,
    es2017: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-dupe-class-members': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
  rules: {
    indent: 'off',
    camelcase: 'off',
    'prefer-const': 'error',
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

    'sort-imports': ['warn', { ignoreDeclarationSort: true }],
    '@typescript-eslint/consistent-type-imports': 'warn',
    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
          'type',
        ],
        alphabetize: { order: 'asc', orderImportKind: 'desc' },
        'newlines-between': 'always',
        distinctGroup: false,
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],

    // do not place in overrides rules
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/no-unused-vars': [
      1,
      {
        args: 'none',
        destructuredArrayIgnorePattern: '^_',
        vars: 'all',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'off',
      },
    ],
    '@typescript-eslint/no-var-requires': 'off',
  },
};
