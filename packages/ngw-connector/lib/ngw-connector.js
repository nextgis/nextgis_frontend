(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.NgwConnector = {})));
}(this, (function (exports) { 'use strict';

  var OPTIONS = {
      route: '/api/component/pyramid/route',
  };
  var NgwConnector = (function () {
      function NgwConnector(options) {
          this.options = {};
          this._loadingQueue = {};
          this._loadingStatus = {};
          this.options = Object.assign({}, OPTIONS, options || {});
      }
      NgwConnector.prototype.connect = function (callback, context) {
          var self = this;
          if (this.route) {
              callback.call(context || this, this.route);
          }
          else {
              this.makeQuery(this.options.route, function (route) {
                  self.route = route;
                  callback.call(this, route);
              }, {}, {}, context);
          }
      };
      NgwConnector.prototype.request = function (name, callback, params, options, error, context) {
          var _this = this;
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
                                      throw new Error('`' + arg + '`' + ' url api argument is not specified');
                                  }
                              }
                              url = template(url, replaceParams);
                          }
                          _this.makeQuery(url, callback, params, options, _this, error);
                      }
                  }
              }
          }, context || this);
      };
      NgwConnector.prototype.post = function (name, callback, options, error, params, context) {
          options = options || {};
          options.method = 'POST';
          this.request(name, callback, params, options, error, context);
      };
      NgwConnector.prototype.makeQuery = function (url, callback, params, options, context, error) {
          var _this = this;
          context = context || this;
          url = (this.options.baseUrl ? this.options.baseUrl : '') + url;
          if (url) {
              if (params) {
                  url = template(url, params);
              }
              url = url.replace(/([^:]\/)\/+/g, '$1');
              if (!this._loadingStatus[url]) {
                  this._loadingStatus[url] = true;
                  this._getJson(url, function (data) {
                      callback.call(context, data);
                      _this._loadingStatus[url] = false;
                      _this._exequteLoadingQueue(url, data);
                  }, options, context, function (er) {
                      _this._loadingStatus[url] = false;
                      _this._exequteLoadingQueue(url, er, true);
                      if (error) {
                          error.call(context, er);
                      }
                      else {
                          throw new Error(er);
                      }
                  });
              }
              else {
                  this._loadingStatus[url] = false;
                  this._setLoadingQueue(url, callback, context, error);
              }
          }
          else {
              throw new Error('No `url` parameter set for option ' + name);
          }
      };
      NgwConnector.prototype._setLoadingQueue = function (name, callback, context, error) {
          this._loadingQueue[name] = this._loadingQueue[name] || {
              name: name,
              waiting: [],
          };
          this._loadingQueue[name].waiting.push({
              callback: callback,
              error: error,
              context: context,
              timestamp: new Date(),
          });
      };
      NgwConnector.prototype._exequteLoadingQueue = function (name, data, isError) {
          var queue = this._loadingQueue[name];
          if (queue) {
              for (var fry = 0; fry < queue.waiting.length; fry++) {
                  var wait = queue.waiting[fry];
                  if (isError) {
                      if (wait.error) {
                          wait.error.call(wait.context, data);
                      }
                  }
                  else {
                      wait.callback.call(wait.context, data);
                  }
              }
              queue.waiting = [];
          }
      };
      NgwConnector.prototype._getJson = function (url, callback, options, context, error) {
          return loadJSON(url, callback, options, context, error);
      };
      return NgwConnector;
  }());
  function loadJSON(url, callback, options, context, error) {
      if (options === void 0) { options = {}; }
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function () {
          if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
              if (xmlHttp.responseText) {
                  try {
                      callback(JSON.parse(xmlHttp.responseText));
                  }
                  catch (er) {
                      error(er);
                  }
              }
          }
      };
      xmlHttp.open(options.method || 'GET', url, true);
      xmlHttp.send(options.data ? JSON.stringify(options.data) : null);
  }
  var templateRe = /\{ *([\w_-]+) *\}/g;
  function template(str, data) {
      return str.replace(templateRe, function (s, key) {
          var value = data[key];
          if (value === undefined) {
              throw new Error('No value provided for letiable ' + s);
          }
          else if (typeof value === 'function') {
              value = value(data);
          }
          return value;
      });
  }

  exports.NgwConnector = NgwConnector;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngw-connector.js.map
