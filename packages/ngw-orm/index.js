'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./lib/ngw-orm.cjs.js');
} else {
  module.exports = require('./lib/ngw-orm.cjs.prod.js');
}
