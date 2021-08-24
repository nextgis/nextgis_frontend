'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/area.cjs.prod.js');
} else {
  module.exports = require('./lib/area.cjs.js');
}
//# sourceMappingURL=./lib/area.esm-bundler.js.map
