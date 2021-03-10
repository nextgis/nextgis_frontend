module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
    node: true,
    amd: true,
    es6: true,
    es2017: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 10,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-dupe-class-members': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/no-unused-vars': [
          1,
          {
            args: 'none',
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
  },
};
