import config from './packages/eslint-config/index.js';

export default [
  ...config,
  {
    ignores: ['nextgisweb.d.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
];
