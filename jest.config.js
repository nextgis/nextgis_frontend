// const base = require("./jest.config.base.js");

// module.exports = {
//   ...base,
//   projects:
//     [
//       "<rootDir>/packages/*/jest.config.js"
//     ],
//   coverageDirectory: "<rootDir>/coverage/"
// };


module.exports = {
  collectCoverageFrom: [
    '**/packages/*/**/*.js',
    '**/packages/*/**/*.ts',
    '!**/__tests__/**', ,
  ],
  modulePathIgnorePatterns: [

  ],
  projects: ['<rootDir>'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '\\.snap$'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  watchPlugins: [
    // 'jest-watch-typeahead/filename',
    // 'jest-watch-typeahead/testname',
  ],
};
