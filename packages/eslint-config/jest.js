module.exports = {
  env: {
    'jest/globals': true
  },
  extends: ['plugin:jest/recommended', 'plugin:jest/style', './index.js'],
  plugins: ['jest'],
  rules: {
    'jest/no-export': 0
  }
};
