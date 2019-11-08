module.exports = {
  projects: ['<rootDir>'],
  setupFiles: ['jest-canvas-mock'],
  transformIgnorePatterns: ['node_modules/(?!(ol)/)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@nextgis/(.*?)$': '<rootDir>/packages/$1/src'
  },
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.[jt]s?(x)'],
  rootDir: __dirname
};
