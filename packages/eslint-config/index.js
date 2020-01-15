module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  env: {
    browser: true,
    node: true,
    amd: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
    // project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    // 'comma-dangle': [
    //   'error',
    //   {
    //     arrays: 'ignore',
    //     objects: 'ignore',
    //     imports: 'never',
    //     exports: 'never',
    //     functions: 'never',
    //   }
    // ],
    // 'arrow-parens': 'always',
    'prefer-const': 2,
    indent: 'off',
    'no-useless-catch': 'off',
    'max-len': [
      'error',
      {
        code: 80,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }
    ],
    camelcase: 'off',
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/member-ordering': 2,
    '@typescript-eslint/no-unused-vars': [
      1,
      {
        args: 'none'
      }
    ],
    '@typescript-eslint/camelcase': [
      'error',
      {
        properties: 'never'
      }
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'off'
      }
    ],
    // '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-parameter-properties': 0,
    '@typescript-eslint/no-object-literal-type-assertion': 0,
    '@typescript-eslint/explicit-function-return-type': [
      0,
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true
      }
    ]
  }
};
