const config = require('./package.json');
const base = require("../../jest.config.base.js");

module.exports = {
  ...base,
  name: config.name,
  displayName: config.name,

  // rootDir: '../..',
  // testMatch: [`<rootDir>/packages/${pack.name}/**/*.spec.js`],
};
