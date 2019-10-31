module.exports = {
  collectCoverageFrom: ['**/packages/*/**/*.js', '**/packages/*/**/*.ts', '!**/__tests__/**'],
  modulePathIgnorePatterns: [],
  projects: ['<rootDir>'],
  testPathIgnorePatterns: ['/node_modules/', '\\.snap$'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  watchPlugins: [
    // 'jest-watch-typeahead/filename',
    // 'jest-watch-typeahead/testname',
  ]
};
