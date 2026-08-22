import config from './packages/eslint-config/index.js';

export default [
  ...config,
  {
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
];
