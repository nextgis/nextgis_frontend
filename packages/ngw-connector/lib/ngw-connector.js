(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.NgwConnector = {})));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var polyfills = createCommonjsModule(function (module, exports) {
    Object.assign || Object.defineProperty(Object, 'assign', { enumerable: !1, configurable: !0, writable: !0, value: function (e, r) { if (null == e) throw new TypeError('Cannot convert first argument to object'); for (let t = Object(e), n = 1; n < arguments.length; n++) { let o = arguments[n]; if (null != o) for (let a = Object.keys(Object(o)), c = 0, b = a.length; c < b; c++) { let i = a[c], l = Object.getOwnPropertyDescriptor(o, i); void 0 !== l && l.enumerable && (t[i] = o[i]); } } return t } });

    // https://github.com/taylorhakes/promise-polyfill
    // Copyright (c) 2014 Taylor Hakes
    // Copyright (c) 2014 Forbes Lindesay

    // Permission is hereby granted, free of charge, to any person obtaining a copy
    // of this software and associated documentation files (the "Software"), to deal
    // in the Software without restriction, including without limitation the rights
    // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    // copies of the Software, and to permit persons to whom the Software is
    // furnished to do so, subject to the following conditions:

    // The above copyright notice and this permission notice shall be included in
    // all copies or substantial portions of the Software.

    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    // THE SOFTWARE.
    !function(e,n){n();}(0,function(){function e(e){var n=this.constructor;return this.then(function(t){return n.resolve(e()).then(function(){return t})},function(t){return n.resolve(e()).then(function(){return n.reject(t)})})}function n(){}function t(e){if(!(this instanceof t))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=undefined,this._deferreds=[],u(e,this);}function o(e,n){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,t._immediateFn(function(){var t=1===e._state?n.onFulfilled:n.onRejected;if(null!==t){var o;try{o=t(e._value);}catch(f){return void i(n.promise,f)}r(n.promise,o);}else(1===e._state?r:i)(n.promise,e._value);})):e._deferreds.push(n);}function r(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var o=n.then;if(n instanceof t)return e._state=3,e._value=n,void f(e);if("function"==typeof o)return void u(function(e,n){return function(){e.apply(n,arguments);}}(o,n),e)}e._state=1,e._value=n,f(e);}catch(r){i(e,r);}}function i(e,n){e._state=2,e._value=n,f(e);}function f(e){2===e._state&&0===e._deferreds.length&&t._immediateFn(function(){e._handled||t._unhandledRejectionFn(e._value);});for(var n=0,r=e._deferreds.length;r>n;n++)o(e,e._deferreds[n]);e._deferreds=null;}function u(e,n){var t=!1;try{e(function(e){t||(t=!0,r(n,e));},function(e){t||(t=!0,i(n,e));});}catch(o){if(t)return;t=!0,i(n,o);}}var c=setTimeout;t.prototype["catch"]=function(e){return this.then(null,e)},t.prototype.then=function(e,t){var r=new this.constructor(n);return o(this,new function(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t;}(e,t,r)),r},t.prototype["finally"]=e,t.all=function(e){return new t(function(n,t){function o(e,f){try{if(f&&("object"==typeof f||"function"==typeof f)){var u=f.then;if("function"==typeof u)return void u.call(f,function(n){o(e,n);},t)}r[e]=f,0==--i&&n(r);}catch(c){t(c);}}if(!e||"undefined"==typeof e.length)throw new TypeError("Promise.all accepts an array");var r=Array.prototype.slice.call(e);if(0===r.length)return n([]);for(var i=r.length,f=0;r.length>f;f++)o(f,r[f]);})},t.resolve=function(e){return e&&"object"==typeof e&&e.constructor===t?e:new t(function(n){n(e);})},t.reject=function(e){return new t(function(n,t){t(e);})},t.race=function(e){return new t(function(n,t){for(var o=0,r=e.length;r>o;o++)e[o].then(n,t);})},t._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e);}||function(e){c(e,0);},t._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e);};var l=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof commonjsGlobal)return commonjsGlobal;throw Error("unable to locate global object")}();"Promise"in l?l.Promise.prototype["finally"]||(l.Promise.prototype["finally"]=e):l.Promise=t;});
    });

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
        NgwConnector.prototype.connect = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, login, password;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.route) return [3, 1];
                            return [2, Promise.resolve(this.route)];
                        case 1:
                            if (!this.options.auth) return [3, 3];
                            console.log(1234);
                            _a = this.options.auth, login = _a.login, password = _a.password;
                            if (!(login && password)) return [3, 3];
                            return [4, this.getUserInfo()];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3: return [4, this.makeQuery(this.options.route, {}, {}).then(function (route) {
                                _this.route = route;
                                return route;
                            })];
                        case 4: return [2, _b.sent()];
                    }
                });
            });
        };
        NgwConnector.prototype.getUserInfo = function () {
            var _this = this;
            var client = this.makeClientId();
            return fetch(this.options.baseUrl + '/api/component/auth/current_user', {
                headers: {
                    Authorization: 'Basic ' + client,
                },
                mode: 'cors',
            }).then(function (resp) {
                console.log(resp);
                resp.json().then(function (data) {
                    if (data.keyname !== 'guest') {
                        data.clientId = _this.makeClientId();
                        if (localStorage) {
                            localStorage.setItem('nguser', JSON.stringify(data));
                        }
                    }
                });
            });
        };
        NgwConnector.prototype.makeClientId = function () {
            var _a = this.options.auth, login = _a.login, password = _a.password;
            return window.btoa(unescape(encodeURIComponent(login + ":" + password)));
        };
        NgwConnector.prototype.request = function (name, params, options) {
            var _this = this;
            return this.connect().then(function (apiItems) {
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
                            return _this.makeQuery(url, params, options);
                        }
                    }
                }
            });
        };
        NgwConnector.prototype.post = function (name, options, params) {
            options = options || {};
            options.method = 'POST';
            return this.request(name, params, options);
        };
        NgwConnector.prototype.makeQuery = function (url, params, options) {
            var _this = this;
            url = (this.options.baseUrl ? this.options.baseUrl : '') + url;
            if (url) {
                if (params) {
                    url = template(url, params);
                }
                url = url.replace(/([^:]\/)\/+/g, '$1');
                if (!this._loadingStatus[url]) {
                    this._loadingStatus[url] = true;
                    return this._getJson(url, options).then(function (data) {
                        _this._loadingStatus[url] = false;
                        _this._exequteLoadingQueue(url, data);
                        return data;
                    }).catch(function (er) {
                        _this._loadingStatus[url] = false;
                        _this._exequteLoadingQueue(url, er, true);
                    });
                }
                else {
                    this._loadingStatus[url] = false;
                    var promise = new Promise(function (resolve, reject) {
                        _this._setLoadingQueue(url, resolve, reject);
                    });
                    return promise;
                }
            }
            else {
                throw new Error('No `url` parameter set for option ' + name);
            }
        };
        NgwConnector.prototype._setLoadingQueue = function (name, resolve, reject) {
            this._loadingQueue[name] = this._loadingQueue[name] || {
                name: name,
                waiting: [],
            };
            this._loadingQueue[name].waiting.push({
                resolve: resolve,
                reject: reject,
                timestamp: new Date(),
            });
        };
        NgwConnector.prototype._exequteLoadingQueue = function (name, data, isError) {
            var queue = this._loadingQueue[name];
            if (queue) {
                for (var fry = 0; fry < queue.waiting.length; fry++) {
                    var wait = queue.waiting[fry];
                    if (isError) {
                        if (wait.reject) {
                            wait.reject();
                        }
                    }
                    else {
                        wait.resolve(data);
                    }
                }
                queue.waiting = [];
            }
        };
        NgwConnector.prototype._getJson = function (url, options) {
            return new Promise(function (resolve, reject) {
                loadJSON(url, resolve, options, reject);
            });
        };
        return NgwConnector;
    }());
    function loadJSON(url, callback, options, error) {
        if (options === void 0) { options = {}; }
        options.method = options.method || 'GET';
        var xmlHttp;
        if (options.mode === 'cors') {
            xmlHttp = createCORSRequest(options.method, url);
        }
        else {
            xmlHttp = new XMLHttpRequest();
            xmlHttp.open(options.method || 'GET', url, true);
        }
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
        var headers = options.headers;
        if (headers) {
            for (var h in headers) {
                if (headers.hasOwnProperty(h)) {
                    xmlHttp.setRequestHeader(h, headers[h]);
                }
            }
        }
        xmlHttp.withCredentials = options.withCredentials;
        xmlHttp.send(options.data ? JSON.stringify(options.data) : null);
    }
    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ('withCredentials' in xhr) {
            xhr.open(method, url, true);
        }
        else {
            var X = XDomainRequest;
            if (typeof X !== 'undefined') {
                xhr = new X();
                xhr.open(method, url);
            }
            else {
                xhr = null;
            }
        }
        return xhr;
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
