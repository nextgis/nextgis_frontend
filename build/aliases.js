const path = require('path');

exports.getAliases = function () {
  return {
    '@nextgis/webmap': path.resolve(__dirname, "../packages/webmap/src/index.ts"),
    '@nextgis/qms-kit': path.resolve(__dirname, "../packages/qms-kit/src/index.ts"),
    '@nextgis/ngw-connector': path.resolve(__dirname, "../packages/ngw-connector/src/index.ts"),
    '@nextgis/ngw-kit': path.resolve(__dirname, "../packages/ngw-kit/src/index.ts"),
  }
};
