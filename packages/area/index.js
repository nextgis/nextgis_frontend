'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/area.cjs.js');
} else {
  module.exports = require('./lib/area.cjs.prod.js');
}
//# sourceMappingURL=./lib/area.esm-bundler.js.map
