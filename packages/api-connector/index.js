

// region inline polyfills
Object.assign || Object.defineProperty(Object, "assign", { enumerable: !1, configurable: !0, writable: !0, value: function (e, r) { "use strict"; if (null == e) throw new TypeError("Cannot convert first argument to object"); for (var t = Object(e), n = 1; n < arguments.length; n++) { var o = arguments[n]; if (null != o) for (var a = Object.keys(Object(o)), c = 0, b = a.length; c < b; c++) { var i = a[c], l = Object.getOwnPropertyDescriptor(o, i); void 0 !== l && l.enumerable && (t[i] = o[i]) } } return t } });

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (factory((global.Ngw = {})));
}(this, (function (exports) {
  'use strict';


  var loadJSON = function (url, callback, context, error) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        if (xmlHttp.responseText) {
          try {
            callback(JSON.parse(xmlHttp.responseText));
          } catch (er) {
            error(er);
          }
        }
      }
    }
    xmlHttp.open('GET', url, true); // true for asynchronous
    xmlHttp.send(null);
  };

  // https://github.com/Leaflet/Leaflet/blob/b507e21c510b53cd704fb8d3f89bb46ea925c8eb/src/core/Util.js#L165
  var templateRe = /\{ *([\w_-]+) *\}/g;

  var template = function (str, data) {
    return str.replace(templateRe, function (str, key) {
      var value = data[key];

      if (value === undefined) {
        throw new Error('No value provided for variable ' + str);

      } else if (typeof value === 'function') {
        value = value(data);
      }
      return value;
    });
  }

  var OPTIONS = {
    route: '/api/component/pyramid/route'
    // baseUrl: 'http://'
  }

  /**
   *
   * @param {Object} [options]
   */
  var NgwConnector = function (options) {
    this.options = Object.assign({}, OPTIONS, options || {});
    this.route;
    this._loadingQueue = {};
    this._loadingStatus = {};
};

NgwConnector.prototype.connect = function (callback, context) {
  var self = this;
  if (this.route) {
    callback.call(context || this, this.route)
  } else {
    this.makeQuery(this.options.route, function (route) {
      self.route = route;
      callback.call(this, route);
    }, {}, context);
  }
}

NgwConnector.prototype.request = function (name, callback, params, error, context) {
  var self = this;
  this.connect(function (apiItems) {
    for (var a in apiItems) {
      if (apiItems.hasOwnProperty(a)) {
        if (a === name) {
          var apiItem = apiItems[a].slice();
          var url = apiItem.shift();
          if (apiItem.length) {
            params = params || {};
            var replaceParams = {};
            for (var fry = 0; fry < apiItem.length; fry++) {
              var arg = apiItem[fry];
              replaceParams[fry] = '{' + arg + '}';
              if (params[arg] === undefined) {
                throw new Error('`' + arg + '`' + ' url api argument is not specified')
              }
            }
            url = template(url, replaceParams)
          }
          self.makeQuery(url, callback, params, this, error);
        }
      }
    }
  }, context || this);
}

NgwConnector.prototype.makeQuery = function (url, callback, params, context, error) {
  var self = this;
  context = context || this;

  url = (this.options.baseUrl ? this.options.baseUrl : '') + url;
  if (url) {
    if (params) {
      url = template(url, params);
    }
    // remove double slash
    url = url.replace(/([^:]\/)\/+/g, '$1');
    if (!this._loadingStatus[url]) {
      this._loadingStatus[url] = true
      this._getJson(url, function (data) {
        callback.call(context, data);
        self._loadingStatus[url] = false;
        self._exequteLoadingQueue(url, data);
      }, context, function (er) {
        self._loadingStatus[url] = false;
        self._exequteLoadingQueue(url, er, true);
        if (error) {
          error.call(context, er);
        } else {
          throw new Error(er);
        }
      });
    } else {
      this._loadingStatus[url] = false;
      this._setLoadingQueue(url, callback, context, error);
    }
  }
  else {
    throw new Error('No `url` parameter set for option ' + name);
  }

}

NgwConnector.prototype._setLoadingQueue = function (name, callback, context, error) {
  this._loadingQueue[name] = this._loadingQueue[name] || {
    name: name,
    waiting: []
  };
  this._loadingQueue[name].waiting.push({
    callback: callback,
    error: error,
    context: context,
    timestamp: new Date()
  })
}

NgwConnector.prototype._exequteLoadingQueue = function (name, data, isError) {
  var queue = this._loadingQueue[name];
  if (queue) {
    for (var fry = 0; fry < queue.waiting.length; fry++) {
      var wait = queue.waiting[fry];
      if (isError) {
        if (wait.error) {
          wait.error.call(wait.context, data);
        }
      } else {
        wait.callback.call(wait.context, data);
      }
    }
    queue.waiting = [];
  }
}

NgwConnector.prototype._getJson = function (url, callback, context, error) {
  return loadJSON(url, callback, context, error);
}
if (typeof window !== 'undefined') {
  window.Ngw = NgwConnector;
}
exports.Ngw = NgwConnector;

})));
