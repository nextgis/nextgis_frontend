(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.WebMap = {})));
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

    function deepmerge(target, src, mergeArray) {
        if (mergeArray === void 0) { mergeArray = false; }
        var array = Array.isArray(src);
        var dst = array && [] || {};
        if (array) {
            if (mergeArray) {
                target = target || [];
                dst = dst.concat(target);
                src.forEach(function (e, i) {
                    if (typeof dst[i] === 'undefined') {
                        dst[i] = e;
                    }
                    else if (typeof e === 'object') {
                        dst[i] = deepmerge(target[i], e, mergeArray);
                    }
                    else {
                        if (target.indexOf(e) === -1) {
                            dst.push(e);
                        }
                    }
                });
            }
            else { // Replace array. Do not merge by default
                dst = src;
            }
        }
        else {
            if (target && typeof target === 'object') {
                Object.keys(target).forEach(function (key) {
                    dst[key] = target[key];
                });
            }
            Object.keys(src).forEach(function (key) {
                if (typeof src[key] !== 'object' || !src[key]) {
                    dst[key] = src[key];
                }
                else {
                    if (!target[key]) {
                        dst[key] = src[key];
                    }
                    else {
                        dst[key] = deepmerge(target[key], src[key], mergeArray);
                    }
                }
            });
        }
        return dst;
    }

    var domain;

    // This constructor is used to store event handlers. Instantiating this is
    // faster than explicitly calling `Object.create(null)` to get a "clean" empty
    // object (tested with v8 v4.9).
    function EventHandlers() {}
    EventHandlers.prototype = Object.create(null);

    function EventEmitter() {
      EventEmitter.init.call(this);
    }

    // nodejs oddity
    // require('events') === require('events').EventEmitter
    EventEmitter.EventEmitter = EventEmitter;

    EventEmitter.usingDomains = false;

    EventEmitter.prototype.domain = undefined;
    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._maxListeners = undefined;

    // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.
    EventEmitter.defaultMaxListeners = 10;

    EventEmitter.init = function() {
      this.domain = null;
      if (EventEmitter.usingDomains) {
        // if there is an active domain, then attach to it.
        if (domain.active && !(this instanceof domain.Domain)) ;
      }

      if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
        this._events = new EventHandlers();
        this._eventsCount = 0;
      }

      this._maxListeners = this._maxListeners || undefined;
    };

    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== 'number' || n < 0 || isNaN(n))
        throw new TypeError('"n" argument must be a positive number');
      this._maxListeners = n;
      return this;
    };

    function $getMaxListeners(that) {
      if (that._maxListeners === undefined)
        return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }

    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return $getMaxListeners(this);
    };

    // These standalone emit* functions are used to optimize calling of event
    // handlers for fast cases because emit() itself often has a variable number of
    // arguments and can be deoptimized because of that. These functions always have
    // the same number of arguments and thus do not get deoptimized, so the code
    // inside them can execute faster.
    function emitNone(handler, isFn, self) {
      if (isFn)
        handler.call(self);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self);
      }
    }
    function emitOne(handler, isFn, self, arg1) {
      if (isFn)
        handler.call(self, arg1);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self, arg1);
      }
    }
    function emitTwo(handler, isFn, self, arg1, arg2) {
      if (isFn)
        handler.call(self, arg1, arg2);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self, arg1, arg2);
      }
    }
    function emitThree(handler, isFn, self, arg1, arg2, arg3) {
      if (isFn)
        handler.call(self, arg1, arg2, arg3);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].call(self, arg1, arg2, arg3);
      }
    }

    function emitMany(handler, isFn, self, args) {
      if (isFn)
        handler.apply(self, args);
      else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          listeners[i].apply(self, args);
      }
    }

    EventEmitter.prototype.emit = function emit(type) {
      var er, handler, len, args, i, events, domain;
      var doError = (type === 'error');

      events = this._events;
      if (events)
        doError = (doError && events.error == null);
      else if (!doError)
        return false;

      domain = this.domain;

      // If there is no 'error' event listener then throw.
      if (doError) {
        er = arguments[1];
        if (domain) {
          if (!er)
            er = new Error('Uncaught, unspecified "error" event');
          er.domainEmitter = this;
          er.domain = domain;
          er.domainThrown = false;
          domain.emit('error', er);
        } else if (er instanceof Error) {
          throw er; // Unhandled 'error' event
        } else {
          // At least give some kind of context to the user
          var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
          err.context = er;
          throw err;
        }
        return false;
      }

      handler = events[type];

      if (!handler)
        return false;

      var isFn = typeof handler === 'function';
      len = arguments.length;
      switch (len) {
        // fast cases
        case 1:
          emitNone(handler, isFn, this);
          break;
        case 2:
          emitOne(handler, isFn, this, arguments[1]);
          break;
        case 3:
          emitTwo(handler, isFn, this, arguments[1], arguments[2]);
          break;
        case 4:
          emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
          break;
        // slower
        default:
          args = new Array(len - 1);
          for (i = 1; i < len; i++)
            args[i - 1] = arguments[i];
          emitMany(handler, isFn, this, args);
      }

      return true;
    };

    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = target._events;
      if (!events) {
        events = target._events = new EventHandlers();
        target._eventsCount = 0;
      } else {
        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (events.newListener) {
          target.emit('newListener', type,
                      listener.listener ? listener.listener : listener);

          // Re-assign `events` because a newListener handler could have caused the
          // this._events to be assigned to a new object
          events = target._events;
        }
        existing = events[type];
      }

      if (!existing) {
        // Optimize the case of one listener. Don't need the extra array object.
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === 'function') {
          // Adding the second element, need to change to array.
          existing = events[type] = prepend ? [listener, existing] :
                                              [existing, listener];
        } else {
          // If we've already got an array, just append.
          if (prepend) {
            existing.unshift(listener);
          } else {
            existing.push(listener);
          }
        }

        // Check for listener leak
        if (!existing.warned) {
          m = $getMaxListeners(target);
          if (m && m > 0 && existing.length > m) {
            existing.warned = true;
            var w = new Error('Possible EventEmitter memory leak detected. ' +
                                existing.length + ' ' + type + ' listeners added. ' +
                                'Use emitter.setMaxListeners() to increase limit');
            w.name = 'MaxListenersExceededWarning';
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            emitWarning(w);
          }
        }
      }

      return target;
    }
    function emitWarning(e) {
      typeof console.warn === 'function' ? console.warn(e) : console.log(e);
    }
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    EventEmitter.prototype.prependListener =
        function prependListener(type, listener) {
          return _addListener(this, type, listener, true);
        };

    function _onceWrap(target, type, listener) {
      var fired = false;
      function g() {
        target.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(target, arguments);
        }
      }
      g.listener = listener;
      return g;
    }

    EventEmitter.prototype.once = function once(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };

    EventEmitter.prototype.prependOnceListener =
        function prependOnceListener(type, listener) {
          if (typeof listener !== 'function')
            throw new TypeError('"listener" argument must be a function');
          this.prependListener(type, _onceWrap(this, type, listener));
          return this;
        };

    // emits a 'removeListener' event iff the listener was removed
    EventEmitter.prototype.removeListener =
        function removeListener(type, listener) {
          var list, events, position, i, originalListener;

          if (typeof listener !== 'function')
            throw new TypeError('"listener" argument must be a function');

          events = this._events;
          if (!events)
            return this;

          list = events[type];
          if (!list)
            return this;

          if (list === listener || (list.listener && list.listener === listener)) {
            if (--this._eventsCount === 0)
              this._events = new EventHandlers();
            else {
              delete events[type];
              if (events.removeListener)
                this.emit('removeListener', type, list.listener || listener);
            }
          } else if (typeof list !== 'function') {
            position = -1;

            for (i = list.length; i-- > 0;) {
              if (list[i] === listener ||
                  (list[i].listener && list[i].listener === listener)) {
                originalListener = list[i].listener;
                position = i;
                break;
              }
            }

            if (position < 0)
              return this;

            if (list.length === 1) {
              list[0] = undefined;
              if (--this._eventsCount === 0) {
                this._events = new EventHandlers();
                return this;
              } else {
                delete events[type];
              }
            } else {
              spliceOne(list, position);
            }

            if (events.removeListener)
              this.emit('removeListener', type, originalListener || listener);
          }

          return this;
        };

    EventEmitter.prototype.removeAllListeners =
        function removeAllListeners(type) {
          var listeners, events;

          events = this._events;
          if (!events)
            return this;

          // not listening for removeListener, no need to emit
          if (!events.removeListener) {
            if (arguments.length === 0) {
              this._events = new EventHandlers();
              this._eventsCount = 0;
            } else if (events[type]) {
              if (--this._eventsCount === 0)
                this._events = new EventHandlers();
              else
                delete events[type];
            }
            return this;
          }

          // emit removeListener for all listeners on all events
          if (arguments.length === 0) {
            var keys = Object.keys(events);
            for (var i = 0, key; i < keys.length; ++i) {
              key = keys[i];
              if (key === 'removeListener') continue;
              this.removeAllListeners(key);
            }
            this.removeAllListeners('removeListener');
            this._events = new EventHandlers();
            this._eventsCount = 0;
            return this;
          }

          listeners = events[type];

          if (typeof listeners === 'function') {
            this.removeListener(type, listeners);
          } else if (listeners) {
            // LIFO order
            do {
              this.removeListener(type, listeners[listeners.length - 1]);
            } while (listeners[0]);
          }

          return this;
        };

    EventEmitter.prototype.listeners = function listeners(type) {
      var evlistener;
      var ret;
      var events = this._events;

      if (!events)
        ret = [];
      else {
        evlistener = events[type];
        if (!evlistener)
          ret = [];
        else if (typeof evlistener === 'function')
          ret = [evlistener.listener || evlistener];
        else
          ret = unwrapListeners(evlistener);
      }

      return ret;
    };

    EventEmitter.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === 'function') {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };

    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;

      if (events) {
        var evlistener = events[type];

        if (typeof evlistener === 'function') {
          return 1;
        } else if (evlistener) {
          return evlistener.length;
        }
      }

      return 0;
    }

    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
    };

    // About 1.5x faster than the two-arg version of Array#splice().
    function spliceOne(list, index) {
      for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
        list[i] = list[k];
      list.pop();
    }

    function arrayClone(arr, i) {
      var copy = new Array(i);
      while (i--)
        copy[i] = arr[i];
      return copy;
    }

    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }

    var KeyCodes = /** @class */ (function () {
        function KeyCodes() {
            this['backspace'] = 8;
            this['tab'] = 9;
            this['enter'] = 13;
            this['shift'] = 16;
            this['ctrl'] = 17;
            this['alt'] = 18;
            this['pause/break'] = 19;
            this['caps_lock'] = 20;
            this['escape'] = 27;
            this['page_up'] = 33;
            this['page_down'] = 34;
            this['end'] = 35;
            this['home'] = 36;
            this['left_arrow'] = 37;
            this['up_arrow'] = 38;
            this['right_arrow'] = 39;
            this['down_arrow'] = 40;
            this['insert'] = 45;
            this['delete'] = 46;
            this['left_window_key'] = 91;
            this['right_window_key'] = 92;
            this['select_key'] = 93;
            this['numpad_0'] = 96;
            this['numpad_1'] = 97;
            this['numpad_2'] = 98;
            this['numpad_3'] = 99;
            this['numpad_4'] = 100;
            this['numpad_5'] = 101;
            this['numpad_6'] = 102;
            this['numpad_7'] = 103;
            this['numpad_8'] = 104;
            this['numpad_9'] = 105;
            this['multiply'] = 106;
            this['add'] = 107;
            this['subtract'] = 109;
            this['decimal_point'] = 110;
            this['divide'] = 111;
            this['f1'] = 112;
            this['f2'] = 113;
            this['f3'] = 114;
            this['f4'] = 115;
            this['f5'] = 116;
            this['f6'] = 117;
            this['f7'] = 118;
            this['f8'] = 119;
            this['f9'] = 120;
            this['f10'] = 121;
            this['f11'] = 122;
            this['f12'] = 123;
            this['num_lock'] = 144;
            this['scroll_lock'] = 145;
            this['semi-colon'] = 186;
            this['equal_sign'] = 187;
            this[','] = 188; // "comma";
            this['-'] = 189; // "dash";
            this['.'] = 190; // "period";
            this['/'] = 191; // "forward slash";
            this['`'] = 192; // "grave accent";
            this['['] = 219; // "open bracket";
            this['\\'] = 220; // "back slash";
            this[']'] = 221; // "close braket";
            this['\''] = 222; // "single quote"
        }
        return KeyCodes;
    }());

    var Keys = /** @class */ (function () {
        function Keys() {
            this.keyCodeAlias = new KeyCodes();
            this.keys = {};
            this._windowOnFocus = this.windowOnFocus.bind(this);
            this._keysPressed = this.keysPressed.bind(this);
            this._keysReleased = this.keysReleased.bind(this);
            this.addKeyboardEventsListener();
        }
        Keys.prototype.pressed = function (keyName) {
            var code = this.keyCodeAlias[keyName];
            if (code) {
                return this.keys[code];
            }
        };
        Keys.prototype.addKeyboardEventsListener = function () {
            window.addEventListener('focus', this._windowOnFocus, false);
            window.addEventListener('keydown', this._keysPressed, false);
            window.addEventListener('keyup', this._keysReleased, false);
        };
        Keys.prototype.removeKeyboardEventsListener = function () {
            window.removeEventListener('focus', this._windowOnFocus, false);
            window.removeEventListener('keydown', this._keysPressed, false);
            window.removeEventListener('keyup', this._keysReleased, false);
        };
        Keys.prototype.keysPressed = function (e) {
            e.stopPropagation();
            if (!this.keys[e.keyCode]) {
                this.keys[e.keyCode] = true;
            }
        };
        Keys.prototype.keysReleased = function (e) {
            e.stopPropagation();
            this.keys[e.keyCode] = false;
        };
        Keys.prototype.windowOnFocus = function () {
            this.keys = {};
        };
        return Keys;
    }());

    var WebMap = /** @class */ (function () {
        function WebMap(webMapOptions) {
            this.options = {
                target: '',
                displayConfig: {
                    extent: [-180, -90, 180, 90],
                },
            };
            this.displayProjection = 'EPSG:3857';
            this.lonlatProjection = 'EPSG:4326';
            this.emitter /** : StrictEventEmitter<EventEmitter, WebMapAppEvents> */ = new EventEmitter();
            this.keys = new Keys(); // TODO: make injectable cashed
            this.settingsIsLoading = false;
            this._baseLayers = [];
            this.map = webMapOptions.mapAdapter;
        }
        WebMap.prototype.create = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.options = deepmerge(this.options, options);
                            if (!(!this.settings && this._settings)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getSettings()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            this._setupMap();
                            return [2 /*return*/, this];
                    }
                });
            });
        };
        WebMap.prototype.getSettings = function () {
            return __awaiter(this, void 0, void 0, function () {
                var settings, er_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.settings) {
                                return [2 /*return*/, Promise.resolve(this.settings)];
                            }
                            if (!this.settingsIsLoading) return [3 /*break*/, 1];
                            return [2 /*return*/, new Promise(function (resolve) {
                                    var onLoad = function (x) {
                                        resolve(x);
                                        _this.emitter.removeListener('load-settings', onLoad);
                                    };
                                    _this.emitter.on('load-settings', onLoad);
                                })];
                        case 1:
                            this.settingsIsLoading = true;
                            settings = void 0;
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this._settings.getSettings(this.options)];
                        case 3:
                            settings = _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            er_1 = _a.sent();
                            this.settingsIsLoading = false;
                            throw new Error(er_1);
                        case 5:
                            if (settings) {
                                this.settings = settings;
                                this.settingsIsLoading = false;
                                this.emitter.emit('load-settings', settings);
                                return [2 /*return*/, settings];
                            }
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        WebMap.prototype.addBaseLayer = function (layerName, provider, options) {
            var _this = this;
            this.map.addLayer(provider, Object.assign({}, options, { id: layerName })).then(function (layer) {
                if (layer) {
                    _this._baseLayers.push(layer.name);
                }
            });
        };
        WebMap.prototype.isBaseLayer = function (layerName) {
            return this._baseLayers.indexOf(layerName) !== -1;
        };
        // region MAP
        WebMap.prototype._setupMap = function () {
            // const { extent_bottom, extent_left, extent_top, extent_right } = this.settings.webmap;
            // if (extent_bottom && extent_left && extent_top && extent_right) {
            //   this.options.displayConfig.extent = [extent_bottom, extent_left, extent_top, extent_right];
            // }
            // const extent = this.options.displayConfig.extent;
            // if (extent[3] > 82) {
            //   extent[3] = 82;
            // }
            // if (extent[1] < -82) {
            //   extent[1] = -82;
            // }
            // this.map.displayProjection = this.displayProjection;
            // this.map.lonlatProjection = this.lonlatProjection;
            this.map.create({ target: this.options.target });
            // this._addTreeLayers();
            // this._zoomToInitialExtent();
            this.emitter.emit('build-map', this.map);
        };
        return WebMap;
    }());

    // Composition root
    function buildWebMap(opt, config) {
        return __awaiter(this, void 0, void 0, function () {
            var webMap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        webMap = new WebMap(config);
                        return [4 /*yield*/, webMap.create(opt)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, webMap];
                }
            });
        });
    }
    window.buildWebMap = buildWebMap;

    exports.WebMap = WebMap;
    exports.buildWebMap = buildWebMap;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
