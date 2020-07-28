'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lib/ngw-orm.cjs.prod.js');
} else {
  module.exports = require('./lib/ngw-orm.cjs.js');
}
