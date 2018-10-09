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
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

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

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
            else {
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
    //# sourceMappingURL=lang.js.map

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

    function filterIn(entry, filterFunc, relationFunc, _filtered) {
        if (filterFunc === void 0) { filterFunc = function (x) { return x; }; }
        if (_filtered === void 0) { _filtered = []; }
        var child;
        if (Array.isArray(entry)) {
            child = entry;
        }
        else {
            var filter = filterFunc(entry);
            if (filter) {
                _filtered.push(entry);
            }
            var relChild = relationFunc(entry);
            if (relChild) {
                child = [].concat(relChild);
            }
        }
        if (child) {
            for (var fry = 0; fry < child.length; fry++) {
                if (child[fry]) {
                    filterIn(child[fry], filterFunc, relationFunc, _filtered);
                }
            }
        }
        return _filtered;
    }
    //# sourceMappingURL=TreeUtil.js.map

    var TreeHelper = (function () {
        function TreeHelper(entry) {
            this._children = [];
            this.entry = entry;
        }
        TreeHelper.prototype.setParent = function (parent) {
            this._parent = parent;
        };
        TreeHelper.prototype.addChildren = function (children) {
            this._children.push(children);
        };
        TreeHelper.prototype.getParent = function () {
            return this._parent;
        };
        TreeHelper.prototype.getParents = function (filterFunc) {
            if (this.getParent()) {
                var generator = filterIn(this._parent, filterFunc, function (x) { return x.tree.getParent(); });
                return generator;
            }
            return [];
        };
        TreeHelper.prototype.getDescendants = function (filterFunc) {
            return filterIn(this._children, filterFunc, function (x) {
                return x.tree.getChildren();
            });
        };
        TreeHelper.prototype.getChildren = function () {
            return this._children;
        };
        return TreeHelper;
    }());
    //# sourceMappingURL=TreeHelper.js.map

    var BaseProperty = (function () {
        function BaseProperty(name, entry, options) {
            this.emitter = new EventEmitter();
            this.entry = entry;
            this.options = Object.assign({}, options);
            this.name = name;
            this._value = this.getProperty();
        }
        BaseProperty.prototype.getProperty = function () {
            if (typeof this.options.getProperty === 'function') {
                return this.options.getProperty.call(this);
            }
            return this.options.value;
        };
        BaseProperty.prototype.getParents = function () {
            return this.entry.tree.getParents() || [];
        };
        BaseProperty.prototype.getParent = function () {
            return this.entry.tree.getParent();
        };
        BaseProperty.prototype.isGroup = function () {
            var children = this.entry.tree.getDescendants();
            return children.length;
        };
        BaseProperty.prototype.isBlocked = function () {
            var _this = this;
            if (this._blocked === undefined) {
                var parents = this.entry.tree.getParents();
                if (parents) {
                    var isBlocked = parents.find(function (x) {
                        var parentProp = x.properties.get(_this.name);
                        if (parentProp) {
                            return !parentProp.value();
                        }
                    });
                    this._blocked = !!isBlocked;
                }
                else {
                    this._blocked = false;
                }
            }
            return this._blocked;
        };
        BaseProperty.prototype.set = function (value, options) {
            this._value = this._prepareValue(value);
            this.update(this._value, options);
            this._fireChangeEvent(this._value, options);
        };
        BaseProperty.prototype.value = function () {
            return this.getValue();
        };
        BaseProperty.prototype.update = function (value, options) {
            this._callOnSet(value, options);
        };
        BaseProperty.prototype.getContainer = function () {
            return this._container;
        };
        BaseProperty.prototype.destroy = function () {
            if (this._container) {
                this._container.parentNode.removeChild(this._container);
            }
            if (this._removeEventsListener) {
                this._removeEventsListener();
            }
        };
        BaseProperty.prototype.getValue = function () {
            return this._value !== undefined ? this._value : this.getProperty();
        };
        BaseProperty.prototype._prepareValue = function (value) {
            return value;
        };
        BaseProperty.prototype._callOnSet = function (value, options) {
            if (this.options.onSet) {
                this.options.onSet.call(this, value, options);
            }
        };
        BaseProperty.prototype._fireChangeEvent = function (value, options) {
            var _this = this;
            value = value !== undefined ? value : this.getValue();
            this.emitter.emit('change', { value: value, options: options });
            var parents = this.entry.tree.getParents();
            parents.forEach(function (x) {
                var prop = x.properties.get(_this.name);
                if (prop) {
                    prop.emitter.emit('change-tree', { value: value, options: options, entry: _this.entry });
                }
            });
        };
        return BaseProperty;
    }());
    //# sourceMappingURL=BaseProperty.js.map

    var CheckProperty = (function (_super) {
        __extends(CheckProperty, _super);
        function CheckProperty(name, entry, options) {
            var _this = _super.call(this, name, entry, Object.assign({}, CheckProperty.options, options)) || this;
            _this.set(_this.value());
            return _this;
        }
        CheckProperty.prototype.update = function (value, options) {
            if (value) {
                var bubble = (options && options.bubble) || this.options.bubble;
                if (bubble) {
                    this.unBlock(options);
                    var parent_1 = this.getParent();
                    var property = parent_1 && parent_1.properties.get(this.name);
                    if (property) {
                        property.set(value, Object.assign({}, options, { bubble: true, propagation: false }));
                    }
                }
                if (!this.isBlocked()) {
                    this._turnOn(options);
                }
            }
            else {
                this._turnOff(options);
            }
            var propagation = (options && options.propagation) || this.options.propagation;
            if (propagation) {
                this._propagation(value, options);
            }
        };
        CheckProperty.prototype.getHierarchyValue = function () {
            var _this = this;
            return this.value() && this.getParents().every(function (x) {
                var property = x.properties[_this.name];
                return property && property.get();
            });
        };
        CheckProperty.prototype._prepareValue = function (value) {
            return !!value;
        };
        CheckProperty.prototype._turnOff = function (options) {
            if (this.options.turnOff) {
                this.options.turnOff.call(this, options);
            }
            this._callOnSet(false, options);
            if (this.options.hierarchy && this.isGroup()) {
                this.blockChilds(options);
            }
        };
        CheckProperty.prototype._turnOn = function (options) {
            if (this.options.turnOn) {
                this.options.turnOn.call(this, options);
            }
            this._callOnSet(true, options);
            if (this.options.hierarchy && this.isGroup()) {
                this.unblockChilds(options);
            }
        };
        CheckProperty.prototype.block = function (options) {
            this._blocked = true;
            this._block(options);
        };
        CheckProperty.prototype._block = function (options) {
            this._turnOff(options);
        };
        CheckProperty.prototype.unBlock = function (options) {
            this._blocked = false;
            if (this.getValue()) {
                this._unBlock(options);
            }
        };
        CheckProperty.prototype._unBlock = function (options) {
            this._turnOn(options);
        };
        CheckProperty.prototype.blockChilds = function (options) {
            this.entry.tree.getDescendants().forEach(this._blockChild.bind(this, options));
        };
        CheckProperty.prototype.unblockChilds = function (options) {
            this.entry.tree.getChildren().forEach(this._unBlockChild.bind(this, options));
        };
        CheckProperty.prototype._blockChild = function (options, entry) {
            var prop = entry.properties.get(this.name);
            if (prop.block) {
                prop.block(options);
            }
        };
        CheckProperty.prototype._unBlockChild = function (options, entry) {
            var prop = entry.properties.get(this.name);
            if (prop.unBlock) {
                prop.unBlock(options);
            }
        };
        CheckProperty.prototype._propagation = function (value, options) {
            if (this.isGroup()) {
                var childs = this.entry.tree.getChildren();
                for (var fry = 0; fry < childs.length; fry++) {
                    var child = childs[fry];
                    var property = child.properties.get(this.name);
                    if (property) {
                        property.set(value, __assign({}, options, {
                            propagation: true,
                            bubble: false,
                        }));
                    }
                }
            }
        };
        CheckProperty.options = {
            hierarchy: true,
            bubble: false,
            propagation: false,
            label: 'Toggle',
        };
        return CheckProperty;
    }(BaseProperty));
    //# sourceMappingURL=CheckProperty.js.map

    var EntryProperties = (function () {
        function EntryProperties(entry, propertiesList) {
            this.options = {};
            this.entry = entry;
            this._properties = {};
            this._propertiesList = [];
            if (propertiesList) {
                propertiesList.forEach(this._setPropertyHandler.bind(this));
            }
        }
        EntryProperties.prototype.add = function (propOpt) {
            this._setPropertyHandler(propOpt);
        };
        EntryProperties.prototype._setPropertyHandler = function (propOpt) {
            var handlers = EntryProperties.handlers;
            var handler = propOpt.handler;
            if (!handler && propOpt.type) {
                switch (propOpt.type) {
                    case 'boolean':
                        handler = handlers.CheckProperty;
                        break;
                    case 'string':
                        handler = handlers.BaseProperty;
                        break;
                    default:
                        handler = handlers.BaseProperty;
                }
            }
            if (handler) {
                var options = __assign({}, propOpt || {});
                this._properties[propOpt.name] = new handler(propOpt.name, this.entry, options);
                this._propertiesList.push(propOpt.name);
            }
        };
        EntryProperties.prototype.update = function () {
            this.list().forEach(function (x) {
                x.update();
            });
        };
        EntryProperties.prototype.value = function (name) {
            var prop = this.get(name);
            if (prop) {
                return prop.value;
            }
        };
        EntryProperties.prototype.set = function (name, value, options) {
            var prop = this.get(name);
            if (prop) {
                return prop.set(value, options);
            }
        };
        EntryProperties.prototype.get = function (name) {
            return this._properties[name];
        };
        EntryProperties.prototype.list = function () {
            var _this = this;
            return this._propertiesList.map(function (x) { return _this._properties[x]; });
        };
        EntryProperties.prototype.destroy = function () {
            for (var p in this._properties) {
                if (this._properties.hasOwnProperty(p)) {
                    var prop = this.get(p);
                    if (prop && prop.destroy) {
                        prop.destroy();
                    }
                }
            }
            this._properties = null;
            this._propertiesList = [];
        };
        EntryProperties.handlers = {
            CheckProperty: CheckProperty,
        };
        return EntryProperties;
    }());
    //# sourceMappingURL=EntryProperties.js.map

    var ID = 0;
    var Entry = (function () {
        function Entry(options) {
            this.emitter = new EventEmitter();
            this.options = Object.assign({}, this.options, options);
            this.id = String(ID++);
            this.tree = new TreeHelper(this);
        }
        Entry.prototype.initProperties = function () {
            this.properties = new EntryProperties(this, this.options.properties);
        };
        return Entry;
    }());
    //# sourceMappingURL=Entry.js.map

    var WebLayerEntry = (function (_super) {
        __extends(WebLayerEntry, _super);
        function WebLayerEntry(map, item, options, parent) {
            var _this = _super.call(this, Object.assign({}, WebLayerEntry.options, options)) || this;
            _this.map = map;
            _this.item = item;
            if (parent) {
                _this.tree.setParent(parent);
            }
            _this.initProperties();
            _this.initItem(item);
            return _this;
        }
        WebLayerEntry.prototype.initItem = function (item) {
            var _this = this;
            var newLayer = item._layer;
            if (item.item_type === 'group' || item.item_type === 'root') {
                if (item.children && item.children.length) {
                    item.children.forEach(function (x) {
                        var children = new WebLayerEntry(_this.map, x, _this.options, _this);
                        _this.tree.addChildren(children);
                    });
                }
            }
            else if (item.item_type === 'layer') {
                var adapter = item.layer_adapter.toUpperCase();
                newLayer = this.map.addLayer(adapter, Object.assign({
                    id: this.id,
                }, item));
            }
            if (newLayer) {
                item._layer = newLayer;
                if (item.item_type === 'layer' && item.layer_enabled) {
                    this.properties.get('visibility').set(true);
                }
            }
        };
        WebLayerEntry.prototype.fit = function () {
            if (this.item.item_type === 'layer') {
                console.log(this.item);
            }
        };
        WebLayerEntry.options = {
            properties: [
                {
                    type: 'boolean',
                    name: 'visibility',
                    getProperty: function () {
                        var entry = this.entry;
                        if (entry.item.item_type === 'group') {
                            return true;
                        }
                        else if (entry.item.item_type === 'layer') {
                            return entry.item.layer_enabled;
                        }
                        else if (entry.item.item_type === 'root') {
                            return true;
                        }
                        return false;
                    },
                    onSet: function (value) {
                        var entry = this.entry;
                        if (entry.item.item_type === 'layer') {
                            if (value) {
                                entry.map.showLayer(entry.id);
                            }
                            else {
                                entry.map.hideLayer(entry.id);
                            }
                            entry.item.layer_enabled = value;
                        }
                    },
                },
            ],
        };
        return WebLayerEntry;
    }(Entry));
    //# sourceMappingURL=WebLayerEntry.js.map

    var KeyCodes = (function () {
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
            this[','] = 188;
            this['-'] = 189;
            this['.'] = 190;
            this['/'] = 191;
            this['`'] = 192;
            this['['] = 219;
            this['\\'] = 220;
            this[']'] = 221;
            this['\''] = 222;
        }
        return KeyCodes;
    }());
    //# sourceMappingURL=KeysCodes.js.map

    var Keys = (function () {
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
    //# sourceMappingURL=Keys.js.map

    var WebMap = (function () {
        function WebMap(appOptions) {
            this.displayProjection = 'EPSG:3857';
            this.lonlatProjection = 'EPSG:4326';
            this.emitter = new EventEmitter();
            this.keys = new Keys();
            this.settingsIsLoading = false;
            this._baseLayers = [];
            this.map = appOptions.mapAdapter;
            this._starterKits = appOptions.starterKits || [];
            this._addEventsListeners();
        }
        WebMap.prototype.create = function (options) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.options = deepmerge(this.options || {}, options);
                            if (!(!this.settings && this._starterKits.length)) return [3, 2];
                            return [4, this.getSettings()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [4, this._setupMap()];
                        case 3:
                            _a.sent();
                            console.log(1);
                            return [2, this];
                    }
                });
            });
        };
        WebMap.prototype.getSettings = function () {
            return __awaiter(this, void 0, void 0, function () {
                var settings, _i, _a, kit, setting, er_1;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.settings) {
                                return [2, Promise.resolve(this.settings)];
                            }
                            if (!this.settingsIsLoading) return [3, 1];
                            return [2, new Promise(function (resolve) {
                                    var onLoad = function (x) {
                                        resolve(x);
                                        _this.emitter.removeListener('load-settings', onLoad);
                                    };
                                    _this.emitter.on('load-settings', onLoad);
                                })];
                        case 1:
                            this.settingsIsLoading = true;
                            settings = void 0;
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 7, , 8]);
                            settings = {};
                            _i = 0, _a = this._starterKits.filter(function (x) { return x.getSettings; });
                            _b.label = 3;
                        case 3:
                            if (!(_i < _a.length)) return [3, 6];
                            kit = _a[_i];
                            return [4, kit.getSettings.call(kit)];
                        case 4:
                            setting = _b.sent();
                            if (setting) {
                                Object.assign(settings, setting);
                            }
                            _b.label = 5;
                        case 5:
                            _i++;
                            return [3, 3];
                        case 6: return [3, 8];
                        case 7:
                            er_1 = _b.sent();
                            this.settingsIsLoading = false;
                            throw new Error(er_1);
                        case 8:
                            if (settings) {
                                this.settings = settings;
                                this.settingsIsLoading = false;
                                this.emitter.emit('load-settings', settings);
                                return [2, settings];
                            }
                            _b.label = 9;
                        case 9: return [2];
                    }
                });
            });
        };
        WebMap.prototype.addBaseLayer = function (layerName, provider, options) {
            var _this = this;
            return this.map.addLayer(provider, __assign({}, options, { id: layerName }), true).then(function (layer) {
                if (layer) {
                    _this._baseLayers.push(layer.name);
                }
                return layer;
            });
        };
        WebMap.prototype.isBaseLayer = function (layerName) {
            return this._baseLayers.indexOf(layerName) !== -1;
        };
        WebMap.prototype._setupMap = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, extent_bottom, extent_left, extent_top, extent_right, extent;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.settings) {
                                _a = this.settings, extent_bottom = _a.extent_bottom, extent_left = _a.extent_left, extent_top = _a.extent_top, extent_right = _a.extent_right;
                                if (extent_bottom && extent_left && extent_top && extent_right) {
                                    this._extent = [extent_left, extent_bottom, extent_right, extent_top];
                                    extent = this._extent;
                                    if (extent[3] > 82) {
                                        extent[3] = 82;
                                    }
                                    if (extent[1] < -82) {
                                        extent[1] = -82;
                                    }
                                }
                            }
                            this.map.displayProjection = this.displayProjection;
                            this.map.lonlatProjection = this.lonlatProjection;
                            this.map.create({ target: this.options.target });
                            this._addTreeLayers();
                            return [4, this._addLayerProviders()];
                        case 1:
                            _b.sent();
                            this._zoomToInitialExtent();
                            this.emitter.emit('build-map', this.map);
                            return [2, this];
                    }
                });
            });
        };
        WebMap.prototype._addTreeLayers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var settings, rootLayer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.getSettings()];
                        case 1:
                            settings = _a.sent();
                            if (settings) {
                                rootLayer = settings.root_item;
                                if (rootLayer) {
                                    this.layers = new WebLayerEntry(this.map, rootLayer);
                                    this.emitter.emit('add-layers', this.layers);
                                }
                            }
                            return [2];
                    }
                });
            });
        };
        WebMap.prototype._zoomToInitialExtent = function () {
            if (this._extent) {
                this.map.fit(this._extent);
            }
        };
        WebMap.prototype._addLayerProviders = function () {
            return __awaiter(this, void 0, void 0, function () {
                var e_1, _a, e_2, _b, _c, _d, kit, adapters, adapters_1, adapters_1_1, adapter, newAdapter, e_2_1, e_1_1, er_2;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            _e.trys.push([0, 26, , 27]);
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 19, 20, 25]);
                            _c = __asyncValues(this._starterKits.filter(function (x) { return x.getLayerAdapters; }));
                            _e.label = 2;
                        case 2: return [4, _c.next()];
                        case 3:
                            if (!(_d = _e.sent(), !_d.done)) return [3, 18];
                            kit = _d.value;
                            return [4, kit.getLayerAdapters.call(kit)];
                        case 4:
                            adapters = _e.sent();
                            if (!adapters) return [3, 17];
                            _e.label = 5;
                        case 5:
                            _e.trys.push([5, 11, 12, 17]);
                            adapters_1 = __asyncValues(adapters);
                            _e.label = 6;
                        case 6: return [4, adapters_1.next()];
                        case 7:
                            if (!(adapters_1_1 = _e.sent(), !adapters_1_1.done)) return [3, 10];
                            adapter = adapters_1_1.value;
                            return [4, adapter.createAdapter(this.map)];
                        case 8:
                            newAdapter = _e.sent();
                            if (newAdapter) {
                                this.map.layerAdapters[adapter.name] = newAdapter;
                            }
                            _e.label = 9;
                        case 9: return [3, 6];
                        case 10: return [3, 17];
                        case 11:
                            e_2_1 = _e.sent();
                            e_2 = { error: e_2_1 };
                            return [3, 17];
                        case 12:
                            _e.trys.push([12, , 15, 16]);
                            if (!(adapters_1_1 && !adapters_1_1.done && (_b = adapters_1.return))) return [3, 14];
                            return [4, _b.call(adapters_1)];
                        case 13:
                            _e.sent();
                            _e.label = 14;
                        case 14: return [3, 16];
                        case 15:
                            if (e_2) throw e_2.error;
                            return [7];
                        case 16: return [7];
                        case 17: return [3, 2];
                        case 18: return [3, 25];
                        case 19:
                            e_1_1 = _e.sent();
                            e_1 = { error: e_1_1 };
                            return [3, 25];
                        case 20:
                            _e.trys.push([20, , 23, 24]);
                            if (!(_d && !_d.done && (_a = _c.return))) return [3, 22];
                            return [4, _a.call(_c)];
                        case 21:
                            _e.sent();
                            _e.label = 22;
                        case 22: return [3, 24];
                        case 23:
                            if (e_1) throw e_1.error;
                            return [7];
                        case 24: return [7];
                        case 25: return [3, 27];
                        case 26:
                            er_2 = _e.sent();
                            throw new Error(er_2);
                        case 27: return [2];
                    }
                });
            });
        };
        WebMap.prototype._addEventsListeners = function () {
            var _this = this;
            this.map.emitter.on('click', function (ev) { return _this._onMapClick(ev); });
        };
        WebMap.prototype._onMapClick = function (ev) {
            var _this = this;
            this.emitter.emit('click', ev);
            this._starterKits.forEach(function (x) {
                if (x.onMapClick) {
                    x.onMapClick(ev, _this);
                }
            });
        };
        return WebMap;
    }());

    function buildWebMap(appOpt, mapOpt) {
        return __awaiter(this, void 0, void 0, function () {
            var webMap;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        webMap = new WebMap(appOpt);
                        return [4, webMap.create(mapOpt)];
                    case 1:
                        _a.sent();
                        return [2, webMap];
                }
            });
        });
    }
    window.buildWebMap = buildWebMap;
    //# sourceMappingURL=webmap.js.map

    exports.WebMap = WebMap;
    exports.buildWebMap = buildWebMap;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=webmap.js.map
