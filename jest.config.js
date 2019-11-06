module.exports = {
  collectCoverageFrom: [
    'packages/*/src/**/*.ts',
    '!packages/demo/**',
    '!packages/eslint-config/**'
  ],
  modulePathIgnorePatterns: [],
  projects: ['<rootDir>'],
  testPathIgnorePatterns: ['/node_modules/', '\\.snap$'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },

  watchPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  rootDir: __dirname,
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.[jt]s?(x)']
};
