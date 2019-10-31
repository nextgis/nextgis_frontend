module.exports = {
  // roots: ['<rootDir>'],
  roots: [
    "<rootDir>/src",
    "<rootDir>/__tests__"
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],

  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "(__tests__/.*.mock).(jsx?|tsx?)$"
  ],
  verbose: true
};
