(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ol/source/ImageWMS'), require('ol/layer/Image'), require('ol/source/OSM'), require('ol/layer/Tile'), require('ol/proj'), require('ol/Map'), require('ol/View')) :
    typeof define === 'function' && define.amd ? define(['exports', 'ol/source/ImageWMS', 'ol/layer/Image', 'ol/source/OSM', 'ol/layer/Tile', 'ol/proj', 'ol/Map', 'ol/View'], factory) :
    (factory((global.OlMapAdapter = {}),global.ImageWMS,global.ImageLayer,global.OSM,global.TileLayer,global.proj,global.Map,global.View));
}(this, (function (exports,ImageWMS,ImageLayer,OSM,TileLayer,proj,Map,View) { 'use strict';

    ImageWMS = ImageWMS && ImageWMS.hasOwnProperty('default') ? ImageWMS['default'] : ImageWMS;
    ImageLayer = ImageLayer && ImageLayer.hasOwnProperty('default') ? ImageLayer['default'] : ImageLayer;
    OSM = OSM && OSM.hasOwnProperty('default') ? OSM['default'] : OSM;
    TileLayer = TileLayer && TileLayer.hasOwnProperty('default') ? TileLayer['default'] : TileLayer;
    Map = Map && Map.hasOwnProperty('default') ? Map['default'] : Map;
    View = View && View.hasOwnProperty('default') ? View['default'] : View;

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

    var ID = 1;
    var ImageAdapter = /** @class */ (function () {
        function ImageAdapter() {
        }
        ImageAdapter.prototype.addLayer = function (options) {
            this.name = options.id || 'image-' + ID++;
            // const options = {
            //   maxResolution: item.maxResolution ? item.maxResolution : undefined,
            //   minResolution: item.minResolution ? item.minResolution : undefined,
            //   visible: item.visibility,
            //   opacity: item.transparency ? (1 - item.transparency / 100) : 1.0,
            // };
            var source = new ImageWMS({
                url: options.url,
                params: {
                    resource: options.layer_style_id,
                },
                ratio: 1,
                imageLoadFunction: function (image, src) {
                    var url = src.split('?')[0];
                    var query = src.split('?')[1];
                    var queryObject = queryToObject(query);
                    image.getImage().src = url
                        + '?resource=' + queryObject.resource
                        + '&extent=' + queryObject.BBOX
                        + '&size=' + queryObject.WIDTH + ',' + queryObject.HEIGHT
                        + '#' + Date.now(); // in-memory cache busting
                },
            });
            var layer = new ImageLayer({ source: source });
            return layer;
        };
        return ImageAdapter;
    }());
    // TODO: move to utils or rewrite with native js methods
    function queryToObject(str) {
        var dec = decodeURIComponent;
        var qp = str.split('&');
        var ret = {};
        var name;
        var val;
        for (var i = 0, l = qp.length, item = void 0; i < l; ++i) {
            item = qp[i];
            if (item.length) {
                var s = item.indexOf('=');
                if (s < 0) {
                    name = dec(item);
                    val = '';
                }
                else {
                    name = dec(item.slice(0, s));
                    val = dec(item.slice(s + 1));
                }
                if (typeof ret[name] === 'string') { // inline'd type check
                    ret[name] = [ret[name]];
                }
                if (Array.isArray(ret[name])) {
                    ret[name].push(val);
                }
                else {
                    ret[name] = val;
                }
            }
        }
        return ret; // Object
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

    var OsmAdapter = /** @class */ (function () {
        function OsmAdapter() {
            this.name = 'osm';
        }
        OsmAdapter.prototype.addLayer = function (options) {
            var layer = new TileLayer({
                source: new OSM(),
            });
            return layer;
        };
        return OsmAdapter;
    }());

    /**
     * @module ol/util
     */

    /**
     * Counter for getUid.
     * @type {number}
     * @private
     */
    var uidCounter_ = 0;

    /**
     * Gets a unique ID for an object. This mutates the object so that further calls
     * with the same object as a parameter returns the same value. Unique IDs are generated
     * as a strictly increasing sequence. Adapted from goog.getUid.
     *
     * @param {Object} obj The object to get the unique ID for.
     * @return {number} The unique ID for the object.
     */
    function getUid(obj) {
      return obj.ol_uid || (obj.ol_uid = ++uidCounter_);
    }

    /**
     * OpenLayers version.
     * @type {string}
     */
    var VERSION = '5.1.3';

    /**
     * @module ol/AssertionError
     */

    /**
     * Error object thrown when an assertion failed. This is an ECMA-262 Error,
     * extended with a `code` property.
     * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error.
     */
    var AssertionError = (function (Error) {
      function AssertionError(code) {
        var path = VERSION.split('-')[0];
        var message = 'Assertion failed. See https://openlayers.org/en/' + path +
        '/doc/errors/#' + code + ' for details.';

        Error.call(this, message);

        /**
         * Error code. The meaning of the code can be found on
         * https://openlayers.org/en/latest/doc/errors/ (replace `latest` with
         * the version found in the OpenLayers script's header comment if a version
         * other than the latest is used).
         * @type {number}
         * @api
         */
        this.code = code;

        /**
         * @type {string}
         */
        this.name = 'AssertionError';

        // Re-assign message, see https://github.com/Rich-Harris/buble/issues/40
        this.message = message;
      }

      if ( Error ) AssertionError.__proto__ = Error;
      AssertionError.prototype = Object.create( Error && Error.prototype );
      AssertionError.prototype.constructor = AssertionError;

      return AssertionError;
    }(Error));

    /**
     * @module ol/asserts
     */

    /**
     * @param {*} assertion Assertion we expected to be truthy.
     * @param {number} errorCode Error code.
     */
    function assert(assertion, errorCode) {
      if (!assertion) {
        throw new AssertionError(errorCode);
      }
    }

    /**
     * @module ol/extent/Corner
     */

    /**
     * @module ol/extent/Relationship
     */

    /**
     * @module ol/extent
     */


    /**
     * Check if one extent contains another.
     *
     * An extent is deemed contained if it lies completely within the other extent,
     * including if they share one or more edges.
     *
     * @param {module:ol/extent~Extent} extent1 Extent 1.
     * @param {module:ol/extent~Extent} extent2 Extent 2.
     * @return {boolean} The second extent is contained by or on the edge of the
     *     first.
     * @api
     */
    function containsExtent(extent1, extent2) {
      return extent1[0] <= extent2[0] && extent2[2] <= extent1[2] &&
          extent1[1] <= extent2[1] && extent2[3] <= extent1[3];
    }


    /**
     * Check if the passed coordinate is contained or on the edge of the extent.
     *
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @return {boolean} The x, y values are contained in the extent.
     * @api
     */
    function containsXY(extent, x, y) {
      return extent[0] <= x && x <= extent[2] && extent[1] <= y && y <= extent[3];
    }


    /**
     * Create an empty extent.
     * @return {module:ol/extent~Extent} Empty extent.
     * @api
     */
    function createEmpty() {
      return [Infinity, Infinity, -Infinity, -Infinity];
    }


    /**
     * Create a new extent or update the provided extent.
     * @param {number} minX Minimum X.
     * @param {number} minY Minimum Y.
     * @param {number} maxX Maximum X.
     * @param {number} maxY Maximum Y.
     * @param {module:ol/extent~Extent=} opt_extent Destination extent.
     * @return {module:ol/extent~Extent} Extent.
     */
    function createOrUpdate(minX, minY, maxX, maxY, opt_extent) {
      if (opt_extent) {
        opt_extent[0] = minX;
        opt_extent[1] = minY;
        opt_extent[2] = maxX;
        opt_extent[3] = maxY;
        return opt_extent;
      } else {
        return [minX, minY, maxX, maxY];
      }
    }


    /**
     * Create a new empty extent or make the provided one empty.
     * @param {module:ol/extent~Extent=} opt_extent Extent.
     * @return {module:ol/extent~Extent} Extent.
     */
    function createOrUpdateEmpty(opt_extent) {
      return createOrUpdate(
        Infinity, Infinity, -Infinity, -Infinity, opt_extent);
    }


    /**
     * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
     * @param {module:ol/extent~Extent=} opt_extent Extent.
     * @return {module:ol/extent~Extent} Extent.
     */
    function createOrUpdateFromCoordinate(coordinate, opt_extent) {
      var x = coordinate[0];
      var y = coordinate[1];
      return createOrUpdate(x, y, x, y, opt_extent);
    }


    /**
     * @param {Array.<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {module:ol/extent~Extent=} opt_extent Extent.
     * @return {module:ol/extent~Extent} Extent.
     */
    function createOrUpdateFromFlatCoordinates(flatCoordinates, offset, end, stride, opt_extent) {
      var extent = createOrUpdateEmpty(opt_extent);
      return extendFlatCoordinates(extent, flatCoordinates, offset, end, stride);
    }


    /**
     * Determine if two extents are equivalent.
     * @param {module:ol/extent~Extent} extent1 Extent 1.
     * @param {module:ol/extent~Extent} extent2 Extent 2.
     * @return {boolean} The two extents are equivalent.
     * @api
     */
    function equals(extent1, extent2) {
      return extent1[0] == extent2[0] && extent1[2] == extent2[2] &&
          extent1[1] == extent2[1] && extent1[3] == extent2[3];
    }


    /**
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {Array.<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @return {module:ol/extent~Extent} Extent.
     */
    function extendFlatCoordinates(extent, flatCoordinates, offset, end, stride) {
      for (; offset < end; offset += stride) {
        extendXY(extent, flatCoordinates[offset], flatCoordinates[offset + 1]);
      }
      return extent;
    }


    /**
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {number} x X.
     * @param {number} y Y.
     */
    function extendXY(extent, x, y) {
      extent[0] = Math.min(extent[0], x);
      extent[1] = Math.min(extent[1], y);
      extent[2] = Math.max(extent[2], x);
      extent[3] = Math.max(extent[3], y);
    }


    /**
     * Get the center coordinate of an extent.
     * @param {module:ol/extent~Extent} extent Extent.
     * @return {module:ol/coordinate~Coordinate} Center.
     * @api
     */
    function getCenter(extent) {
      return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
    }


    /**
     * Get the height of an extent.
     * @param {module:ol/extent~Extent} extent Extent.
     * @return {number} Height.
     * @api
     */
    function getHeight(extent) {
      return extent[3] - extent[1];
    }


    /**
     * Get the intersection of two extents.
     * @param {module:ol/extent~Extent} extent1 Extent 1.
     * @param {module:ol/extent~Extent} extent2 Extent 2.
     * @param {module:ol/extent~Extent=} opt_extent Optional extent to populate with intersection.
     * @return {module:ol/extent~Extent} Intersecting extent.
     * @api
     */
    function getIntersection(extent1, extent2, opt_extent) {
      var intersection = opt_extent ? opt_extent : createEmpty();
      if (intersects(extent1, extent2)) {
        if (extent1[0] > extent2[0]) {
          intersection[0] = extent1[0];
        } else {
          intersection[0] = extent2[0];
        }
        if (extent1[1] > extent2[1]) {
          intersection[1] = extent1[1];
        } else {
          intersection[1] = extent2[1];
        }
        if (extent1[2] < extent2[2]) {
          intersection[2] = extent1[2];
        } else {
          intersection[2] = extent2[2];
        }
        if (extent1[3] < extent2[3]) {
          intersection[3] = extent1[3];
        } else {
          intersection[3] = extent2[3];
        }
      } else {
        createOrUpdateEmpty(intersection);
      }
      return intersection;
    }


    /**
     * Determine if one extent intersects another.
     * @param {module:ol/extent~Extent} extent1 Extent 1.
     * @param {module:ol/extent~Extent} extent2 Extent.
     * @return {boolean} The two extents intersect.
     * @api
     */
    function intersects(extent1, extent2) {
      return extent1[0] <= extent2[2] &&
          extent1[2] >= extent2[0] &&
          extent1[1] <= extent2[3] &&
          extent1[3] >= extent2[1];
    }


    /**
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {module:ol/extent~Extent=} opt_extent Extent.
     * @return {module:ol/extent~Extent} Extent.
     */
    function returnOrUpdate(extent, opt_extent) {
      if (opt_extent) {
        opt_extent[0] = extent[0];
        opt_extent[1] = extent[1];
        opt_extent[2] = extent[2];
        opt_extent[3] = extent[3];
        return opt_extent;
      } else {
        return extent;
      }
    }

    /**
     * @module ol/geom/GeometryType
     */

    /**
     * The geometry type. One of `'Point'`, `'LineString'`, `'LinearRing'`,
     * `'Polygon'`, `'MultiPoint'`, `'MultiLineString'`, `'MultiPolygon'`,
     * `'GeometryCollection'`, `'Circle'`.
     * @enum {string}
     */
    var GeometryType = {
      POINT: 'Point',
      LINE_STRING: 'LineString',
      LINEAR_RING: 'LinearRing',
      POLYGON: 'Polygon',
      MULTI_POINT: 'MultiPoint',
      MULTI_LINE_STRING: 'MultiLineString',
      MULTI_POLYGON: 'MultiPolygon',
      GEOMETRY_COLLECTION: 'GeometryCollection',
      CIRCLE: 'Circle'
    };

    /**
     * @module ol/functions
     */

    /**
     * Always returns true.
     * @returns {boolean} true.
     */
    function TRUE() {
      return true;
    }

    /**
     * Always returns false.
     * @returns {boolean} false.
     */
    function FALSE() {
      return false;
    }

    /**
     * A reusable function, used e.g. as a default for callbacks.
     *
     * @return {undefined} Nothing.
     */
    function UNDEFINED() {}

    /**
     * @module ol/ObjectEventType
     */

    /**
     * @enum {string}
     */
    var ObjectEventType = {
      /**
       * Triggered when a property is changed.
       * @event module:ol/Object~ObjectEvent#propertychange
       * @api
       */
      PROPERTYCHANGE: 'propertychange'
    };

    /**
     * @module ol/obj
     */


    /**
     * Polyfill for Object.assign().  Assigns enumerable and own properties from
     * one or more source objects to a target object.
     * See https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign.
     *
     * @param {!Object} target The target object.
     * @param {...Object} var_sources The source object(s).
     * @return {!Object} The modified target object.
     */
    var assign = (typeof Object.assign === 'function') ? Object.assign : function(target, var_sources) {
      var arguments$1 = arguments;

      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var i = 1, ii = arguments.length; i < ii; ++i) {
        var source = arguments$1[i];
        if (source !== undefined && source !== null) {
          for (var key in source) {
            if (source.hasOwnProperty(key)) {
              output[key] = source[key];
            }
          }
        }
      }
      return output;
    };


    /**
     * Removes all properties from an object.
     * @param {Object} object The object to clear.
     */
    function clear(object) {
      for (var property in object) {
        delete object[property];
      }
    }


    /**
     * Get an array of property values from an object.
     * @param {Object<K,V>} object The object from which to get the values.
     * @return {!Array<V>} The property values.
     * @template K,V
     */
    function getValues(object) {
      var values = [];
      for (var property in object) {
        values.push(object[property]);
      }
      return values;
    }


    /**
     * Determine if an object has any properties.
     * @param {Object} object The object to check.
     * @return {boolean} The object is empty.
     */
    function isEmpty$1(object) {
      var property;
      for (property in object) {
        return false;
      }
      return !property;
    }

    /**
     * @module ol/events
     */


    /**
     * Key to use with {@link module:ol/Observable~Observable#unByKey}.
     * @typedef {Object} EventsKey
     * @property {Object} [bindTo]
     * @property {module:ol/events~ListenerFunction} [boundListener]
     * @property {boolean} callOnce
     * @property {number} [deleteIndex]
     * @property {module:ol/events~ListenerFunction} listener
     * @property {EventTarget|module:ol/events/EventTarget} target
     * @property {string} type
     * @api
     */


    /**
     * Listener function. This function is called with an event object as argument.
     * When the function returns `false`, event propagation will stop.
     *
     * @typedef {function(module:ol/events/Event)|function(module:ol/events/Event): boolean} ListenerFunction
     * @api
     */


    /**
     * @param {module:ol/events~EventsKey} listenerObj Listener object.
     * @return {module:ol/events~ListenerFunction} Bound listener.
     */
    function bindListener(listenerObj) {
      var boundListener = function(evt) {
        var listener = listenerObj.listener;
        var bindTo = listenerObj.bindTo || listenerObj.target;
        if (listenerObj.callOnce) {
          unlistenByKey(listenerObj);
        }
        return listener.call(bindTo, evt);
      };
      listenerObj.boundListener = boundListener;
      return boundListener;
    }


    /**
     * Finds the matching {@link module:ol/events~EventsKey} in the given listener
     * array.
     *
     * @param {!Array<!module:ol/events~EventsKey>} listeners Array of listeners.
     * @param {!Function} listener The listener function.
     * @param {Object=} opt_this The `this` value inside the listener.
     * @param {boolean=} opt_setDeleteIndex Set the deleteIndex on the matching
     *     listener, for {@link module:ol/events~unlistenByKey}.
     * @return {module:ol/events~EventsKey|undefined} The matching listener object.
     */
    function findListener(listeners, listener, opt_this, opt_setDeleteIndex) {
      var listenerObj;
      for (var i = 0, ii = listeners.length; i < ii; ++i) {
        listenerObj = listeners[i];
        if (listenerObj.listener === listener &&
            listenerObj.bindTo === opt_this) {
          if (opt_setDeleteIndex) {
            listenerObj.deleteIndex = i;
          }
          return listenerObj;
        }
      }
      return undefined;
    }


    /**
     * @param {module:ol/events/EventTarget~EventTargetLike} target Target.
     * @param {string} type Type.
     * @return {Array.<module:ol/events~EventsKey>|undefined} Listeners.
     */
    function getListeners(target, type) {
      var listenerMap = target.ol_lm;
      return listenerMap ? listenerMap[type] : undefined;
    }


    /**
     * Get the lookup of listeners.  If one does not exist on the target, it is
     * created.
     * @param {module:ol/events/EventTarget~EventTargetLike} target Target.
     * @return {!Object.<string, Array.<module:ol/events~EventsKey>>} Map of
     *     listeners by event type.
     */
    function getListenerMap(target) {
      var listenerMap = target.ol_lm;
      if (!listenerMap) {
        listenerMap = target.ol_lm = {};
      }
      return listenerMap;
    }


    /**
     * Clean up all listener objects of the given type.  All properties on the
     * listener objects will be removed, and if no listeners remain in the listener
     * map, it will be removed from the target.
     * @param {module:ol/events/EventTarget~EventTargetLike} target Target.
     * @param {string} type Type.
     */
    function removeListeners(target, type) {
      var listeners = getListeners(target, type);
      if (listeners) {
        for (var i = 0, ii = listeners.length; i < ii; ++i) {
          target.removeEventListener(type, listeners[i].boundListener);
          clear(listeners[i]);
        }
        listeners.length = 0;
        var listenerMap = target.ol_lm;
        if (listenerMap) {
          delete listenerMap[type];
          if (Object.keys(listenerMap).length === 0) {
            delete target.ol_lm;
          }
        }
      }
    }


    /**
     * Registers an event listener on an event target. Inspired by
     * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
     *
     * This function efficiently binds a `listener` to a `this` object, and returns
     * a key for use with {@link module:ol/events~unlistenByKey}.
     *
     * @param {module:ol/events/EventTarget~EventTargetLike} target Event target.
     * @param {string} type Event type.
     * @param {module:ol/events~ListenerFunction} listener Listener.
     * @param {Object=} opt_this Object referenced by the `this` keyword in the
     *     listener. Default is the `target`.
     * @param {boolean=} opt_once If true, add the listener as one-off listener.
     * @return {module:ol/events~EventsKey} Unique key for the listener.
     */
    function listen(target, type, listener, opt_this, opt_once) {
      var listenerMap = getListenerMap(target);
      var listeners = listenerMap[type];
      if (!listeners) {
        listeners = listenerMap[type] = [];
      }
      var listenerObj = findListener(listeners, listener, opt_this, false);
      if (listenerObj) {
        if (!opt_once) {
          // Turn one-off listener into a permanent one.
          listenerObj.callOnce = false;
        }
      } else {
        listenerObj = /** @type {module:ol/events~EventsKey} */ ({
          bindTo: opt_this,
          callOnce: !!opt_once,
          listener: listener,
          target: target,
          type: type
        });
        target.addEventListener(type, bindListener(listenerObj));
        listeners.push(listenerObj);
      }

      return listenerObj;
    }


    /**
     * Registers a one-off event listener on an event target. Inspired by
     * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
     *
     * This function efficiently binds a `listener` as self-unregistering listener
     * to a `this` object, and returns a key for use with
     * {@link module:ol/events~unlistenByKey} in case the listener needs to be
     * unregistered before it is called.
     *
     * When {@link module:ol/events~listen} is called with the same arguments after this
     * function, the self-unregistering listener will be turned into a permanent
     * listener.
     *
     * @param {module:ol/events/EventTarget~EventTargetLike} target Event target.
     * @param {string} type Event type.
     * @param {module:ol/events~ListenerFunction} listener Listener.
     * @param {Object=} opt_this Object referenced by the `this` keyword in the
     *     listener. Default is the `target`.
     * @return {module:ol/events~EventsKey} Key for unlistenByKey.
     */
    function listenOnce(target, type, listener, opt_this) {
      return listen(target, type, listener, opt_this, true);
    }


    /**
     * Unregisters an event listener on an event target. Inspired by
     * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
     *
     * To return a listener, this function needs to be called with the exact same
     * arguments that were used for a previous {@link module:ol/events~listen} call.
     *
     * @param {module:ol/events/EventTarget~EventTargetLike} target Event target.
     * @param {string} type Event type.
     * @param {module:ol/events~ListenerFunction} listener Listener.
     * @param {Object=} opt_this Object referenced by the `this` keyword in the
     *     listener. Default is the `target`.
     */
    function unlisten(target, type, listener, opt_this) {
      var listeners = getListeners(target, type);
      if (listeners) {
        var listenerObj = findListener(listeners, listener, opt_this, true);
        if (listenerObj) {
          unlistenByKey(listenerObj);
        }
      }
    }


    /**
     * Unregisters event listeners on an event target. Inspired by
     * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
     *
     * The argument passed to this function is the key returned from
     * {@link module:ol/events~listen} or {@link module:ol/events~listenOnce}.
     *
     * @param {module:ol/events~EventsKey} key The key.
     */
    function unlistenByKey(key) {
      if (key && key.target) {
        key.target.removeEventListener(key.type, key.boundListener);
        var listeners = getListeners(key.target, key.type);
        if (listeners) {
          var i = 'deleteIndex' in key ? key.deleteIndex : listeners.indexOf(key);
          if (i !== -1) {
            listeners.splice(i, 1);
          }
          if (listeners.length === 0) {
            removeListeners(key.target, key.type);
          }
        }
        clear(key);
      }
    }


    /**
     * Unregisters all event listeners on an event target. Inspired by
     * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
     *
     * @param {module:ol/events/EventTarget~EventTargetLike} target Target.
     */
    function unlistenAll(target) {
      var listenerMap = getListenerMap(target);
      for (var type in listenerMap) {
        removeListeners(target, type);
      }
    }

    /**
     * @module ol/Disposable
     */

    /**
     * @classdesc
     * Objects that need to clean up after themselves.
     */
    var Disposable = function Disposable () {};

    Disposable.prototype.dispose = function dispose () {
      if (!this.disposed_) {
        this.disposed_ = true;
        this.disposeInternal();
      }
    };

    /**
     * The object has already been disposed.
     * @type {boolean}
     * @private
     */
    Disposable.prototype.disposed_ = false;

    /**
     * Extension point for disposable objects.
     * @protected
     */
    Disposable.prototype.disposeInternal = UNDEFINED;

    /**
     * @module ol/events/Event
     */

    /**
     * @classdesc
     * Stripped down implementation of the W3C DOM Level 2 Event interface.
     * See https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-interface.
     *
     * This implementation only provides `type` and `target` properties, and
     * `stopPropagation` and `preventDefault` methods. It is meant as base class
     * for higher level events defined in the library, and works with
     * {@link module:ol/events/EventTarget~EventTarget}.
     */
    var Event = function Event(type) {

      /**
       * @type {boolean}
       */
      this.propagationStopped;

      /**
       * The event type.
       * @type {string}
       * @api
       */
      this.type = type;

      /**
       * The event target.
       * @type {Object}
       * @api
       */
      this.target = null;
    };

    /**
     * Stop event propagation.
     * @function
     * @api
     */
    Event.prototype.preventDefault = function preventDefault () {
      this.propagationStopped = true;
    };

    /**
     * Stop event propagation.
     * @function
     * @api
     */
    Event.prototype.stopPropagation = function stopPropagation () {
      this.propagationStopped = true;
    };

    /**
     * @module ol/events/EventTarget
     */


    /**
     * @typedef {EventTarget|module:ol/events/EventTarget} EventTargetLike
     */


    /**
     * @classdesc
     * A simplified implementation of the W3C DOM Level 2 EventTarget interface.
     * See https://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-EventTarget.
     *
     * There are two important simplifications compared to the specification:
     *
     * 1. The handling of `useCapture` in `addEventListener` and
     *    `removeEventListener`. There is no real capture model.
     * 2. The handling of `stopPropagation` and `preventDefault` on `dispatchEvent`.
     *    There is no event target hierarchy. When a listener calls
     *    `stopPropagation` or `preventDefault` on an event object, it means that no
     *    more listeners after this one will be called. Same as when the listener
     *    returns false.
     */
    var EventTarget = (function (Disposable$$1) {
      function EventTarget() {

        Disposable$$1.call(this);

        /**
         * @private
         * @type {!Object.<string, number>}
         */
        this.pendingRemovals_ = {};

        /**
         * @private
         * @type {!Object.<string, number>}
         */
        this.dispatching_ = {};

        /**
         * @private
         * @type {!Object.<string, Array.<module:ol/events~ListenerFunction>>}
         */
        this.listeners_ = {};

      }

      if ( Disposable$$1 ) EventTarget.__proto__ = Disposable$$1;
      EventTarget.prototype = Object.create( Disposable$$1 && Disposable$$1.prototype );
      EventTarget.prototype.constructor = EventTarget;

      /**
       * @param {string} type Type.
       * @param {module:ol/events~ListenerFunction} listener Listener.
       */
      EventTarget.prototype.addEventListener = function addEventListener (type, listener) {
        var listeners = this.listeners_[type];
        if (!listeners) {
          listeners = this.listeners_[type] = [];
        }
        if (listeners.indexOf(listener) === -1) {
          listeners.push(listener);
        }
      };

      /**
       * Dispatches an event and calls all listeners listening for events
       * of this type. The event parameter can either be a string or an
       * Object with a `type` property.
       *
       * @param {{type: string,
       *     target: (EventTarget|module:ol/events/EventTarget|undefined)}|
       *     module:ol/events/Event|string} event Event object.
       * @return {boolean|undefined} `false` if anyone called preventDefault on the
       *     event object or if any of the listeners returned false.
       * @function
       * @api
       */
      EventTarget.prototype.dispatchEvent = function dispatchEvent (event) {
        var this$1 = this;

        var evt = typeof event === 'string' ? new Event(event) : event;
        var type = evt.type;
        evt.target = this;
        var listeners = this.listeners_[type];
        var propagate;
        if (listeners) {
          if (!(type in this.dispatching_)) {
            this.dispatching_[type] = 0;
            this.pendingRemovals_[type] = 0;
          }
          ++this.dispatching_[type];
          for (var i = 0, ii = listeners.length; i < ii; ++i) {
            if (listeners[i].call(this$1, evt) === false || evt.propagationStopped) {
              propagate = false;
              break;
            }
          }
          --this.dispatching_[type];
          if (this.dispatching_[type] === 0) {
            var pendingRemovals = this.pendingRemovals_[type];
            delete this.pendingRemovals_[type];
            while (pendingRemovals--) {
              this$1.removeEventListener(type, UNDEFINED);
            }
            delete this.dispatching_[type];
          }
          return propagate;
        }
      };

      /**
       * @inheritDoc
       */
      EventTarget.prototype.disposeInternal = function disposeInternal () {
        unlistenAll(this);
      };

      /**
       * Get the listeners for a specified event type. Listeners are returned in the
       * order that they will be called in.
       *
       * @param {string} type Type.
       * @return {Array.<module:ol/events~ListenerFunction>} Listeners.
       */
      EventTarget.prototype.getListeners = function getListeners$$1 (type) {
        return this.listeners_[type];
      };

      /**
       * @param {string=} opt_type Type. If not provided,
       *     `true` will be returned if this EventTarget has any listeners.
       * @return {boolean} Has listeners.
       */
      EventTarget.prototype.hasListener = function hasListener (opt_type) {
        return opt_type ?
          opt_type in this.listeners_ :
          Object.keys(this.listeners_).length > 0;
      };

      /**
       * @param {string} type Type.
       * @param {module:ol/events~ListenerFunction} listener Listener.
       */
      EventTarget.prototype.removeEventListener = function removeEventListener (type, listener) {
        var listeners = this.listeners_[type];
        if (listeners) {
          var index = listeners.indexOf(listener);
          if (type in this.pendingRemovals_) {
            // make listener a no-op, and remove later in #dispatchEvent()
            listeners[index] = UNDEFINED;
            ++this.pendingRemovals_[type];
          } else {
            listeners.splice(index, 1);
            if (listeners.length === 0) {
              delete this.listeners_[type];
            }
          }
        }
      };

      return EventTarget;
    }(Disposable));

    /**
     * @module ol/events/EventType
     */

    /**
     * @enum {string}
     * @const
     */
    var EventType = {
      /**
       * Generic change event. Triggered when the revision counter is increased.
       * @event module:ol/events/Event~Event#change
       * @api
       */
      CHANGE: 'change',

      CLEAR: 'clear',
      CONTEXTMENU: 'contextmenu',
      CLICK: 'click',
      DBLCLICK: 'dblclick',
      DRAGENTER: 'dragenter',
      DRAGOVER: 'dragover',
      DROP: 'drop',
      ERROR: 'error',
      KEYDOWN: 'keydown',
      KEYPRESS: 'keypress',
      LOAD: 'load',
      MOUSEDOWN: 'mousedown',
      MOUSEMOVE: 'mousemove',
      MOUSEOUT: 'mouseout',
      MOUSEUP: 'mouseup',
      MOUSEWHEEL: 'mousewheel',
      MSPOINTERDOWN: 'MSPointerDown',
      RESIZE: 'resize',
      TOUCHSTART: 'touchstart',
      TOUCHMOVE: 'touchmove',
      TOUCHEND: 'touchend',
      WHEEL: 'wheel'
    };

    /**
     * @module ol/Observable
     */

    /**
     * @classdesc
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * An event target providing convenient methods for listener registration
     * and unregistration. A generic `change` event is always available through
     * {@link module:ol/Observable~Observable#changed}.
     *
     * @fires module:ol/events/Event~Event
     * @api
     */
    var Observable = (function (EventTarget$$1) {
      function Observable() {

        EventTarget$$1.call(this);

        /**
         * @private
         * @type {number}
         */
        this.revision_ = 0;

      }

      if ( EventTarget$$1 ) Observable.__proto__ = EventTarget$$1;
      Observable.prototype = Object.create( EventTarget$$1 && EventTarget$$1.prototype );
      Observable.prototype.constructor = Observable;

      /**
       * Increases the revision counter and dispatches a 'change' event.
       * @api
       */
      Observable.prototype.changed = function changed () {
        ++this.revision_;
        this.dispatchEvent(EventType.CHANGE);
      };

      /**
       * Get the version number for this object.  Each time the object is modified,
       * its version number will be incremented.
       * @return {number} Revision.
       * @api
       */
      Observable.prototype.getRevision = function getRevision () {
        return this.revision_;
      };

      /**
       * Listen for a certain type of event.
       * @param {string|Array.<string>} type The event type or array of event types.
       * @param {function(?): ?} listener The listener function.
       * @return {module:ol/events~EventsKey|Array.<module:ol/events~EventsKey>} Unique key for the listener. If
       *     called with an array of event types as the first argument, the return
       *     will be an array of keys.
       * @api
       */
      Observable.prototype.on = function on (type, listener) {
        var this$1 = this;

        if (Array.isArray(type)) {
          var len = type.length;
          var keys = new Array(len);
          for (var i = 0; i < len; ++i) {
            keys[i] = listen(this$1, type[i], listener);
          }
          return keys;
        } else {
          return listen(this, /** @type {string} */ (type), listener);
        }
      };

      /**
       * Listen once for a certain type of event.
       * @param {string|Array.<string>} type The event type or array of event types.
       * @param {function(?): ?} listener The listener function.
       * @return {module:ol/events~EventsKey|Array.<module:ol/events~EventsKey>} Unique key for the listener. If
       *     called with an array of event types as the first argument, the return
       *     will be an array of keys.
       * @api
       */
      Observable.prototype.once = function once (type, listener) {
        var this$1 = this;

        if (Array.isArray(type)) {
          var len = type.length;
          var keys = new Array(len);
          for (var i = 0; i < len; ++i) {
            keys[i] = listenOnce(this$1, type[i], listener);
          }
          return keys;
        } else {
          return listenOnce(this, /** @type {string} */ (type), listener);
        }
      };

      /**
       * Unlisten for a certain type of event.
       * @param {string|Array.<string>} type The event type or array of event types.
       * @param {function(?): ?} listener The listener function.
       * @api
       */
      Observable.prototype.un = function un (type, listener) {
        var this$1 = this;

        if (Array.isArray(type)) {
          for (var i = 0, ii = type.length; i < ii; ++i) {
            unlisten(this$1, type[i], listener);
          }
          return;
        } else {
          unlisten(this, /** @type {string} */ (type), listener);
        }
      };

      return Observable;
    }(EventTarget));

    /**
     * @module ol/Object
     */


    /**
     * @classdesc
     * Events emitted by {@link module:ol/Object~BaseObject} instances are instances of this type.
      */
    var ObjectEvent = (function (Event$$1) {
      function ObjectEvent(type, key, oldValue) {
        Event$$1.call(this, type);

        /**
         * The name of the property whose value is changing.
         * @type {string}
         * @api
         */
        this.key = key;

        /**
         * The old value. To get the new value use `e.target.get(e.key)` where
         * `e` is the event object.
         * @type {*}
         * @api
         */
        this.oldValue = oldValue;

      }

      if ( Event$$1 ) ObjectEvent.__proto__ = Event$$1;
      ObjectEvent.prototype = Object.create( Event$$1 && Event$$1.prototype );
      ObjectEvent.prototype.constructor = ObjectEvent;

      return ObjectEvent;
    }(Event));


    /**
     * @classdesc
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * Most non-trivial classes inherit from this.
     *
     * This extends {@link module:ol/Observable} with observable
     * properties, where each property is observable as well as the object as a
     * whole.
     *
     * Classes that inherit from this have pre-defined properties, to which you can
     * add your owns. The pre-defined properties are listed in this documentation as
     * 'Observable Properties', and have their own accessors; for example,
     * {@link module:ol/Map~Map} has a `target` property, accessed with
     * `getTarget()` and changed with `setTarget()`. Not all properties are however
     * settable. There are also general-purpose accessors `get()` and `set()`. For
     * example, `get('target')` is equivalent to `getTarget()`.
     *
     * The `set` accessors trigger a change event, and you can monitor this by
     * registering a listener. For example, {@link module:ol/View~View} has a
     * `center` property, so `view.on('change:center', function(evt) {...});` would
     * call the function whenever the value of the center property changes. Within
     * the function, `evt.target` would be the view, so `evt.target.getCenter()`
     * would return the new center.
     *
     * You can add your own observable properties with
     * `object.set('prop', 'value')`, and retrieve that with `object.get('prop')`.
     * You can listen for changes on that property value with
     * `object.on('change:prop', listener)`. You can get a list of all
     * properties with {@link module:ol/Object~BaseObject#getProperties}.
     *
     * Note that the observable properties are separate from standard JS properties.
     * You can, for example, give your map object a title with
     * `map.title='New title'` and with `map.set('title', 'Another title')`. The
     * first will be a `hasOwnProperty`; the second will appear in
     * `getProperties()`. Only the second is observable.
     *
     * Properties can be deleted by using the unset method. E.g.
     * object.unset('foo').
     *
     * @fires module:ol/Object~ObjectEvent
     * @api
     */
    var BaseObject = (function (Observable$$1) {
      function BaseObject(opt_values) {
        Observable$$1.call(this);

        // Call {@link module:ol/util~getUid} to ensure that the order of objects' ids is
        // the same as the order in which they were created.  This also helps to
        // ensure that object properties are always added in the same order, which
        // helps many JavaScript engines generate faster code.
        getUid(this);

        /**
         * @private
         * @type {!Object.<string, *>}
         */
        this.values_ = {};

        if (opt_values !== undefined) {
          this.setProperties(opt_values);
        }
      }

      if ( Observable$$1 ) BaseObject.__proto__ = Observable$$1;
      BaseObject.prototype = Object.create( Observable$$1 && Observable$$1.prototype );
      BaseObject.prototype.constructor = BaseObject;

      /**
       * Gets a value.
       * @param {string} key Key name.
       * @return {*} Value.
       * @api
       */
      BaseObject.prototype.get = function get (key) {
        var value;
        if (this.values_.hasOwnProperty(key)) {
          value = this.values_[key];
        }
        return value;
      };

      /**
       * Get a list of object property names.
       * @return {Array.<string>} List of property names.
       * @api
       */
      BaseObject.prototype.getKeys = function getKeys () {
        return Object.keys(this.values_);
      };

      /**
       * Get an object of all property names and values.
       * @return {Object.<string, *>} Object.
       * @api
       */
      BaseObject.prototype.getProperties = function getProperties () {
        return assign({}, this.values_);
      };

      /**
       * @param {string} key Key name.
       * @param {*} oldValue Old value.
       */
      BaseObject.prototype.notify = function notify (key, oldValue) {
        var eventType;
        eventType = getChangeEventType(key);
        this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
        eventType = ObjectEventType.PROPERTYCHANGE;
        this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
      };

      /**
       * Sets a value.
       * @param {string} key Key name.
       * @param {*} value Value.
       * @param {boolean=} opt_silent Update without triggering an event.
       * @api
       */
      BaseObject.prototype.set = function set (key, value, opt_silent) {
        if (opt_silent) {
          this.values_[key] = value;
        } else {
          var oldValue = this.values_[key];
          this.values_[key] = value;
          if (oldValue !== value) {
            this.notify(key, oldValue);
          }
        }
      };

      /**
       * Sets a collection of key-value pairs.  Note that this changes any existing
       * properties and adds new ones (it does not remove any existing properties).
       * @param {Object.<string, *>} values Values.
       * @param {boolean=} opt_silent Update without triggering an event.
       * @api
       */
      BaseObject.prototype.setProperties = function setProperties (values, opt_silent) {
        var this$1 = this;

        for (var key in values) {
          this$1.set(key, values[key], opt_silent);
        }
      };

      /**
       * Unsets a property.
       * @param {string} key Key name.
       * @param {boolean=} opt_silent Unset without triggering an event.
       * @api
       */
      BaseObject.prototype.unset = function unset (key, opt_silent) {
        if (key in this.values_) {
          var oldValue = this.values_[key];
          delete this.values_[key];
          if (!opt_silent) {
            this.notify(key, oldValue);
          }
        }
      };

      return BaseObject;
    }(Observable));


    /**
     * @type {Object.<string, string>}
     */
    var changeEventTypeCache = {};


    /**
     * @param {string} key Key name.
     * @return {string} Change name.
     */
    function getChangeEventType(key) {
      return changeEventTypeCache.hasOwnProperty(key) ?
        changeEventTypeCache[key] :
        (changeEventTypeCache[key] = 'change:' + key);
    }

    /**
     * @module ol/geom/flat/transform
     */


    /**
     * @param {Array.<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {module:ol/transform~Transform} transform Transform.
     * @param {Array.<number>=} opt_dest Destination.
     * @return {Array.<number>} Transformed coordinates.
     */
    function transform2D(flatCoordinates, offset, end, stride, transform, opt_dest) {
      var dest = opt_dest ? opt_dest : [];
      var i = 0;
      for (var j = offset; j < end; j += stride) {
        var x = flatCoordinates[j];
        var y = flatCoordinates[j + 1];
        dest[i++] = transform[0] * x + transform[2] * y + transform[4];
        dest[i++] = transform[1] * x + transform[3] * y + transform[5];
      }
      if (opt_dest && dest.length != i) {
        dest.length = i;
      }
      return dest;
    }


    /**
     * @param {Array.<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} angle Angle.
     * @param {Array.<number>} anchor Rotation anchor point.
     * @param {Array.<number>=} opt_dest Destination.
     * @return {Array.<number>} Transformed coordinates.
     */
    function rotate(flatCoordinates, offset, end, stride, angle, anchor, opt_dest) {
      var dest = opt_dest ? opt_dest : [];
      var cos = Math.cos(angle);
      var sin = Math.sin(angle);
      var anchorX = anchor[0];
      var anchorY = anchor[1];
      var i = 0;
      for (var j = offset; j < end; j += stride) {
        var deltaX = flatCoordinates[j] - anchorX;
        var deltaY = flatCoordinates[j + 1] - anchorY;
        dest[i++] = anchorX + deltaX * cos - deltaY * sin;
        dest[i++] = anchorY + deltaX * sin + deltaY * cos;
        for (var k = j + 2; k < j + stride; ++k) {
          dest[i++] = flatCoordinates[k];
        }
      }
      if (opt_dest && dest.length != i) {
        dest.length = i;
      }
      return dest;
    }


    /**
     * Scale the coordinates.
     * @param {Array.<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} sx Scale factor in the x-direction.
     * @param {number} sy Scale factor in the y-direction.
     * @param {Array.<number>} anchor Scale anchor point.
     * @param {Array.<number>=} opt_dest Destination.
     * @return {Array.<number>} Transformed coordinates.
     */
    function scale(flatCoordinates, offset, end, stride, sx, sy, anchor, opt_dest) {
      var dest = opt_dest ? opt_dest : [];
      var anchorX = anchor[0];
      var anchorY = anchor[1];
      var i = 0;
      for (var j = offset; j < end; j += stride) {
        var deltaX = flatCoordinates[j] - anchorX;
        var deltaY = flatCoordinates[j + 1] - anchorY;
        dest[i++] = anchorX + sx * deltaX;
        dest[i++] = anchorY + sy * deltaY;
        for (var k = j + 2; k < j + stride; ++k) {
          dest[i++] = flatCoordinates[k];
        }
      }
      if (opt_dest && dest.length != i) {
        dest.length = i;
      }
      return dest;
    }


    /**
     * @param {Array.<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {number} end End.
     * @param {number} stride Stride.
     * @param {number} deltaX Delta X.
     * @param {number} deltaY Delta Y.
     * @param {Array.<number>=} opt_dest Destination.
     * @return {Array.<number>} Transformed coordinates.
     */
    function translate(flatCoordinates, offset, end, stride, deltaX, deltaY, opt_dest) {
      var dest = opt_dest ? opt_dest : [];
      var i = 0;
      for (var j = offset; j < end; j += stride) {
        dest[i++] = flatCoordinates[j] + deltaX;
        dest[i++] = flatCoordinates[j + 1] + deltaY;
        for (var k = j + 2; k < j + stride; ++k) {
          dest[i++] = flatCoordinates[k];
        }
      }
      if (opt_dest && dest.length != i) {
        dest.length = i;
      }
      return dest;
    }

    /**
     * @module ol/math
     */

    /**
     * Takes a number and clamps it to within the provided bounds.
     * @param {number} value The input number.
     * @param {number} min The minimum value to return.
     * @param {number} max The maximum value to return.
     * @return {number} The input number if it is within bounds, or the nearest
     *     number within the bounds.
     */
    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }


    /**
     * Return the hyperbolic cosine of a given number. The method will use the
     * native `Math.cosh` function if it is available, otherwise the hyperbolic
     * cosine will be calculated via the reference implementation of the Mozilla
     * developer network.
     *
     * @param {number} x X.
     * @return {number} Hyperbolic cosine of x.
     */
    var cosh = (function() {
      // Wrapped in a iife, to save the overhead of checking for the native
      // implementation on every invocation.
      var cosh;
      if ('cosh' in Math) {
        // The environment supports the native Math.cosh function, use it…
        cosh = Math.cosh;
      } else {
        // … else, use the reference implementation of MDN:
        cosh = function(x) {
          var y = Math.exp(x);
          return (y + 1 / y) / 2;
        };
      }
      return cosh;
    }());


    /**
     * Returns the square of the distance between the points (x1, y1) and (x2, y2).
     * @param {number} x1 X1.
     * @param {number} y1 Y1.
     * @param {number} x2 X2.
     * @param {number} y2 Y2.
     * @return {number} Squared distance.
     */
    function squaredDistance(x1, y1, x2, y2) {
      var dx = x2 - x1;
      var dy = y2 - y1;
      return dx * dx + dy * dy;
    }

    /**
     * @license
     * Latitude/longitude spherical geodesy formulae taken from
     * http://www.movable-type.co.uk/scripts/latlong.html
     * Licensed under CC-BY-3.0.
     */

    /**
     * @module ol/proj/Units
     */

    /**
     * Projection units: `'degrees'`, `'ft'`, `'m'`, `'pixels'`, `'tile-pixels'` or
     * `'us-ft'`.
     * @enum {string}
     */
    var Units = {
      DEGREES: 'degrees',
      FEET: 'ft',
      METERS: 'm',
      PIXELS: 'pixels',
      TILE_PIXELS: 'tile-pixels',
      USFEET: 'us-ft'
    };


    /**
     * Meters per unit lookup table.
     * @const
     * @type {Object.<module:ol/proj/Units, number>}
     * @api
     */
    var METERS_PER_UNIT = {};
    // use the radius of the Normal sphere
    METERS_PER_UNIT[Units.DEGREES] = 2 * Math.PI * 6370997 / 360;
    METERS_PER_UNIT[Units.FEET] = 0.3048;
    METERS_PER_UNIT[Units.METERS] = 1;
    METERS_PER_UNIT[Units.USFEET] = 1200 / 3937;

    /**
     * @module ol/proj/Projection
     */


    /**
     * @typedef {Object} Options
     * @property {string} code The SRS identifier code, e.g. `EPSG:4326`.
     * @property {module:ol/proj/Units|string} [units] Units. Required unless a
     * proj4 projection is defined for `code`.
     * @property {module:ol/extent~Extent} [extent] The validity extent for the SRS.
     * @property {string} [axisOrientation='enu'] The axis orientation as specified in Proj4.
     * @property {boolean} [global=false] Whether the projection is valid for the whole globe.
     * @property {number} [metersPerUnit] The meters per unit for the SRS.
     * If not provided, the `units` are used to get the meters per unit from the {@link module:ol/proj/Units~METERS_PER_UNIT}
     * lookup table.
     * @property {module:ol/extent~Extent} [worldExtent] The world extent for the SRS.
     * @property {function(number, module:ol/coordinate~Coordinate):number} [getPointResolution]
     * Function to determine resolution at a point. The function is called with a
     * `{number}` view resolution and an `{module:ol/coordinate~Coordinate}` as arguments, and returns
     * the `{number}` resolution at the passed coordinate. If this is `undefined`,
     * the default {@link module:ol/proj#getPointResolution} function will be used.
     */


    /**
     * @classdesc
     * Projection definition class. One of these is created for each projection
     * supported in the application and stored in the {@link module:ol/proj} namespace.
     * You can use these in applications, but this is not required, as API params
     * and options use {@link module:ol/proj~ProjectionLike} which means the simple string
     * code will suffice.
     *
     * You can use {@link module:ol/proj~get} to retrieve the object for a particular
     * projection.
     *
     * The library includes definitions for `EPSG:4326` and `EPSG:3857`, together
     * with the following aliases:
     * * `EPSG:4326`: CRS:84, urn:ogc:def:crs:EPSG:6.6:4326,
     *     urn:ogc:def:crs:OGC:1.3:CRS84, urn:ogc:def:crs:OGC:2:84,
     *     http://www.opengis.net/gml/srs/epsg.xml#4326,
     *     urn:x-ogc:def:crs:EPSG:4326
     * * `EPSG:3857`: EPSG:102100, EPSG:102113, EPSG:900913,
     *     urn:ogc:def:crs:EPSG:6.18:3:3857,
     *     http://www.opengis.net/gml/srs/epsg.xml#3857
     *
     * If you use [proj4js](https://github.com/proj4js/proj4js), aliases can
     * be added using `proj4.defs()`. After all required projection definitions are
     * added, call the {@link module:ol/proj/proj4~register} function.
     *
     * @api
     */
    var Projection = function Projection(options) {
      /**
       * @private
       * @type {string}
       */
      this.code_ = options.code;

      /**
       * Units of projected coordinates. When set to `TILE_PIXELS`, a
       * `this.extent_` and `this.worldExtent_` must be configured properly for each
       * tile.
       * @private
       * @type {module:ol/proj/Units}
       */
      this.units_ = /** @type {module:ol/proj/Units} */ (options.units);

      /**
       * Validity extent of the projection in projected coordinates. For projections
       * with `TILE_PIXELS` units, this is the extent of the tile in
       * tile pixel space.
       * @private
       * @type {module:ol/extent~Extent}
       */
      this.extent_ = options.extent !== undefined ? options.extent : null;

      /**
       * Extent of the world in EPSG:4326. For projections with
       * `TILE_PIXELS` units, this is the extent of the tile in
       * projected coordinate space.
       * @private
       * @type {module:ol/extent~Extent}
       */
      this.worldExtent_ = options.worldExtent !== undefined ?
        options.worldExtent : null;

      /**
       * @private
       * @type {string}
       */
      this.axisOrientation_ = options.axisOrientation !== undefined ?
        options.axisOrientation : 'enu';

      /**
       * @private
       * @type {boolean}
       */
      this.global_ = options.global !== undefined ? options.global : false;

      /**
       * @private
       * @type {boolean}
       */
      this.canWrapX_ = !!(this.global_ && this.extent_);

      /**
       * @private
       * @type {function(number, module:ol/coordinate~Coordinate):number|undefined}
       */
      this.getPointResolutionFunc_ = options.getPointResolution;

      /**
       * @private
       * @type {module:ol/tilegrid/TileGrid}
       */
      this.defaultTileGrid_ = null;

      /**
       * @private
       * @type {number|undefined}
       */
      this.metersPerUnit_ = options.metersPerUnit;
    };

    /**
     * @return {boolean} The projection is suitable for wrapping the x-axis
     */
    Projection.prototype.canWrapX = function canWrapX () {
      return this.canWrapX_;
    };

    /**
     * Get the code for this projection, e.g. 'EPSG:4326'.
     * @return {string} Code.
     * @api
     */
    Projection.prototype.getCode = function getCode () {
      return this.code_;
    };

    /**
     * Get the validity extent for this projection.
     * @return {module:ol/extent~Extent} Extent.
     * @api
     */
    Projection.prototype.getExtent = function getExtent () {
      return this.extent_;
    };

    /**
     * Get the units of this projection.
     * @return {module:ol/proj/Units} Units.
     * @api
     */
    Projection.prototype.getUnits = function getUnits () {
      return this.units_;
    };

    /**
     * Get the amount of meters per unit of this projection.If the projection is
     * not configured with `metersPerUnit` or a units identifier, the return is
     * `undefined`.
     * @return {number|undefined} Meters.
     * @api
     */
    Projection.prototype.getMetersPerUnit = function getMetersPerUnit () {
      return this.metersPerUnit_ || METERS_PER_UNIT[this.units_];
    };

    /**
     * Get the world extent for this projection.
     * @return {module:ol/extent~Extent} Extent.
     * @api
     */
    Projection.prototype.getWorldExtent = function getWorldExtent () {
      return this.worldExtent_;
    };

    /**
     * Get the axis orientation of this projection.
     * Example values are:
     * enu - the default easting, northing, elevation.
     * neu - northing, easting, up - useful for "lat/long" geographic coordinates,
     *   or south orientated transverse mercator.
     * wnu - westing, northing, up - some planetary coordinate systems have
     *   "west positive" coordinate systems
     * @return {string} Axis orientation.
     * @api
     */
    Projection.prototype.getAxisOrientation = function getAxisOrientation () {
      return this.axisOrientation_;
    };

    /**
     * Is this projection a global projection which spans the whole world?
     * @return {boolean} Whether the projection is global.
     * @api
     */
    Projection.prototype.isGlobal = function isGlobal () {
      return this.global_;
    };

    /**
     * Set if the projection is a global projection which spans the whole world
     * @param {boolean} global Whether the projection is global.
     * @api
     */
    Projection.prototype.setGlobal = function setGlobal (global) {
      this.global_ = global;
      this.canWrapX_ = !!(global && this.extent_);
    };

    /**
     * @return {module:ol/tilegrid/TileGrid} The default tile grid.
     */
    Projection.prototype.getDefaultTileGrid = function getDefaultTileGrid () {
      return this.defaultTileGrid_;
    };

    /**
     * @param {module:ol/tilegrid/TileGrid} tileGrid The default tile grid.
     */
    Projection.prototype.setDefaultTileGrid = function setDefaultTileGrid (tileGrid) {
      this.defaultTileGrid_ = tileGrid;
    };

    /**
     * Set the validity extent for this projection.
     * @param {module:ol/extent~Extent} extent Extent.
     * @api
     */
    Projection.prototype.setExtent = function setExtent (extent) {
      this.extent_ = extent;
      this.canWrapX_ = !!(this.global_ && extent);
    };

    /**
     * Set the world extent for this projection.
     * @param {module:ol/extent~Extent} worldExtent World extent
     *   [minlon, minlat, maxlon, maxlat].
     * @api
     */
    Projection.prototype.setWorldExtent = function setWorldExtent (worldExtent) {
      this.worldExtent_ = worldExtent;
    };

    /**
     * Set the getPointResolution function (see {@link module:ol/proj~getPointResolution}
     * for this projection.
     * @param {function(number, module:ol/coordinate~Coordinate):number} func Function
     * @api
     */
    Projection.prototype.setGetPointResolution = function setGetPointResolution (func) {
      this.getPointResolutionFunc_ = func;
    };

    /**
     * Get the custom point resolution function for this projection (if set).
     * @return {function(number, module:ol/coordinate~Coordinate):number|undefined} The custom point
     * resolution function (if set).
     */
    Projection.prototype.getPointResolutionFunc = function getPointResolutionFunc () {
      return this.getPointResolutionFunc_;
    };

    /**
     * @module ol/proj/epsg3857
     */


    /**
     * Radius of WGS84 sphere
     *
     * @const
     * @type {number}
     */
    var RADIUS = 6378137;


    /**
     * @const
     * @type {number}
     */
    var HALF_SIZE = Math.PI * RADIUS;


    /**
     * @const
     * @type {module:ol/extent~Extent}
     */
    var EXTENT = [
      -HALF_SIZE, -HALF_SIZE,
      HALF_SIZE, HALF_SIZE
    ];


    /**
     * @const
     * @type {module:ol/extent~Extent}
     */
    var WORLD_EXTENT = [-180, -85, 180, 85];


    /**
     * @classdesc
     * Projection object for web/spherical Mercator (EPSG:3857).
     */
    var EPSG3857Projection = (function (Projection$$1) {
      function EPSG3857Projection(code) {
        Projection$$1.call(this, {
          code: code,
          units: Units.METERS,
          extent: EXTENT,
          global: true,
          worldExtent: WORLD_EXTENT,
          getPointResolution: function(resolution, point) {
            return resolution / cosh(point[1] / RADIUS);
          }
        });

      }

      if ( Projection$$1 ) EPSG3857Projection.__proto__ = Projection$$1;
      EPSG3857Projection.prototype = Object.create( Projection$$1 && Projection$$1.prototype );
      EPSG3857Projection.prototype.constructor = EPSG3857Projection;

      return EPSG3857Projection;
    }(Projection));


    /**
     * Projections equal to EPSG:3857.
     *
     * @const
     * @type {Array.<module:ol/proj/Projection>}
     */
    var PROJECTIONS = [
      new EPSG3857Projection('EPSG:3857'),
      new EPSG3857Projection('EPSG:102100'),
      new EPSG3857Projection('EPSG:102113'),
      new EPSG3857Projection('EPSG:900913'),
      new EPSG3857Projection('urn:ogc:def:crs:EPSG:6.18:3:3857'),
      new EPSG3857Projection('urn:ogc:def:crs:EPSG::3857'),
      new EPSG3857Projection('http://www.opengis.net/gml/srs/epsg.xml#3857')
    ];


    /**
     * Transformation from EPSG:4326 to EPSG:3857.
     *
     * @param {Array.<number>} input Input array of coordinate values.
     * @param {Array.<number>=} opt_output Output array of coordinate values.
     * @param {number=} opt_dimension Dimension (default is `2`).
     * @return {Array.<number>} Output array of coordinate values.
     */
    function fromEPSG4326(input, opt_output, opt_dimension) {
      var length = input.length;
      var dimension = opt_dimension > 1 ? opt_dimension : 2;
      var output = opt_output;
      if (output === undefined) {
        if (dimension > 2) {
          // preserve values beyond second dimension
          output = input.slice();
        } else {
          output = new Array(length);
        }
      }
      var halfSize = HALF_SIZE;
      for (var i = 0; i < length; i += dimension) {
        output[i] = halfSize * input[i] / 180;
        var y = RADIUS *
            Math.log(Math.tan(Math.PI * (input[i + 1] + 90) / 360));
        if (y > halfSize) {
          y = halfSize;
        } else if (y < -halfSize) {
          y = -halfSize;
        }
        output[i + 1] = y;
      }
      return output;
    }


    /**
     * Transformation from EPSG:3857 to EPSG:4326.
     *
     * @param {Array.<number>} input Input array of coordinate values.
     * @param {Array.<number>=} opt_output Output array of coordinate values.
     * @param {number=} opt_dimension Dimension (default is `2`).
     * @return {Array.<number>} Output array of coordinate values.
     */
    function toEPSG4326(input, opt_output, opt_dimension) {
      var length = input.length;
      var dimension = opt_dimension > 1 ? opt_dimension : 2;
      var output = opt_output;
      if (output === undefined) {
        if (dimension > 2) {
          // preserve values beyond second dimension
          output = input.slice();
        } else {
          output = new Array(length);
        }
      }
      for (var i = 0; i < length; i += dimension) {
        output[i] = 180 * input[i] / HALF_SIZE;
        output[i + 1] = 360 * Math.atan(
          Math.exp(input[i + 1] / RADIUS)) / Math.PI - 90;
      }
      return output;
    }

    /**
     * @module ol/proj/epsg4326
     */


    /**
     * Semi-major radius of the WGS84 ellipsoid.
     *
     * @const
     * @type {number}
     */
    var RADIUS$1 = 6378137;


    /**
     * Extent of the EPSG:4326 projection which is the whole world.
     *
     * @const
     * @type {module:ol/extent~Extent}
     */
    var EXTENT$1 = [-180, -90, 180, 90];


    /**
     * @const
     * @type {number}
     */
    var METERS_PER_UNIT$1 = Math.PI * RADIUS$1 / 180;


    /**
     * @classdesc
     * Projection object for WGS84 geographic coordinates (EPSG:4326).
     *
     * Note that OpenLayers does not strictly comply with the EPSG definition.
     * The EPSG registry defines 4326 as a CRS for Latitude,Longitude (y,x).
     * OpenLayers treats EPSG:4326 as a pseudo-projection, with x,y coordinates.
     */
    var EPSG4326Projection = (function (Projection$$1) {
      function EPSG4326Projection(code, opt_axisOrientation) {
        Projection$$1.call(this, {
          code: code,
          units: Units.DEGREES,
          extent: EXTENT$1,
          axisOrientation: opt_axisOrientation,
          global: true,
          metersPerUnit: METERS_PER_UNIT$1,
          worldExtent: EXTENT$1
        });

      }

      if ( Projection$$1 ) EPSG4326Projection.__proto__ = Projection$$1;
      EPSG4326Projection.prototype = Object.create( Projection$$1 && Projection$$1.prototype );
      EPSG4326Projection.prototype.constructor = EPSG4326Projection;

      return EPSG4326Projection;
    }(Projection));


    /**
     * Projections equal to EPSG:4326.
     *
     * @const
     * @type {Array.<module:ol/proj/Projection>}
     */
    var PROJECTIONS$1 = [
      new EPSG4326Projection('CRS:84'),
      new EPSG4326Projection('EPSG:4326', 'neu'),
      new EPSG4326Projection('urn:ogc:def:crs:EPSG::4326', 'neu'),
      new EPSG4326Projection('urn:ogc:def:crs:EPSG:6.6:4326', 'neu'),
      new EPSG4326Projection('urn:ogc:def:crs:OGC:1.3:CRS84'),
      new EPSG4326Projection('urn:ogc:def:crs:OGC:2:84'),
      new EPSG4326Projection('http://www.opengis.net/gml/srs/epsg.xml#4326', 'neu'),
      new EPSG4326Projection('urn:x-ogc:def:crs:EPSG:4326', 'neu')
    ];

    /**
     * @module ol/proj/projections
     */


    /**
     * @type {Object.<string, module:ol/proj/Projection>}
     */
    var cache = {};


    /**
     * Get a cached projection by code.
     * @param {string} code The code for the projection.
     * @return {module:ol/proj/Projection} The projection (if cached).
     */
    function get(code) {
      return cache[code] || null;
    }


    /**
     * Add a projection to the cache.
     * @param {string} code The projection code.
     * @param {module:ol/proj/Projection} projection The projection to cache.
     */
    function add(code, projection) {
      cache[code] = projection;
    }

    /**
     * @module ol/proj/transforms
     */


    /**
     * @private
     * @type {!Object.<string, Object.<string, module:ol/proj~TransformFunction>>}
     */
    var transforms = {};


    /**
     * Registers a conversion function to convert coordinates from the source
     * projection to the destination projection.
     *
     * @param {module:ol/proj/Projection} source Source.
     * @param {module:ol/proj/Projection} destination Destination.
     * @param {module:ol/proj~TransformFunction} transformFn Transform.
     */
    function add$1(source, destination, transformFn) {
      var sourceCode = source.getCode();
      var destinationCode = destination.getCode();
      if (!(sourceCode in transforms)) {
        transforms[sourceCode] = {};
      }
      transforms[sourceCode][destinationCode] = transformFn;
    }


    /**
     * Get a transform given a source code and a destination code.
     * @param {string} sourceCode The code for the source projection.
     * @param {string} destinationCode The code for the destination projection.
     * @return {module:ol/proj~TransformFunction|undefined} The transform function (if found).
     */
    function get$1(sourceCode, destinationCode) {
      var transform;
      if (sourceCode in transforms && destinationCode in transforms[sourceCode]) {
        transform = transforms[sourceCode][destinationCode];
      }
      return transform;
    }

    /**
     * @module ol/proj
     */


    /**
     * @param {Array.<number>} input Input coordinate array.
     * @param {Array.<number>=} opt_output Output array of coordinate values.
     * @param {number=} opt_dimension Dimension.
     * @return {Array.<number>} Output coordinate array (new array, same coordinate
     *     values).
     */
    function cloneTransform(input, opt_output, opt_dimension) {
      var output;
      if (opt_output !== undefined) {
        for (var i = 0, ii = input.length; i < ii; ++i) {
          opt_output[i] = input[i];
        }
        output = opt_output;
      } else {
        output = input.slice();
      }
      return output;
    }


    /**
     * @param {Array.<number>} input Input coordinate array.
     * @param {Array.<number>=} opt_output Output array of coordinate values.
     * @param {number=} opt_dimension Dimension.
     * @return {Array.<number>} Input coordinate array (same array as input).
     */
    function identityTransform(input, opt_output, opt_dimension) {
      if (opt_output !== undefined && input !== opt_output) {
        for (var i = 0, ii = input.length; i < ii; ++i) {
          opt_output[i] = input[i];
        }
        input = opt_output;
      }
      return input;
    }


    /**
     * Add a Projection object to the list of supported projections that can be
     * looked up by their code.
     *
     * @param {module:ol/proj/Projection} projection Projection instance.
     * @api
     */
    function addProjection(projection) {
      add(projection.getCode(), projection);
      add$1(projection, projection, cloneTransform);
    }


    /**
     * @param {Array.<module:ol/proj/Projection>} projections Projections.
     */
    function addProjections(projections) {
      projections.forEach(addProjection);
    }


    /**
     * Fetches a Projection object for the code specified.
     *
     * @param {module:ol/proj~ProjectionLike} projectionLike Either a code string which is
     *     a combination of authority and identifier such as "EPSG:4326", or an
     *     existing projection object, or undefined.
     * @return {module:ol/proj/Projection} Projection object, or null if not in list.
     * @api
     */
    function get$2(projectionLike) {
      var projection = null;
      if (projectionLike instanceof Projection) {
        projection = projectionLike;
      } else if (typeof projectionLike === 'string') {
        var code = projectionLike;
        projection = get(code);
      }
      return projection;
    }


    /**
     * Registers transformation functions that don't alter coordinates. Those allow
     * to transform between projections with equal meaning.
     *
     * @param {Array.<module:ol/proj/Projection>} projections Projections.
     * @api
     */
    function addEquivalentProjections(projections) {
      addProjections(projections);
      projections.forEach(function(source) {
        projections.forEach(function(destination) {
          if (source !== destination) {
            add$1(source, destination, cloneTransform);
          }
        });
      });
    }


    /**
     * Registers transformation functions to convert coordinates in any projection
     * in projection1 to any projection in projection2.
     *
     * @param {Array.<module:ol/proj/Projection>} projections1 Projections with equal
     *     meaning.
     * @param {Array.<module:ol/proj/Projection>} projections2 Projections with equal
     *     meaning.
     * @param {module:ol/proj~TransformFunction} forwardTransform Transformation from any
     *   projection in projection1 to any projection in projection2.
     * @param {module:ol/proj~TransformFunction} inverseTransform Transform from any projection
     *   in projection2 to any projection in projection1..
     */
    function addEquivalentTransforms(projections1, projections2, forwardTransform, inverseTransform) {
      projections1.forEach(function(projection1) {
        projections2.forEach(function(projection2) {
          add$1(projection1, projection2, forwardTransform);
          add$1(projection2, projection1, inverseTransform);
        });
      });
    }


    /**
     * Searches in the list of transform functions for the function for converting
     * coordinates from the source projection to the destination projection.
     *
     * @param {module:ol/proj/Projection} sourceProjection Source Projection object.
     * @param {module:ol/proj/Projection} destinationProjection Destination Projection
     *     object.
     * @return {module:ol/proj~TransformFunction} Transform function.
     */
    function getTransformFromProjections(sourceProjection, destinationProjection) {
      var sourceCode = sourceProjection.getCode();
      var destinationCode = destinationProjection.getCode();
      var transformFunc = get$1(sourceCode, destinationCode);
      if (!transformFunc) {
        transformFunc = identityTransform;
      }
      return transformFunc;
    }


    /**
     * Given the projection-like objects, searches for a transformation
     * function to convert a coordinates array from the source projection to the
     * destination projection.
     *
     * @param {module:ol/proj~ProjectionLike} source Source.
     * @param {module:ol/proj~ProjectionLike} destination Destination.
     * @return {module:ol/proj~TransformFunction} Transform function.
     * @api
     */
    function getTransform(source, destination) {
      var sourceProjection = get$2(source);
      var destinationProjection = get$2(destination);
      return getTransformFromProjections(sourceProjection, destinationProjection);
    }

    /**
     * Add transforms to and from EPSG:4326 and EPSG:3857.  This function is called
     * by when this module is executed and should only need to be called again after
     * `clearAllProjections()` is called (e.g. in tests).
     */
    function addCommon() {
      // Add transformations that don't alter coordinates to convert within set of
      // projections with equal meaning.
      addEquivalentProjections(PROJECTIONS);
      addEquivalentProjections(PROJECTIONS$1);
      // Add transformations to convert EPSG:4326 like coordinates to EPSG:3857 like
      // coordinates and back.
      addEquivalentTransforms(PROJECTIONS$1, PROJECTIONS, fromEPSG4326, toEPSG4326);
    }

    addCommon();

    /**
     * @module ol/transform
     */


    /**
     * Create an identity transform.
     * @return {!module:ol/transform~Transform} Identity transform.
     */
    function create() {
      return [1, 0, 0, 1, 0, 0];
    }


    /**
     * Creates a composite transform given an initial translation, scale, rotation, and
     * final translation (in that order only, not commutative).
     * @param {!module:ol/transform~Transform} transform The transform (will be modified in place).
     * @param {number} dx1 Initial translation x.
     * @param {number} dy1 Initial translation y.
     * @param {number} sx Scale factor x.
     * @param {number} sy Scale factor y.
     * @param {number} angle Rotation (in counter-clockwise radians).
     * @param {number} dx2 Final translation x.
     * @param {number} dy2 Final translation y.
     * @return {!module:ol/transform~Transform} The composite transform.
     */
    function compose(transform, dx1, dy1, sx, sy, angle, dx2, dy2) {
      var sin = Math.sin(angle);
      var cos = Math.cos(angle);
      transform[0] = sx * cos;
      transform[1] = sy * sin;
      transform[2] = -sx * sin;
      transform[3] = sy * cos;
      transform[4] = dx2 * sx * cos - dy2 * sx * sin + dx1;
      transform[5] = dx2 * sy * sin + dy2 * sy * cos + dy1;
      return transform;
    }

    /**
     * @module ol/geom/Geometry
     */


    /**
     * @type {module:ol/transform~Transform}
     */
    var tmpTransform = create();


    /**
     * @classdesc
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * Base class for vector geometries.
     *
     * To get notified of changes to the geometry, register a listener for the
     * generic `change` event on your geometry instance.
     *
     * @abstract
     * @api
     */
    var Geometry = (function (BaseObject$$1) {
      function Geometry() {

        BaseObject$$1.call(this);

        /**
         * @private
         * @type {module:ol/extent~Extent}
         */
        this.extent_ = createEmpty();

        /**
         * @private
         * @type {number}
         */
        this.extentRevision_ = -1;

        /**
         * @protected
         * @type {Object.<string, module:ol/geom/Geometry>}
         */
        this.simplifiedGeometryCache = {};

        /**
         * @protected
         * @type {number}
         */
        this.simplifiedGeometryMaxMinSquaredTolerance = 0;

        /**
         * @protected
         * @type {number}
         */
        this.simplifiedGeometryRevision = 0;

      }

      if ( BaseObject$$1 ) Geometry.__proto__ = BaseObject$$1;
      Geometry.prototype = Object.create( BaseObject$$1 && BaseObject$$1.prototype );
      Geometry.prototype.constructor = Geometry;

      /**
       * Make a complete copy of the geometry.
       * @abstract
       * @return {!module:ol/geom/Geometry} Clone.
       */
      Geometry.prototype.clone = function clone$$1 () {};

      /**
       * @abstract
       * @param {number} x X.
       * @param {number} y Y.
       * @param {module:ol/coordinate~Coordinate} closestPoint Closest point.
       * @param {number} minSquaredDistance Minimum squared distance.
       * @return {number} Minimum squared distance.
       */
      Geometry.prototype.closestPointXY = function closestPointXY (x, y, closestPoint, minSquaredDistance) {};

      /**
       * Return the closest point of the geometry to the passed point as
       * {@link module:ol/coordinate~Coordinate coordinate}.
       * @param {module:ol/coordinate~Coordinate} point Point.
       * @param {module:ol/coordinate~Coordinate=} opt_closestPoint Closest point.
       * @return {module:ol/coordinate~Coordinate} Closest point.
       * @api
       */
      Geometry.prototype.getClosestPoint = function getClosestPoint (point, opt_closestPoint) {
        var closestPoint = opt_closestPoint ? opt_closestPoint : [NaN, NaN];
        this.closestPointXY(point[0], point[1], closestPoint, Infinity);
        return closestPoint;
      };

      /**
       * Returns true if this geometry includes the specified coordinate. If the
       * coordinate is on the boundary of the geometry, returns false.
       * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
       * @return {boolean} Contains coordinate.
       * @api
       */
      Geometry.prototype.intersectsCoordinate = function intersectsCoordinate (coordinate) {
        return this.containsXY(coordinate[0], coordinate[1]);
      };

      /**
       * @abstract
       * @param {module:ol/extent~Extent} extent Extent.
       * @protected
       * @return {module:ol/extent~Extent} extent Extent.
       */
      Geometry.prototype.computeExtent = function computeExtent (extent) {};

      /**
       * Get the extent of the geometry.
       * @param {module:ol/extent~Extent=} opt_extent Extent.
       * @return {module:ol/extent~Extent} extent Extent.
       * @api
       */
      Geometry.prototype.getExtent = function getExtent (opt_extent) {
        if (this.extentRevision_ != this.getRevision()) {
          this.extent_ = this.computeExtent(this.extent_);
          this.extentRevision_ = this.getRevision();
        }
        return returnOrUpdate(this.extent_, opt_extent);
      };

      /**
       * Rotate the geometry around a given coordinate. This modifies the geometry
       * coordinates in place.
       * @abstract
       * @param {number} angle Rotation angle in radians.
       * @param {module:ol/coordinate~Coordinate} anchor The rotation center.
       * @api
       */
      Geometry.prototype.rotate = function rotate$$1 (angle, anchor) {};

      /**
       * Scale the geometry (with an optional origin).  This modifies the geometry
       * coordinates in place.
       * @abstract
       * @param {number} sx The scaling factor in the x-direction.
       * @param {number=} opt_sy The scaling factor in the y-direction (defaults to
       *     sx).
       * @param {module:ol/coordinate~Coordinate=} opt_anchor The scale origin (defaults to the center
       *     of the geometry extent).
       * @api
       */
      Geometry.prototype.scale = function scale$$1 (sx, opt_sy, opt_anchor) {};

      /**
       * Translate the geometry. This modifies the geometry coordinates in place.
       * @abstract
       * @param {number} deltaX Delta X.
       * @param {number} deltaY Delta Y.
       * @api
       */
      Geometry.prototype.translate = function translate$$1 (deltaX, deltaY) {};

      /**
       * Create a simplified version of this geometry.  For linestrings, this uses
       * the the {@link
       * https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm
       * Douglas Peucker} algorithm.  For polygons, a quantization-based
       * simplification is used to preserve topology.
       * @function
       * @param {number} tolerance The tolerance distance for simplification.
       * @return {module:ol/geom/Geometry} A new, simplified version of the original
       *     geometry.
       * @api
       */
      Geometry.prototype.simplify = function simplify (tolerance) {
        return this.getSimplifiedGeometry(tolerance * tolerance);
      };

      /**
       * Create a simplified version of this geometry using the Douglas Peucker
       * algorithm.
       * See https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm.
       * @abstract
       * @param {number} squaredTolerance Squared tolerance.
       * @return {module:ol/geom/Geometry} Simplified geometry.
       */
      Geometry.prototype.getSimplifiedGeometry = function getSimplifiedGeometry (squaredTolerance) {};

      /**
       * Get the type of this geometry.
       * @abstract
       * @return {module:ol/geom/GeometryType} Geometry type.
       */
      Geometry.prototype.getType = function getType () {};

      /**
       * Apply a transform function to each coordinate of the geometry.
       * The geometry is modified in place.
       * If you do not want the geometry modified in place, first `clone()` it and
       * then use this function on the clone.
       * @abstract
       * @param {module:ol/proj~TransformFunction} transformFn Transform.
       */
      Geometry.prototype.applyTransform = function applyTransform$$1 (transformFn) {};

      /**
       * Test if the geometry and the passed extent intersect.
       * @abstract
       * @param {module:ol/extent~Extent} extent Extent.
       * @return {boolean} `true` if the geometry and the extent intersect.
       */
      Geometry.prototype.intersectsExtent = function intersectsExtent (extent) {};

      /**
       * Translate the geometry.  This modifies the geometry coordinates in place.  If
       * instead you want a new geometry, first `clone()` this geometry.
       * @abstract
       * @param {number} deltaX Delta X.
       * @param {number} deltaY Delta Y.
       */
      Geometry.prototype.translate = function translate$$1 (deltaX, deltaY) {};

      /**
       * Transform each coordinate of the geometry from one coordinate reference
       * system to another. The geometry is modified in place.
       * For example, a line will be transformed to a line and a circle to a circle.
       * If you do not want the geometry modified in place, first `clone()` it and
       * then use this function on the clone.
       *
       * @param {module:ol/proj~ProjectionLike} source The current projection.  Can be a
       *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
       * @param {module:ol/proj~ProjectionLike} destination The desired projection.  Can be a
       *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
       * @return {module:ol/geom/Geometry} This geometry.  Note that original geometry is
       *     modified in place.
       * @api
       */
      Geometry.prototype.transform = function transform$$1 (source, destination) {
        source = get$2(source);
        var transformFn = source.getUnits() == Units.TILE_PIXELS ?
          function(inCoordinates, outCoordinates, stride) {
            var pixelExtent = source.getExtent();
            var projectedExtent = source.getWorldExtent();
            var scale$$1 = getHeight(projectedExtent) / getHeight(pixelExtent);
            compose(tmpTransform,
              projectedExtent[0], projectedExtent[3],
              scale$$1, -scale$$1, 0,
              0, 0);
            transform2D(inCoordinates, 0, inCoordinates.length, stride,
              tmpTransform, outCoordinates);
            return getTransform(source, destination)(inCoordinates, outCoordinates, stride);
          } :
          getTransform(source, destination);
        this.applyTransform(transformFn);
        return this;
      };

      return Geometry;
    }(BaseObject));


    /**
     * @param {number} x X.
     * @param {number} y Y.
     * @return {boolean} Contains (x, y).
     */
    Geometry.prototype.containsXY = FALSE;

    /**
     * @module ol/geom/GeometryLayout
     */

    /**
     * The coordinate layout for geometries, indicating whether a 3rd or 4th z ('Z')
     * or measure ('M') coordinate is available. Supported values are `'XY'`,
     * `'XYZ'`, `'XYM'`, `'XYZM'`.
     * @enum {string}
     */
    var GeometryLayout = {
      XY: 'XY',
      XYZ: 'XYZ',
      XYM: 'XYM',
      XYZM: 'XYZM'
    };

    /**
     * @module ol/geom/SimpleGeometry
     */

    /**
     * @classdesc
     * Abstract base class; only used for creating subclasses; do not instantiate
     * in apps, as cannot be rendered.
     *
     * @abstract
     * @api
     */
    var SimpleGeometry = (function (Geometry$$1) {
      function SimpleGeometry() {

        Geometry$$1.call(this);

        /**
         * @protected
         * @type {module:ol/geom/GeometryLayout}
         */
        this.layout = GeometryLayout.XY;

        /**
         * @protected
         * @type {number}
         */
        this.stride = 2;

        /**
         * @protected
         * @type {Array.<number>}
         */
        this.flatCoordinates = null;

      }

      if ( Geometry$$1 ) SimpleGeometry.__proto__ = Geometry$$1;
      SimpleGeometry.prototype = Object.create( Geometry$$1 && Geometry$$1.prototype );
      SimpleGeometry.prototype.constructor = SimpleGeometry;

      /**
       * @inheritDoc
       */
      SimpleGeometry.prototype.computeExtent = function computeExtent (extent) {
        return createOrUpdateFromFlatCoordinates(this.flatCoordinates,
          0, this.flatCoordinates.length, this.stride, extent);
      };

      /**
       * @abstract
       * @return {Array} Coordinates.
       */
      SimpleGeometry.prototype.getCoordinates = function getCoordinates () {};

      /**
       * Return the first coordinate of the geometry.
       * @return {module:ol/coordinate~Coordinate} First coordinate.
       * @api
       */
      SimpleGeometry.prototype.getFirstCoordinate = function getFirstCoordinate () {
        return this.flatCoordinates.slice(0, this.stride);
      };

      /**
       * @return {Array.<number>} Flat coordinates.
       */
      SimpleGeometry.prototype.getFlatCoordinates = function getFlatCoordinates () {
        return this.flatCoordinates;
      };

      /**
       * Return the last coordinate of the geometry.
       * @return {module:ol/coordinate~Coordinate} Last point.
       * @api
       */
      SimpleGeometry.prototype.getLastCoordinate = function getLastCoordinate () {
        return this.flatCoordinates.slice(this.flatCoordinates.length - this.stride);
      };

      /**
       * Return the {@link module:ol/geom/GeometryLayout~GeometryLayout layout} of the geometry.
       * @return {module:ol/geom/GeometryLayout} Layout.
       * @api
       */
      SimpleGeometry.prototype.getLayout = function getLayout () {
        return this.layout;
      };

      /**
       * @inheritDoc
       */
      SimpleGeometry.prototype.getSimplifiedGeometry = function getSimplifiedGeometry (squaredTolerance) {
        if (this.simplifiedGeometryRevision != this.getRevision()) {
          clear(this.simplifiedGeometryCache);
          this.simplifiedGeometryMaxMinSquaredTolerance = 0;
          this.simplifiedGeometryRevision = this.getRevision();
        }
        // If squaredTolerance is negative or if we know that simplification will not
        // have any effect then just return this.
        if (squaredTolerance < 0 ||
            (this.simplifiedGeometryMaxMinSquaredTolerance !== 0 &&
             squaredTolerance <= this.simplifiedGeometryMaxMinSquaredTolerance)) {
          return this;
        }
        var key = squaredTolerance.toString();
        if (this.simplifiedGeometryCache.hasOwnProperty(key)) {
          return this.simplifiedGeometryCache[key];
        } else {
          var simplifiedGeometry =
              this.getSimplifiedGeometryInternal(squaredTolerance);
          var simplifiedFlatCoordinates = simplifiedGeometry.getFlatCoordinates();
          if (simplifiedFlatCoordinates.length < this.flatCoordinates.length) {
            this.simplifiedGeometryCache[key] = simplifiedGeometry;
            return simplifiedGeometry;
          } else {
            // Simplification did not actually remove any coordinates.  We now know
            // that any calls to getSimplifiedGeometry with a squaredTolerance less
            // than or equal to the current squaredTolerance will also not have any
            // effect.  This allows us to short circuit simplification (saving CPU
            // cycles) and prevents the cache of simplified geometries from filling
            // up with useless identical copies of this geometry (saving memory).
            this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
            return this;
          }
        }
      };

      /**
       * @param {number} squaredTolerance Squared tolerance.
       * @return {module:ol/geom/SimpleGeometry} Simplified geometry.
       * @protected
       */
      SimpleGeometry.prototype.getSimplifiedGeometryInternal = function getSimplifiedGeometryInternal (squaredTolerance) {
        return this;
      };

      /**
       * @return {number} Stride.
       */
      SimpleGeometry.prototype.getStride = function getStride () {
        return this.stride;
      };

      /**
       * @param {module:ol/geom/GeometryLayout} layout Layout.
       * @param {Array.<number>} flatCoordinates Flat coordinates.
        */
      SimpleGeometry.prototype.setFlatCoordinates = function setFlatCoordinates (layout, flatCoordinates) {
        this.stride = getStrideForLayout(layout);
        this.layout = layout;
        this.flatCoordinates = flatCoordinates;
      };

      /**
       * @abstract
       * @param {!Array} coordinates Coordinates.
       * @param {module:ol/geom/GeometryLayout=} opt_layout Layout.
       */
      SimpleGeometry.prototype.setCoordinates = function setCoordinates (coordinates, opt_layout) {};

      /**
       * @param {module:ol/geom/GeometryLayout|undefined} layout Layout.
       * @param {Array} coordinates Coordinates.
       * @param {number} nesting Nesting.
       * @protected
       */
      SimpleGeometry.prototype.setLayout = function setLayout (layout, coordinates, nesting) {
        var this$1 = this;

        /** @type {number} */
        var stride;
        if (layout) {
          stride = getStrideForLayout(layout);
        } else {
          for (var i = 0; i < nesting; ++i) {
            if (coordinates.length === 0) {
              this$1.layout = GeometryLayout.XY;
              this$1.stride = 2;
              return;
            } else {
              coordinates = /** @type {Array} */ (coordinates[0]);
            }
          }
          stride = coordinates.length;
          layout = getLayoutForStride(stride);
        }
        this.layout = layout;
        this.stride = stride;
      };

      /**
       * @inheritDoc
       * @api
       */
      SimpleGeometry.prototype.applyTransform = function applyTransform$$1 (transformFn) {
        if (this.flatCoordinates) {
          transformFn(this.flatCoordinates, this.flatCoordinates, this.stride);
          this.changed();
        }
      };

      /**
       * @inheritDoc
       * @api
       */
      SimpleGeometry.prototype.rotate = function rotate$1 (angle, anchor) {
        var flatCoordinates = this.getFlatCoordinates();
        if (flatCoordinates) {
          var stride = this.getStride();
          rotate(
            flatCoordinates, 0, flatCoordinates.length,
            stride, angle, anchor, flatCoordinates);
          this.changed();
        }
      };

      /**
       * @inheritDoc
       * @api
       */
      SimpleGeometry.prototype.scale = function scale$1 (sx, opt_sy, opt_anchor) {
        var sy = opt_sy;
        if (sy === undefined) {
          sy = sx;
        }
        var anchor = opt_anchor;
        if (!anchor) {
          anchor = getCenter(this.getExtent());
        }
        var flatCoordinates = this.getFlatCoordinates();
        if (flatCoordinates) {
          var stride = this.getStride();
          scale(
            flatCoordinates, 0, flatCoordinates.length,
            stride, sx, sy, anchor, flatCoordinates);
          this.changed();
        }
      };

      /**
       * @inheritDoc
       * @api
       */
      SimpleGeometry.prototype.translate = function translate$1 (deltaX, deltaY) {
        var flatCoordinates = this.getFlatCoordinates();
        if (flatCoordinates) {
          var stride = this.getStride();
          translate(
            flatCoordinates, 0, flatCoordinates.length, stride,
            deltaX, deltaY, flatCoordinates);
          this.changed();
        }
      };

      return SimpleGeometry;
    }(Geometry));


    /**
     * @param {number} stride Stride.
     * @return {module:ol/geom/GeometryLayout} layout Layout.
     */
    function getLayoutForStride(stride) {
      var layout;
      if (stride == 2) {
        layout = GeometryLayout.XY;
      } else if (stride == 3) {
        layout = GeometryLayout.XYZ;
      } else if (stride == 4) {
        layout = GeometryLayout.XYZM;
      }
      return (
        /** @type {module:ol/geom/GeometryLayout} */ (layout)
      );
    }


    /**
     * @param {module:ol/geom/GeometryLayout} layout Layout.
     * @return {number} Stride.
     */
    function getStrideForLayout(layout) {
      var stride;
      if (layout == GeometryLayout.XY) {
        stride = 2;
      } else if (layout == GeometryLayout.XYZ || layout == GeometryLayout.XYM) {
        stride = 3;
      } else if (layout == GeometryLayout.XYZM) {
        stride = 4;
      }
      return /** @type {number} */ (stride);
    }


    /**
     * @inheritDoc
     */
    SimpleGeometry.prototype.containsXY = FALSE;

    /**
     * @module ol/geom/flat/deflate
     */


    /**
     * @param {Array.<number>} flatCoordinates Flat coordinates.
     * @param {number} offset Offset.
     * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
     * @param {number} stride Stride.
     * @return {number} offset Offset.
     */
    function deflateCoordinate(flatCoordinates, offset, coordinate, stride) {
      for (var i = 0, ii = coordinate.length; i < ii; ++i) {
        flatCoordinates[offset++] = coordinate[i];
      }
      return offset;
    }

    /**
     * @module ol/geom/Point
     */

    /**
     * @classdesc
     * Point geometry.
     *
     * @api
     */
    var Point = (function (SimpleGeometry$$1) {
      function Point(coordinates, opt_layout) {
        SimpleGeometry$$1.call(this);
        this.setCoordinates(coordinates, opt_layout);
      }

      if ( SimpleGeometry$$1 ) Point.__proto__ = SimpleGeometry$$1;
      Point.prototype = Object.create( SimpleGeometry$$1 && SimpleGeometry$$1.prototype );
      Point.prototype.constructor = Point;

      /**
       * Make a complete copy of the geometry.
       * @return {!module:ol/geom/Point} Clone.
       * @override
       * @api
       */
      Point.prototype.clone = function clone$$1 () {
        var point = new Point(this.flatCoordinates.slice(), this.layout);
        return point;
      };

      /**
       * @inheritDoc
       */
      Point.prototype.closestPointXY = function closestPointXY (x, y, closestPoint, minSquaredDistance) {
        var flatCoordinates = this.flatCoordinates;
        var squaredDistance$$1 = squaredDistance(x, y, flatCoordinates[0], flatCoordinates[1]);
        if (squaredDistance$$1 < minSquaredDistance) {
          var stride = this.stride;
          for (var i = 0; i < stride; ++i) {
            closestPoint[i] = flatCoordinates[i];
          }
          closestPoint.length = stride;
          return squaredDistance$$1;
        } else {
          return minSquaredDistance;
        }
      };

      /**
       * Return the coordinate of the point.
       * @return {module:ol/coordinate~Coordinate} Coordinates.
       * @override
       * @api
       */
      Point.prototype.getCoordinates = function getCoordinates () {
        return !this.flatCoordinates ? [] : this.flatCoordinates.slice();
      };

      /**
       * @inheritDoc
       */
      Point.prototype.computeExtent = function computeExtent (extent) {
        return createOrUpdateFromCoordinate(this.flatCoordinates, extent);
      };

      /**
       * @inheritDoc
       * @api
       */
      Point.prototype.getType = function getType () {
        return GeometryType.POINT;
      };

      /**
       * @inheritDoc
       * @api
       */
      Point.prototype.intersectsExtent = function intersectsExtent (extent) {
        return containsXY(extent, this.flatCoordinates[0], this.flatCoordinates[1]);
      };

      /**
       * @inheritDoc
       * @api
       */
      Point.prototype.setCoordinates = function setCoordinates (coordinates, opt_layout) {
        this.setLayout(opt_layout, coordinates, 0);
        if (!this.flatCoordinates) {
          this.flatCoordinates = [];
        }
        this.flatCoordinates.length = deflateCoordinate(
          this.flatCoordinates, 0, coordinates, this.stride);
        this.changed();
      };

      return Point;
    }(SimpleGeometry));

    /**
     * @module ol/color
     */


    /**
     * A color represented as a short array [red, green, blue, alpha].
     * red, green, and blue should be integers in the range 0..255 inclusive.
     * alpha should be a float in the range 0..1 inclusive. If no alpha value is
     * given then `1` will be used.
     * @typedef {Array.<number>} Color
     * @api
     */


    /**
     * This RegExp matches # followed by 3, 4, 6, or 8 hex digits.
     * @const
     * @type {RegExp}
     * @private
     */
    var HEX_COLOR_RE_ = /^#([a-f0-9]{3}|[a-f0-9]{4}(?:[a-f0-9]{2}){0,2})$/i;


    /**
     * Regular expression for matching potential named color style strings.
     * @const
     * @type {RegExp}
     * @private
     */
    var NAMED_COLOR_RE_ = /^([a-z]*)$/i;


    /**
     * Return the color as an rgba string.
     * @param {module:ol/color~Color|string} color Color.
     * @return {string} Rgba string.
     * @api
     */
    function asString(color) {
      if (typeof color === 'string') {
        return color;
      } else {
        return toString(color);
      }
    }

    /**
     * Return named color as an rgba string.
     * @param {string} color Named color.
     * @return {string} Rgb string.
     */
    function fromNamed(color) {
      var el = document.createElement('div');
      el.style.color = color;
      if (el.style.color !== '') {
        document.body.appendChild(el);
        var rgb = getComputedStyle(el).color;
        document.body.removeChild(el);
        return rgb;
      } else {
        return '';
      }
    }


    /**
     * @param {string} s String.
     * @return {module:ol/color~Color} Color.
     */
    var fromString = (
      function() {

        // We maintain a small cache of parsed strings.  To provide cheap LRU-like
        // semantics, whenever the cache grows too large we simply delete an
        // arbitrary 25% of the entries.

        /**
         * @const
         * @type {number}
         */
        var MAX_CACHE_SIZE = 1024;

        /**
         * @type {Object.<string, module:ol/color~Color>}
         */
        var cache = {};

        /**
         * @type {number}
         */
        var cacheSize = 0;

        return (
          /**
           * @param {string} s String.
           * @return {module:ol/color~Color} Color.
           */
          function(s) {
            var color;
            if (cache.hasOwnProperty(s)) {
              color = cache[s];
            } else {
              if (cacheSize >= MAX_CACHE_SIZE) {
                var i = 0;
                for (var key in cache) {
                  if ((i++ & 3) === 0) {
                    delete cache[key];
                    --cacheSize;
                  }
                }
              }
              color = fromStringInternal_(s);
              cache[s] = color;
              ++cacheSize;
            }
            return color;
          }
        );

      })();

    /**
     * Return the color as an array. This function maintains a cache of calculated
     * arrays which means the result should not be modified.
     * @param {module:ol/color~Color|string} color Color.
     * @return {module:ol/color~Color} Color.
     * @api
     */
    function asArray(color) {
      if (Array.isArray(color)) {
        return color;
      } else {
        return fromString(/** @type {string} */ (color));
      }
    }

    /**
     * @param {string} s String.
     * @private
     * @return {module:ol/color~Color} Color.
     */
    function fromStringInternal_(s) {
      var r, g, b, a, color;

      if (NAMED_COLOR_RE_.exec(s)) {
        s = fromNamed(s);
      }

      if (HEX_COLOR_RE_.exec(s)) { // hex
        var n = s.length - 1; // number of hex digits
        var d; // number of digits per channel
        if (n <= 4) {
          d = 1;
        } else {
          d = 2;
        }
        var hasAlpha = n === 4 || n === 8;
        r = parseInt(s.substr(1 + 0 * d, d), 16);
        g = parseInt(s.substr(1 + 1 * d, d), 16);
        b = parseInt(s.substr(1 + 2 * d, d), 16);
        if (hasAlpha) {
          a = parseInt(s.substr(1 + 3 * d, d), 16);
        } else {
          a = 255;
        }
        if (d == 1) {
          r = (r << 4) + r;
          g = (g << 4) + g;
          b = (b << 4) + b;
          if (hasAlpha) {
            a = (a << 4) + a;
          }
        }
        color = [r, g, b, a / 255];
      } else if (s.indexOf('rgba(') == 0) { // rgba()
        color = s.slice(5, -1).split(',').map(Number);
        normalize(color);
      } else if (s.indexOf('rgb(') == 0) { // rgb()
        color = s.slice(4, -1).split(',').map(Number);
        color.push(1);
        normalize(color);
      } else {
        assert(false, 14); // Invalid color
      }
      return (
        /** @type {module:ol/color~Color} */ (color)
      );
    }


    /**
     * TODO this function is only used in the test, we probably shouldn't export it
     * @param {module:ol/color~Color} color Color.
     * @return {module:ol/color~Color} Clamped color.
     */
    function normalize(color) {
      color[0] = clamp((color[0] + 0.5) | 0, 0, 255);
      color[1] = clamp((color[1] + 0.5) | 0, 0, 255);
      color[2] = clamp((color[2] + 0.5) | 0, 0, 255);
      color[3] = clamp(color[3], 0, 1);
      return color;
    }


    /**
     * @param {module:ol/color~Color} color Color.
     * @return {string} String.
     */
    function toString(color) {
      var r = color[0];
      if (r != (r | 0)) {
        r = (r + 0.5) | 0;
      }
      var g = color[1];
      if (g != (g | 0)) {
        g = (g + 0.5) | 0;
      }
      var b = color[2];
      if (b != (b | 0)) {
        b = (b + 0.5) | 0;
      }
      var a = color[3] === undefined ? 1 : color[3];
      return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }

    /**
     * @module ol/colorlike
     */


    /**
     * A type accepted by CanvasRenderingContext2D.fillStyle
     * or CanvasRenderingContext2D.strokeStyle.
     * Represents a color, pattern, or gradient. The origin for patterns and
     * gradients as fill style is an increment of 512 css pixels from map coordinate
     * `[0, 0]`. For seamless repeat patterns, width and height of the pattern image
     * must be a factor of two (2, 4, 8, ..., 512).
     *
     * @typedef {string|CanvasPattern|CanvasGradient} ColorLike
     * @api
     */


    /**
     * @param {module:ol/color~Color|module:ol/colorlike~ColorLike} color Color.
     * @return {module:ol/colorlike~ColorLike} The color as an {@link ol/colorlike~ColorLike}.
     * @api
     */
    function asColorLike(color) {
      if (isColorLike(color)) {
        return /** @type {string|CanvasPattern|CanvasGradient} */ (color);
      } else {
        return toString(/** @type {module:ol/color~Color} */ (color));
      }
    }


    /**
     * @param {?} color The value that is potentially an {@link ol/colorlike~ColorLike}.
     * @return {boolean} The color is an {@link ol/colorlike~ColorLike}.
     */
    function isColorLike(color) {
      return (
        typeof color === 'string' ||
        color instanceof CanvasPattern ||
        color instanceof CanvasGradient
      );
    }

    /**
     * @module ol/dom
     */


    /**
     * Create an html canvas element and returns its 2d context.
     * @param {number=} opt_width Canvas width.
     * @param {number=} opt_height Canvas height.
     * @return {CanvasRenderingContext2D} The context.
     */
    function createCanvasContext2D(opt_width, opt_height) {
      var canvas = /** @type {HTMLCanvasElement} */ (document.createElement('CANVAS'));
      if (opt_width) {
        canvas.width = opt_width;
      }
      if (opt_height) {
        canvas.height = opt_height;
      }
      return /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
    }

    /**
     * @module ol/webgl
     */


    /** end of goog.webgl constants
     */


    /**
     * @const
     * @type {Array.<string>}
     */
    var CONTEXT_IDS = [
      'experimental-webgl',
      'webgl',
      'webkit-3d',
      'moz-webgl'
    ];


    /**
     * @param {HTMLCanvasElement} canvas Canvas.
     * @param {Object=} opt_attributes Attributes.
     * @return {WebGLRenderingContext} WebGL rendering context.
     */
    function getContext(canvas, opt_attributes) {
      var ii = CONTEXT_IDS.length;
      for (var i = 0; i < ii; ++i) {
        try {
          var context = canvas.getContext(CONTEXT_IDS[i], opt_attributes);
          if (context) {
            return /** @type {!WebGLRenderingContext} */ (context);
          }
        } catch (e) {
          // pass
        }
      }
      return null;
    }


    /**
     * The maximum supported WebGL texture size in pixels. If WebGL is not
     * supported, the value is set to `undefined`.
     * @type {number|undefined}
     */
    var MAX_TEXTURE_SIZE; // value is set below


    /**
     * List of supported WebGL extensions.
     * @type {Array.<string>}
     */
    var EXTENSIONS; // value is set below

    //TODO Remove side effects
    if (typeof window !== 'undefined' && 'WebGLRenderingContext' in window) {
      try {
        var canvas = /** @type {HTMLCanvasElement} */ (document.createElement('CANVAS'));
        var gl = getContext(canvas, {failIfMajorPerformanceCaveat: true});
        if (gl) {
          MAX_TEXTURE_SIZE = /** @type {number} */ (gl.getParameter(gl.MAX_TEXTURE_SIZE));
          EXTENSIONS = gl.getSupportedExtensions();
        }
      } catch (e) {
        // pass
      }
    }

    /**
     * @module ol/has
     */

    var ua = typeof navigator !== 'undefined' ?
      navigator.userAgent.toLowerCase() : '';

    /**
     * User agent string says we are dealing with Firefox as browser.
     * @type {boolean}
     */
    var FIREFOX = ua.indexOf('firefox') !== -1;

    /**
     * User agent string says we are dealing with Safari as browser.
     * @type {boolean}
     */
    var SAFARI = ua.indexOf('safari') !== -1 && ua.indexOf('chrom') == -1;

    /**
     * User agent string says we are dealing with a WebKit engine.
     * @type {boolean}
     */
    var WEBKIT = ua.indexOf('webkit') !== -1 && ua.indexOf('edge') == -1;

    /**
     * User agent string says we are dealing with a Mac as platform.
     * @type {boolean}
     */
    var MAC = ua.indexOf('macintosh') !== -1;


    /**
     * The ratio between physical pixels and device-independent pixels
     * (dips) on the device (`window.devicePixelRatio`).
     * @const
     * @type {number}
     * @api
     */
    var DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;


    /**
     * True if the browser's Canvas implementation implements {get,set}LineDash.
     * @type {boolean}
     */
    var CANVAS_LINE_DASH = function() {
      var has = false;
      try {
        has = !!document.createElement('CANVAS').getContext('2d').setLineDash;
      } catch (e) {
        // pass
      }
      return has;
    }();


    /**
     * True if browser supports ms pointer events (IE 10).
     * @const
     * @type {boolean}
     */
    var MSPOINTER = !!(navigator.msPointerEnabled);

    /**
     * @module ol/ImageState
     */

    /**
     * @enum {number}
     */
    var ImageState = {
      IDLE: 0,
      LOADING: 1,
      LOADED: 2,
      ERROR: 3
    };

    /**
     * @module ol/css
     */

    /**
     * @module ol/structs/LRUCache
     */


    /**
     * @typedef {Object} Entry
     * @property {string} key_
     * @property {Object} newer
     * @property {Object} older
     * @property {*} value_
     */


    /**
     * @classdesc
     * Implements a Least-Recently-Used cache where the keys do not conflict with
     * Object's properties (e.g. 'hasOwnProperty' is not allowed as a key). Expiring
     * items from the cache is the responsibility of the user.
     *
     * @fires module:ol/events/Event~Event
     * @template T
     */
    var LRUCache = (function (EventTarget$$1) {
      function LRUCache(opt_highWaterMark) {

        EventTarget$$1.call(this);

        /**
         * @type {number}
         */
        this.highWaterMark = opt_highWaterMark !== undefined ? opt_highWaterMark : 2048;

        /**
         * @private
         * @type {number}
         */
        this.count_ = 0;

        /**
         * @private
         * @type {!Object.<string, module:ol/structs/LRUCache~Entry>}
         */
        this.entries_ = {};

        /**
         * @private
         * @type {?module:ol/structs/LRUCache~Entry}
         */
        this.oldest_ = null;

        /**
         * @private
         * @type {?module:ol/structs/LRUCache~Entry}
         */
        this.newest_ = null;

      }

      if ( EventTarget$$1 ) LRUCache.__proto__ = EventTarget$$1;
      LRUCache.prototype = Object.create( EventTarget$$1 && EventTarget$$1.prototype );
      LRUCache.prototype.constructor = LRUCache;


      /**
       * @return {boolean} Can expire cache.
       */
      LRUCache.prototype.canExpireCache = function canExpireCache () {
        return this.getCount() > this.highWaterMark;
      };


      /**
       * FIXME empty description for jsdoc
       */
      LRUCache.prototype.clear = function clear () {
        this.count_ = 0;
        this.entries_ = {};
        this.oldest_ = null;
        this.newest_ = null;
        this.dispatchEvent(EventType.CLEAR);
      };


      /**
       * @param {string} key Key.
       * @return {boolean} Contains key.
       */
      LRUCache.prototype.containsKey = function containsKey (key) {
        return this.entries_.hasOwnProperty(key);
      };


      /**
       * @param {function(this: S, T, string, module:ol/structs/LRUCache): ?} f The function
       *     to call for every entry from the oldest to the newer. This function takes
       *     3 arguments (the entry value, the entry key and the LRUCache object).
       *     The return value is ignored.
       * @param {S=} opt_this The object to use as `this` in `f`.
       * @template S
       */
      LRUCache.prototype.forEach = function forEach (f, opt_this) {
        var this$1 = this;

        var entry = this.oldest_;
        while (entry) {
          f.call(opt_this, entry.value_, entry.key_, this$1);
          entry = entry.newer;
        }
      };


      /**
       * @param {string} key Key.
       * @return {T} Value.
       */
      LRUCache.prototype.get = function get (key) {
        var entry = this.entries_[key];
        assert(entry !== undefined,
          15); // Tried to get a value for a key that does not exist in the cache
        if (entry === this.newest_) {
          return entry.value_;
        } else if (entry === this.oldest_) {
          this.oldest_ = /** @type {module:ol/structs/LRUCache~Entry} */ (this.oldest_.newer);
          this.oldest_.older = null;
        } else {
          entry.newer.older = entry.older;
          entry.older.newer = entry.newer;
        }
        entry.newer = null;
        entry.older = this.newest_;
        this.newest_.newer = entry;
        this.newest_ = entry;
        return entry.value_;
      };


      /**
       * Remove an entry from the cache.
       * @param {string} key The entry key.
       * @return {T} The removed entry.
       */
      LRUCache.prototype.remove = function remove (key) {
        var entry = this.entries_[key];
        assert(entry !== undefined, 15); // Tried to get a value for a key that does not exist in the cache
        if (entry === this.newest_) {
          this.newest_ = /** @type {module:ol/structs/LRUCache~Entry} */ (entry.older);
          if (this.newest_) {
            this.newest_.newer = null;
          }
        } else if (entry === this.oldest_) {
          this.oldest_ = /** @type {module:ol/structs/LRUCache~Entry} */ (entry.newer);
          if (this.oldest_) {
            this.oldest_.older = null;
          }
        } else {
          entry.newer.older = entry.older;
          entry.older.newer = entry.newer;
        }
        delete this.entries_[key];
        --this.count_;
        return entry.value_;
      };


      /**
       * @return {number} Count.
       */
      LRUCache.prototype.getCount = function getCount () {
        return this.count_;
      };


      /**
       * @return {Array.<string>} Keys.
       */
      LRUCache.prototype.getKeys = function getKeys () {
        var keys = new Array(this.count_);
        var i = 0;
        var entry;
        for (entry = this.newest_; entry; entry = entry.older) {
          keys[i++] = entry.key_;
        }
        return keys;
      };


      /**
       * @return {Array.<T>} Values.
       */
      LRUCache.prototype.getValues = function getValues () {
        var values = new Array(this.count_);
        var i = 0;
        var entry;
        for (entry = this.newest_; entry; entry = entry.older) {
          values[i++] = entry.value_;
        }
        return values;
      };


      /**
       * @return {T} Last value.
       */
      LRUCache.prototype.peekLast = function peekLast () {
        return this.oldest_.value_;
      };


      /**
       * @return {string} Last key.
       */
      LRUCache.prototype.peekLastKey = function peekLastKey () {
        return this.oldest_.key_;
      };


      /**
       * Get the key of the newest item in the cache.  Throws if the cache is empty.
       * @return {string} The newest key.
       */
      LRUCache.prototype.peekFirstKey = function peekFirstKey () {
        return this.newest_.key_;
      };


      /**
       * @return {T} value Value.
       */
      LRUCache.prototype.pop = function pop () {
        var entry = this.oldest_;
        delete this.entries_[entry.key_];
        if (entry.newer) {
          entry.newer.older = null;
        }
        this.oldest_ = /** @type {module:ol/structs/LRUCache~Entry} */ (entry.newer);
        if (!this.oldest_) {
          this.newest_ = null;
        }
        --this.count_;
        return entry.value_;
      };


      /**
       * @param {string} key Key.
       * @param {T} value Value.
       */
      LRUCache.prototype.replace = function replace (key, value) {
        this.get(key); // update `newest_`
        this.entries_[key].value_ = value;
      };


      /**
       * @param {string} key Key.
       * @param {T} value Value.
       */
      LRUCache.prototype.set = function set (key, value) {
        assert(!(key in this.entries_),
          16); // Tried to set a value for a key that is used already
        var entry = /** @type {module:ol/structs/LRUCache~Entry} */ ({
          key_: key,
          newer: null,
          older: this.newest_,
          value_: value
        });
        if (!this.newest_) {
          this.oldest_ = entry;
        } else {
          this.newest_.newer = entry;
        }
        this.newest_ = entry;
        this.entries_[key] = entry;
        ++this.count_;
      };


      /**
       * Set a maximum number of entries for the cache.
       * @param {number} size Cache size.
       * @api
       */
      LRUCache.prototype.setSize = function setSize (size) {
        this.highWaterMark = size;
      };


      /**
       * Prune the cache.
       */
      LRUCache.prototype.prune = function prune () {
        var this$1 = this;

        while (this.canExpireCache()) {
          this$1.pop();
        }
      };

      return LRUCache;
    }(EventTarget));

    /**
     * @module ol/render/canvas
     */


    /**
     * @const
     * @type {module:ol/color~Color}
     */
    var defaultFillStyle = [0, 0, 0, 1];


    /**
     * @const
     * @type {string}
     */
    var defaultLineCap = 'round';


    /**
     * @const
     * @type {string}
     */
    var defaultLineJoin = 'round';


    /**
     * @const
     * @type {number}
     */
    var defaultMiterLimit = 10;


    /**
     * @const
     * @type {module:ol/color~Color}
     */
    var defaultStrokeStyle = [0, 0, 0, 1];


    /**
     * @const
     * @type {number}
     */
    var defaultLineWidth = 1;


    /**
     * The label cache for text rendering. To change the default cache size of 2048
     * entries, use {@link module:ol/structs/LRUCache#setSize}.
     * @type {module:ol/structs/LRUCache.<HTMLCanvasElement>}
     * @api
     */
    var labelCache = new LRUCache();

    /**
     * @module ol/style/Image
     */


    /**
     * @typedef {Object} Options
     * @property {number} opacity
     * @property {boolean} rotateWithView
     * @property {number} rotation
     * @property {number} scale
     * @property {boolean} snapToPixel
     */


    /**
     * @classdesc
     * A base class used for creating subclasses and not instantiated in
     * apps. Base class for {@link module:ol/style/Icon~Icon}, {@link module:ol/style/Circle~CircleStyle} and
     * {@link module:ol/style/RegularShape~RegularShape}.
     * @api
     */
    var ImageStyle = function ImageStyle(options) {

      /**
      * @private
      * @type {number}
      */
      this.opacity_ = options.opacity;

      /**
      * @private
      * @type {boolean}
      */
      this.rotateWithView_ = options.rotateWithView;

      /**
      * @private
      * @type {number}
      */
      this.rotation_ = options.rotation;

      /**
      * @private
      * @type {number}
      */
      this.scale_ = options.scale;

      /**
      * @private
      * @type {boolean}
      */
      this.snapToPixel_ = options.snapToPixel;

    };

    /**
    * Get the symbolizer opacity.
    * @return {number} Opacity.
    * @api
    */
    ImageStyle.prototype.getOpacity = function getOpacity () {
      return this.opacity_;
    };

    /**
    * Determine whether the symbolizer rotates with the map.
    * @return {boolean} Rotate with map.
    * @api
    */
    ImageStyle.prototype.getRotateWithView = function getRotateWithView () {
      return this.rotateWithView_;
    };

    /**
    * Get the symoblizer rotation.
    * @return {number} Rotation.
    * @api
    */
    ImageStyle.prototype.getRotation = function getRotation () {
      return this.rotation_;
    };

    /**
    * Get the symbolizer scale.
    * @return {number} Scale.
    * @api
    */
    ImageStyle.prototype.getScale = function getScale () {
      return this.scale_;
    };

    /**
    * Determine whether the symbolizer should be snapped to a pixel.
    * @return {boolean} The symbolizer should snap to a pixel.
    * @api
    */
    ImageStyle.prototype.getSnapToPixel = function getSnapToPixel () {
      return this.snapToPixel_;
    };

    /**
    * Get the anchor point in pixels. The anchor determines the center point for the
    * symbolizer.
    * @abstract
    * @return {Array.<number>} Anchor.
    */
    ImageStyle.prototype.getAnchor = function getAnchor () {};

    /**
    * Get the image element for the symbolizer.
    * @abstract
    * @param {number} pixelRatio Pixel ratio.
    * @return {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} Image element.
    */
    ImageStyle.prototype.getImage = function getImage (pixelRatio) {};

    /**
    * @abstract
    * @param {number} pixelRatio Pixel ratio.
    * @return {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} Image element.
    */
    ImageStyle.prototype.getHitDetectionImage = function getHitDetectionImage (pixelRatio) {};

    /**
    * @abstract
    * @return {module:ol/ImageState} Image state.
    */
    ImageStyle.prototype.getImageState = function getImageState () {};

    /**
    * @abstract
    * @return {module:ol/size~Size} Image size.
    */
    ImageStyle.prototype.getImageSize = function getImageSize () {};

    /**
    * @abstract
    * @return {module:ol/size~Size} Size of the hit-detection image.
    */
    ImageStyle.prototype.getHitDetectionImageSize = function getHitDetectionImageSize () {};

    /**
    * Get the origin of the symbolizer.
    * @abstract
    * @return {Array.<number>} Origin.
    */
    ImageStyle.prototype.getOrigin = function getOrigin () {};

    /**
    * Get the size of the symbolizer (in pixels).
    * @abstract
    * @return {module:ol/size~Size} Size.
    */
    ImageStyle.prototype.getSize = function getSize () {};

    /**
    * Set the opacity.
    *
    * @param {number} opacity Opacity.
    * @api
    */
    ImageStyle.prototype.setOpacity = function setOpacity (opacity) {
      this.opacity_ = opacity;
    };

    /**
    * Set whether to rotate the style with the view.
    *
    * @param {boolean} rotateWithView Rotate with map.
    * @api
    */
    ImageStyle.prototype.setRotateWithView = function setRotateWithView (rotateWithView) {
      this.rotateWithView_ = rotateWithView;
    };

    /**
    * Set the rotation.
    *
    * @param {number} rotation Rotation.
    * @api
    */
    ImageStyle.prototype.setRotation = function setRotation (rotation) {
      this.rotation_ = rotation;
    };

    /**
    * Set the scale.
    *
    * @param {number} scale Scale.
    * @api
    */
    ImageStyle.prototype.setScale = function setScale (scale) {
      this.scale_ = scale;
    };

    /**
    * Set whether to snap the image to the closest pixel.
    *
    * @param {boolean} snapToPixel Snap to pixel?
    * @api
    */
    ImageStyle.prototype.setSnapToPixel = function setSnapToPixel (snapToPixel) {
      this.snapToPixel_ = snapToPixel;
    };

    /**
    * @abstract
    * @param {function(this: T, module:ol/events/Event)} listener Listener function.
    * @param {T} thisArg Value to use as `this` when executing `listener`.
    * @return {module:ol/events~EventsKey|undefined} Listener key.
    * @template T
    */
    ImageStyle.prototype.listenImageChange = function listenImageChange (listener, thisArg) {};

    /**
    * Load not yet loaded URI.
    * @abstract
    */
    ImageStyle.prototype.load = function load () {};

    /**
    * @abstract
    * @param {function(this: T, module:ol/events/Event)} listener Listener function.
    * @param {T} thisArg Value to use as `this` when executing `listener`.
    * @template T
    */
    ImageStyle.prototype.unlistenImageChange = function unlistenImageChange (listener, thisArg) {};

    /**
     * @module ol/style/RegularShape
     */


    /**
     * Specify radius for regular polygons, or radius1 and radius2 for stars.
     * @typedef {Object} Options
     * @property {module:ol/style/Fill} [fill] Fill style.
     * @property {number} points Number of points for stars and regular polygons. In case of a polygon, the number of points
     * is the number of sides.
     * @property {number} [radius] Radius of a regular polygon.
     * @property {number} [radius1] Outer radius of a star.
     * @property {number} [radius2] Inner radius of a star.
     * @property {number} [angle=0] Shape's angle in radians. A value of 0 will have one of the shape's point facing up.
     * @property {boolean} [snapToPixel=true] If `true` integral numbers of pixels are used as the X and Y pixel coordinate
     * when drawing the shape in the output canvas. If `false` fractional numbers may be used. Using `true` allows for
     * "sharp" rendering (no blur), while using `false` allows for "accurate" rendering. Note that accuracy is important if
     * the shape's position is animated. Without it, the shape may jitter noticeably.
     * @property {module:ol/style/Stroke} [stroke] Stroke style.
     * @property {number} [rotation=0] Rotation in radians (positive rotation clockwise).
     * @property {boolean} [rotateWithView=false] Whether to rotate the shape with the view.
     * @property {module:ol/style/AtlasManager} [atlasManager] The atlas manager to use for this symbol. When
     * using WebGL it is recommended to use an atlas manager to avoid texture switching. If an atlas manager is given, the
     * symbol is added to an atlas. By default no atlas manager is used.
     */


    /**
     * @typedef {Object} RenderOptions
     * @property {module:ol/colorlike~ColorLike} [strokeStyle]
     * @property {number} strokeWidth
     * @property {number} size
     * @property {string} lineCap
     * @property {Array.<number>} lineDash
     * @property {number} lineDashOffset
     * @property {string} lineJoin
     * @property {number} miterLimit
     */


    /**
     * @classdesc
     * Set regular shape style for vector features. The resulting shape will be
     * a regular polygon when `radius` is provided, or a star when `radius1` and
     * `radius2` are provided.
     * @api
     */
    var RegularShape = (function (ImageStyle$$1) {
      function RegularShape(options) {
        /**
         * @type {boolean}
         */
        var snapToPixel = options.snapToPixel !== undefined ?
          options.snapToPixel : true;

        /**
         * @type {boolean}
         */
        var rotateWithView = options.rotateWithView !== undefined ?
          options.rotateWithView : false;

        ImageStyle$$1.call(this, {
          opacity: 1,
          rotateWithView: rotateWithView,
          rotation: options.rotation !== undefined ? options.rotation : 0,
          scale: 1,
          snapToPixel: snapToPixel
        });

        /**
         * @private
         * @type {Array.<string>}
         */
        this.checksums_ = null;

        /**
         * @private
         * @type {HTMLCanvasElement}
         */
        this.canvas_ = null;

        /**
         * @private
         * @type {HTMLCanvasElement}
         */
        this.hitDetectionCanvas_ = null;

        /**
         * @private
         * @type {module:ol/style/Fill}
         */
        this.fill_ = options.fill !== undefined ? options.fill : null;

        /**
         * @private
         * @type {Array.<number>}
         */
        this.origin_ = [0, 0];

        /**
         * @private
         * @type {number}
         */
        this.points_ = options.points;

        /**
         * @protected
         * @type {number}
         */
        this.radius_ = /** @type {number} */ (options.radius !== undefined ?
          options.radius : options.radius1);

        /**
         * @private
         * @type {number|undefined}
         */
        this.radius2_ = options.radius2;

        /**
         * @private
         * @type {number}
         */
        this.angle_ = options.angle !== undefined ? options.angle : 0;

        /**
         * @private
         * @type {module:ol/style/Stroke}
         */
        this.stroke_ = options.stroke !== undefined ? options.stroke : null;

        /**
         * @private
         * @type {Array.<number>}
         */
        this.anchor_ = null;

        /**
         * @private
         * @type {module:ol/size~Size}
         */
        this.size_ = null;

        /**
         * @private
         * @type {module:ol/size~Size}
         */
        this.imageSize_ = null;

        /**
         * @private
         * @type {module:ol/size~Size}
         */
        this.hitDetectionImageSize_ = null;

        /**
         * @protected
         * @type {module:ol/style/AtlasManager|undefined}
         */
        this.atlasManager_ = options.atlasManager;

        this.render_(this.atlasManager_);

      }

      if ( ImageStyle$$1 ) RegularShape.__proto__ = ImageStyle$$1;
      RegularShape.prototype = Object.create( ImageStyle$$1 && ImageStyle$$1.prototype );
      RegularShape.prototype.constructor = RegularShape;

      /**
       * Clones the style. If an atlasmanager was provided to the original style it will be used in the cloned style, too.
       * @return {module:ol/style/RegularShape} The cloned style.
       * @api
       */
      RegularShape.prototype.clone = function clone () {
        var style = new RegularShape({
          fill: this.getFill() ? this.getFill().clone() : undefined,
          points: this.getPoints(),
          radius: this.getRadius(),
          radius2: this.getRadius2(),
          angle: this.getAngle(),
          snapToPixel: this.getSnapToPixel(),
          stroke: this.getStroke() ? this.getStroke().clone() : undefined,
          rotation: this.getRotation(),
          rotateWithView: this.getRotateWithView(),
          atlasManager: this.atlasManager_
        });
        style.setOpacity(this.getOpacity());
        style.setScale(this.getScale());
        return style;
      };

      /**
       * @inheritDoc
       * @api
       */
      RegularShape.prototype.getAnchor = function getAnchor () {
        return this.anchor_;
      };

      /**
       * Get the angle used in generating the shape.
       * @return {number} Shape's rotation in radians.
       * @api
       */
      RegularShape.prototype.getAngle = function getAngle () {
        return this.angle_;
      };

      /**
       * Get the fill style for the shape.
       * @return {module:ol/style/Fill} Fill style.
       * @api
       */
      RegularShape.prototype.getFill = function getFill () {
        return this.fill_;
      };

      /**
       * @inheritDoc
       */
      RegularShape.prototype.getHitDetectionImage = function getHitDetectionImage (pixelRatio) {
        return this.hitDetectionCanvas_;
      };

      /**
       * @inheritDoc
       * @api
       */
      RegularShape.prototype.getImage = function getImage (pixelRatio) {
        return this.canvas_;
      };

      /**
       * @inheritDoc
       */
      RegularShape.prototype.getImageSize = function getImageSize () {
        return this.imageSize_;
      };

      /**
       * @inheritDoc
       */
      RegularShape.prototype.getHitDetectionImageSize = function getHitDetectionImageSize () {
        return this.hitDetectionImageSize_;
      };

      /**
       * @inheritDoc
       */
      RegularShape.prototype.getImageState = function getImageState () {
        return ImageState.LOADED;
      };

      /**
       * @inheritDoc
       * @api
       */
      RegularShape.prototype.getOrigin = function getOrigin () {
        return this.origin_;
      };

      /**
       * Get the number of points for generating the shape.
       * @return {number} Number of points for stars and regular polygons.
       * @api
       */
      RegularShape.prototype.getPoints = function getPoints () {
        return this.points_;
      };

      /**
       * Get the (primary) radius for the shape.
       * @return {number} Radius.
       * @api
       */
      RegularShape.prototype.getRadius = function getRadius () {
        return this.radius_;
      };

      /**
       * Get the secondary radius for the shape.
       * @return {number|undefined} Radius2.
       * @api
       */
      RegularShape.prototype.getRadius2 = function getRadius2 () {
        return this.radius2_;
      };

      /**
       * @inheritDoc
       * @api
       */
      RegularShape.prototype.getSize = function getSize () {
        return this.size_;
      };

      /**
       * Get the stroke style for the shape.
       * @return {module:ol/style/Stroke} Stroke style.
       * @api
       */
      RegularShape.prototype.getStroke = function getStroke () {
        return this.stroke_;
      };

      /**
       * @inheritDoc
       */
      RegularShape.prototype.listenImageChange = function listenImageChange (listener, thisArg) {};

      /**
       * @inheritDoc
       */
      RegularShape.prototype.load = function load () {};

      /**
       * @inheritDoc
       */
      RegularShape.prototype.unlistenImageChange = function unlistenImageChange (listener, thisArg) {};

      /**
       * @protected
       * @param {module:ol/style/AtlasManager|undefined} atlasManager An atlas manager.
       */
      RegularShape.prototype.render_ = function render_ (atlasManager) {
        var imageSize;
        var lineCap = '';
        var lineJoin = '';
        var miterLimit = 0;
        var lineDash = null;
        var lineDashOffset = 0;
        var strokeStyle;
        var strokeWidth = 0;

        if (this.stroke_) {
          strokeStyle = this.stroke_.getColor();
          if (strokeStyle === null) {
            strokeStyle = defaultStrokeStyle;
          }
          strokeStyle = asColorLike(strokeStyle);
          strokeWidth = this.stroke_.getWidth();
          if (strokeWidth === undefined) {
            strokeWidth = defaultLineWidth;
          }
          lineDash = this.stroke_.getLineDash();
          lineDashOffset = this.stroke_.getLineDashOffset();
          if (!CANVAS_LINE_DASH) {
            lineDash = null;
            lineDashOffset = 0;
          }
          lineJoin = this.stroke_.getLineJoin();
          if (lineJoin === undefined) {
            lineJoin = defaultLineJoin;
          }
          lineCap = this.stroke_.getLineCap();
          if (lineCap === undefined) {
            lineCap = defaultLineCap;
          }
          miterLimit = this.stroke_.getMiterLimit();
          if (miterLimit === undefined) {
            miterLimit = defaultMiterLimit;
          }
        }

        var size = 2 * (this.radius_ + strokeWidth) + 1;

        /** @type {module:ol/style/RegularShape~RenderOptions} */
        var renderOptions = {
          strokeStyle: strokeStyle,
          strokeWidth: strokeWidth,
          size: size,
          lineCap: lineCap,
          lineDash: lineDash,
          lineDashOffset: lineDashOffset,
          lineJoin: lineJoin,
          miterLimit: miterLimit
        };

        if (atlasManager === undefined) {
          // no atlas manager is used, create a new canvas
          var context = createCanvasContext2D(size, size);
          this.canvas_ = context.canvas;

          // canvas.width and height are rounded to the closest integer
          size = this.canvas_.width;
          imageSize = size;

          this.draw_(renderOptions, context, 0, 0);

          this.createHitDetectionCanvas_(renderOptions);
        } else {
          // an atlas manager is used, add the symbol to an atlas
          size = Math.round(size);

          var hasCustomHitDetectionImage = !this.fill_;
          var renderHitDetectionCallback;
          if (hasCustomHitDetectionImage) {
            // render the hit-detection image into a separate atlas image
            renderHitDetectionCallback =
                this.drawHitDetectionCanvas_.bind(this, renderOptions);
          }

          var id = this.getChecksum();
          var info = atlasManager.add(
            id, size, size, this.draw_.bind(this, renderOptions),
            renderHitDetectionCallback);

          this.canvas_ = info.image;
          this.origin_ = [info.offsetX, info.offsetY];
          imageSize = info.image.width;

          if (hasCustomHitDetectionImage) {
            this.hitDetectionCanvas_ = info.hitImage;
            this.hitDetectionImageSize_ =
                [info.hitImage.width, info.hitImage.height];
          } else {
            this.hitDetectionCanvas_ = this.canvas_;
            this.hitDetectionImageSize_ = [imageSize, imageSize];
          }
        }

        this.anchor_ = [size / 2, size / 2];
        this.size_ = [size, size];
        this.imageSize_ = [imageSize, imageSize];
      };

      /**
       * @private
       * @param {module:ol/style/RegularShape~RenderOptions} renderOptions Render options.
       * @param {CanvasRenderingContext2D} context The rendering context.
       * @param {number} x The origin for the symbol (x).
       * @param {number} y The origin for the symbol (y).
       */
      RegularShape.prototype.draw_ = function draw_ (renderOptions, context, x, y) {
        var this$1 = this;

        var i, angle0, radiusC;
        // reset transform
        context.setTransform(1, 0, 0, 1, 0, 0);

        // then move to (x, y)
        context.translate(x, y);

        context.beginPath();

        var points = this.points_;
        if (points === Infinity) {
          context.arc(
            renderOptions.size / 2, renderOptions.size / 2,
            this.radius_, 0, 2 * Math.PI, true);
        } else {
          var radius2 = (this.radius2_ !== undefined) ? this.radius2_
            : this.radius_;
          if (radius2 !== this.radius_) {
            points = 2 * points;
          }
          for (i = 0; i <= points; i++) {
            angle0 = i * 2 * Math.PI / points - Math.PI / 2 + this$1.angle_;
            radiusC = i % 2 === 0 ? this$1.radius_ : radius2;
            context.lineTo(renderOptions.size / 2 + radiusC * Math.cos(angle0),
              renderOptions.size / 2 + radiusC * Math.sin(angle0));
          }
        }


        if (this.fill_) {
          var color = this.fill_.getColor();
          if (color === null) {
            color = defaultFillStyle;
          }
          context.fillStyle = asColorLike(color);
          context.fill();
        }
        if (this.stroke_) {
          context.strokeStyle = renderOptions.strokeStyle;
          context.lineWidth = renderOptions.strokeWidth;
          if (renderOptions.lineDash) {
            context.setLineDash(renderOptions.lineDash);
            context.lineDashOffset = renderOptions.lineDashOffset;
          }
          context.lineCap = renderOptions.lineCap;
          context.lineJoin = renderOptions.lineJoin;
          context.miterLimit = renderOptions.miterLimit;
          context.stroke();
        }
        context.closePath();
      };

      /**
       * @private
       * @param {module:ol/style/RegularShape~RenderOptions} renderOptions Render options.
       */
      RegularShape.prototype.createHitDetectionCanvas_ = function createHitDetectionCanvas_ (renderOptions) {
        this.hitDetectionImageSize_ = [renderOptions.size, renderOptions.size];
        if (this.fill_) {
          this.hitDetectionCanvas_ = this.canvas_;
          return;
        }

        // if no fill style is set, create an extra hit-detection image with a
        // default fill style
        var context = createCanvasContext2D(renderOptions.size, renderOptions.size);
        this.hitDetectionCanvas_ = context.canvas;

        this.drawHitDetectionCanvas_(renderOptions, context, 0, 0);
      };

      /**
       * @private
       * @param {module:ol/style/RegularShape~RenderOptions} renderOptions Render options.
       * @param {CanvasRenderingContext2D} context The context.
       * @param {number} x The origin for the symbol (x).
       * @param {number} y The origin for the symbol (y).
       */
      RegularShape.prototype.drawHitDetectionCanvas_ = function drawHitDetectionCanvas_ (renderOptions, context, x, y) {
        var this$1 = this;

        // reset transform
        context.setTransform(1, 0, 0, 1, 0, 0);

        // then move to (x, y)
        context.translate(x, y);

        context.beginPath();

        var points = this.points_;
        if (points === Infinity) {
          context.arc(
            renderOptions.size / 2, renderOptions.size / 2,
            this.radius_, 0, 2 * Math.PI, true);
        } else {
          var radius2 = (this.radius2_ !== undefined) ? this.radius2_
            : this.radius_;
          if (radius2 !== this.radius_) {
            points = 2 * points;
          }
          var i, radiusC, angle0;
          for (i = 0; i <= points; i++) {
            angle0 = i * 2 * Math.PI / points - Math.PI / 2 + this$1.angle_;
            radiusC = i % 2 === 0 ? this$1.radius_ : radius2;
            context.lineTo(renderOptions.size / 2 + radiusC * Math.cos(angle0),
              renderOptions.size / 2 + radiusC * Math.sin(angle0));
          }
        }

        context.fillStyle = defaultFillStyle;
        context.fill();
        if (this.stroke_) {
          context.strokeStyle = renderOptions.strokeStyle;
          context.lineWidth = renderOptions.strokeWidth;
          if (renderOptions.lineDash) {
            context.setLineDash(renderOptions.lineDash);
            context.lineDashOffset = renderOptions.lineDashOffset;
          }
          context.stroke();
        }
        context.closePath();
      };

      /**
       * @return {string} The checksum.
       */
      RegularShape.prototype.getChecksum = function getChecksum () {
        var strokeChecksum = this.stroke_ ?
          this.stroke_.getChecksum() : '-';
        var fillChecksum = this.fill_ ?
          this.fill_.getChecksum() : '-';

        var recalculate = !this.checksums_ ||
            (strokeChecksum != this.checksums_[1] ||
            fillChecksum != this.checksums_[2] ||
            this.radius_ != this.checksums_[3] ||
            this.radius2_ != this.checksums_[4] ||
            this.angle_ != this.checksums_[5] ||
            this.points_ != this.checksums_[6]);

        if (recalculate) {
          var checksum = 'r' + strokeChecksum + fillChecksum +
              (this.radius_ !== undefined ? this.radius_.toString() : '-') +
              (this.radius2_ !== undefined ? this.radius2_.toString() : '-') +
              (this.angle_ !== undefined ? this.angle_.toString() : '-') +
              (this.points_ !== undefined ? this.points_.toString() : '-');
          this.checksums_ = [checksum, strokeChecksum, fillChecksum,
            this.radius_, this.radius2_, this.angle_, this.points_];
        }

        return this.checksums_[0];
      };

      return RegularShape;
    }(ImageStyle));

    /**
     * @module ol/style/Circle
     */


    /**
     * @typedef {Object} Options
     * @property {module:ol/style/Fill} [fill] Fill style.
     * @property {number} radius Circle radius.
     * @property {boolean} [snapToPixel=true] If `true` integral numbers of pixels are used as the X and Y pixel coordinate
     * when drawing the circle in the output canvas. If `false` fractional numbers may be used. Using `true` allows for
     * "sharp" rendering (no blur), while using `false` allows for "accurate" rendering. Note that accuracy is important if
     * the circle's position is animated. Without it, the circle may jitter noticeably.
     * @property {module:ol/style/Stroke} [stroke] Stroke style.
     * @property {module:ol/style/AtlasManager} [atlasManager] The atlas manager to use for this circle.
     * When using WebGL it is recommended to use an atlas manager to avoid texture switching. If an atlas manager is given,
     * the circle is added to an atlas. By default no atlas manager is used.
     */


    /**
     * @classdesc
     * Set circle style for vector features.
     * @api
     */
    var CircleStyle = (function (RegularShape$$1) {
      function CircleStyle(opt_options) {

        var options = opt_options || {};

        RegularShape$$1.call(this, {
          points: Infinity,
          fill: options.fill,
          radius: options.radius,
          snapToPixel: options.snapToPixel,
          stroke: options.stroke,
          atlasManager: options.atlasManager
        });

      }

      if ( RegularShape$$1 ) CircleStyle.__proto__ = RegularShape$$1;
      CircleStyle.prototype = Object.create( RegularShape$$1 && RegularShape$$1.prototype );
      CircleStyle.prototype.constructor = CircleStyle;

      /**
      * Clones the style.  If an atlasmanager was provided to the original style it will be used in the cloned style, too.
      * @return {module:ol/style/Circle} The cloned style.
      * @override
      * @api
      */
      CircleStyle.prototype.clone = function clone () {
        var style = new CircleStyle({
          fill: this.getFill() ? this.getFill().clone() : undefined,
          stroke: this.getStroke() ? this.getStroke().clone() : undefined,
          radius: this.getRadius(),
          snapToPixel: this.getSnapToPixel(),
          atlasManager: this.atlasManager_
        });
        style.setOpacity(this.getOpacity());
        style.setScale(this.getScale());
        return style;
      };

      /**
      * Set the circle radius.
      *
      * @param {number} radius Circle radius.
      * @api
      */
      CircleStyle.prototype.setRadius = function setRadius (radius) {
        this.radius_ = radius;
        this.render_(this.atlasManager_);
      };

      return CircleStyle;
    }(RegularShape));

    /**
     * @module ol/style/Fill
     */


    /**
     * @typedef {Object} Options
     * @property {module:ol/color~Color|module:ol/colorlike~ColorLike} [color] A color, gradient or pattern.
     * See {@link module:ol/color~Color} and {@link module:ol/colorlike~ColorLike} for possible formats.
     * Default null; if null, the Canvas/renderer default black will be used.
     */


    /**
     * @classdesc
     * Set fill style for vector features.
     * @api
     */
    var Fill = function Fill(opt_options) {

      var options = opt_options || {};

      /**
       * @private
       * @type {module:ol/color~Color|module:ol/colorlike~ColorLike}
       */
      this.color_ = options.color !== undefined ? options.color : null;

      /**
       * @private
       * @type {string|undefined}
       */
      this.checksum_ = undefined;
    };

    /**
     * Clones the style. The color is not cloned if it is an {@link module:ol/colorlike~ColorLike}.
     * @return {module:ol/style/Fill} The cloned style.
     * @api
     */
    Fill.prototype.clone = function clone () {
      var color = this.getColor();
      return new Fill({
        color: (color && color.slice) ? color.slice() : color || undefined
      });
    };

    /**
     * Get the fill color.
     * @return {module:ol/color~Color|module:ol/colorlike~ColorLike} Color.
     * @api
     */
    Fill.prototype.getColor = function getColor () {
      return this.color_;
    };

    /**
     * Set the color.
     *
     * @param {module:ol/color~Color|module:ol/colorlike~ColorLike} color Color.
     * @api
     */
    Fill.prototype.setColor = function setColor (color) {
      this.color_ = color;
      this.checksum_ = undefined;
    };

    /**
     * @return {string} The checksum.
     */
    Fill.prototype.getChecksum = function getChecksum () {
      if (this.checksum_ === undefined) {
        if (
          this.color_ instanceof CanvasPattern ||
            this.color_ instanceof CanvasGradient
        ) {
          this.checksum_ = getUid(this.color_).toString();
        } else {
          this.checksum_ = 'f' + (this.color_ ? asString(this.color_) : '-');
        }
      }

      return this.checksum_;
    };

    /**
     * @module ol/style/Stroke
     */


    /**
     * @typedef {Object} Options
     * @property {module:ol/color~Color|module:ol/colorlike~ColorLike} [color] A color, gradient or pattern.
     * See {@link module:ol/color~Color} and {@link module:ol/colorlike~ColorLike} for possible formats.
     * Default null; if null, the Canvas/renderer default black will be used.
     * @property {string} [lineCap='round'] Line cap style: `butt`, `round`, or `square`.
     * @property {string} [lineJoin='round'] Line join style: `bevel`, `round`, or `miter`.
     * @property {Array.<number>} [lineDash] Line dash pattern. Default is `undefined` (no dash).
     * Please note that Internet Explorer 10 and lower do not support the `setLineDash` method on
     * the `CanvasRenderingContext2D` and therefore this option will have no visual effect in these browsers.
     * @property {number} [lineDashOffset=0] Line dash offset.
     * @property {number} [miterLimit=10] Miter limit.
     * @property {number} [width] Width.
     */


    /**
     * @classdesc
     * Set stroke style for vector features.
     * Note that the defaults given are the Canvas defaults, which will be used if
     * option is not defined. The `get` functions return whatever was entered in
     * the options; they will not return the default.
     * @api
     */
    var Stroke = function Stroke(opt_options) {

      var options = opt_options || {};

      /**
       * @private
       * @type {module:ol/color~Color|module:ol/colorlike~ColorLike}
       */
      this.color_ = options.color !== undefined ? options.color : null;

      /**
       * @private
       * @type {string|undefined}
       */
      this.lineCap_ = options.lineCap;

      /**
       * @private
       * @type {Array.<number>}
       */
      this.lineDash_ = options.lineDash !== undefined ? options.lineDash : null;

      /**
       * @private
       * @type {number|undefined}
       */
      this.lineDashOffset_ = options.lineDashOffset;

      /**
       * @private
       * @type {string|undefined}
       */
      this.lineJoin_ = options.lineJoin;

      /**
       * @private
       * @type {number|undefined}
       */
      this.miterLimit_ = options.miterLimit;

      /**
       * @private
       * @type {number|undefined}
       */
      this.width_ = options.width;

      /**
       * @private
       * @type {string|undefined}
       */
      this.checksum_ = undefined;
    };

    /**
     * Clones the style.
     * @return {module:ol/style/Stroke} The cloned style.
     * @api
     */
    Stroke.prototype.clone = function clone () {
      var color = this.getColor();
      return new Stroke({
        color: (color && color.slice) ? color.slice() : color || undefined,
        lineCap: this.getLineCap(),
        lineDash: this.getLineDash() ? this.getLineDash().slice() : undefined,
        lineDashOffset: this.getLineDashOffset(),
        lineJoin: this.getLineJoin(),
        miterLimit: this.getMiterLimit(),
        width: this.getWidth()
      });
    };

    /**
     * Get the stroke color.
     * @return {module:ol/color~Color|module:ol/colorlike~ColorLike} Color.
     * @api
     */
    Stroke.prototype.getColor = function getColor () {
      return this.color_;
    };

    /**
     * Get the line cap type for the stroke.
     * @return {string|undefined} Line cap.
     * @api
     */
    Stroke.prototype.getLineCap = function getLineCap () {
      return this.lineCap_;
    };

    /**
     * Get the line dash style for the stroke.
     * @return {Array.<number>} Line dash.
     * @api
     */
    Stroke.prototype.getLineDash = function getLineDash () {
      return this.lineDash_;
    };

    /**
     * Get the line dash offset for the stroke.
     * @return {number|undefined} Line dash offset.
     * @api
     */
    Stroke.prototype.getLineDashOffset = function getLineDashOffset () {
      return this.lineDashOffset_;
    };

    /**
     * Get the line join type for the stroke.
     * @return {string|undefined} Line join.
     * @api
     */
    Stroke.prototype.getLineJoin = function getLineJoin () {
      return this.lineJoin_;
    };

    /**
     * Get the miter limit for the stroke.
     * @return {number|undefined} Miter limit.
     * @api
     */
    Stroke.prototype.getMiterLimit = function getMiterLimit () {
      return this.miterLimit_;
    };

    /**
     * Get the stroke width.
     * @return {number|undefined} Width.
     * @api
     */
    Stroke.prototype.getWidth = function getWidth () {
      return this.width_;
    };

    /**
     * Set the color.
     *
     * @param {module:ol/color~Color|module:ol/colorlike~ColorLike} color Color.
     * @api
     */
    Stroke.prototype.setColor = function setColor (color) {
      this.color_ = color;
      this.checksum_ = undefined;
    };

    /**
     * Set the line cap.
     *
     * @param {string|undefined} lineCap Line cap.
     * @api
     */
    Stroke.prototype.setLineCap = function setLineCap (lineCap) {
      this.lineCap_ = lineCap;
      this.checksum_ = undefined;
    };

    /**
     * Set the line dash.
     *
     * Please note that Internet Explorer 10 and lower [do not support][mdn] the
     * `setLineDash` method on the `CanvasRenderingContext2D` and therefore this
     * property will have no visual effect in these browsers.
     *
     * [mdn]: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility
     *
     * @param {Array.<number>} lineDash Line dash.
     * @api
     */
    Stroke.prototype.setLineDash = function setLineDash (lineDash) {
      this.lineDash_ = lineDash;
      this.checksum_ = undefined;
    };

    /**
     * Set the line dash offset.
     *
     * @param {number|undefined} lineDashOffset Line dash offset.
     * @api
     */
    Stroke.prototype.setLineDashOffset = function setLineDashOffset (lineDashOffset) {
      this.lineDashOffset_ = lineDashOffset;
      this.checksum_ = undefined;
    };

    /**
     * Set the line join.
     *
     * @param {string|undefined} lineJoin Line join.
     * @api
     */
    Stroke.prototype.setLineJoin = function setLineJoin (lineJoin) {
      this.lineJoin_ = lineJoin;
      this.checksum_ = undefined;
    };

    /**
     * Set the miter limit.
     *
     * @param {number|undefined} miterLimit Miter limit.
     * @api
     */
    Stroke.prototype.setMiterLimit = function setMiterLimit (miterLimit) {
      this.miterLimit_ = miterLimit;
      this.checksum_ = undefined;
    };

    /**
     * Set the width.
     *
     * @param {number|undefined} width Width.
     * @api
     */
    Stroke.prototype.setWidth = function setWidth (width) {
      this.width_ = width;
      this.checksum_ = undefined;
    };

    /**
     * @return {string} The checksum.
     */
    Stroke.prototype.getChecksum = function getChecksum () {
      if (this.checksum_ === undefined) {
        this.checksum_ = 's';
        if (this.color_) {
          if (typeof this.color_ === 'string') {
            this.checksum_ += this.color_;
          } else {
            this.checksum_ += getUid(this.color_).toString();
          }
        } else {
          this.checksum_ += '-';
        }
        this.checksum_ += ',' +
            (this.lineCap_ !== undefined ?
              this.lineCap_.toString() : '-') + ',' +
            (this.lineDash_ ?
              this.lineDash_.toString() : '-') + ',' +
            (this.lineDashOffset_ !== undefined ?
              this.lineDashOffset_ : '-') + ',' +
            (this.lineJoin_ !== undefined ?
              this.lineJoin_ : '-') + ',' +
            (this.miterLimit_ !== undefined ?
              this.miterLimit_.toString() : '-') + ',' +
            (this.width_ !== undefined ?
              this.width_.toString() : '-');
      }

      return this.checksum_;
    };

    /**
     * @module ol/style/Style
     */


    /**
     * A function that takes an {@link module:ol/Feature} and a `{number}`
     * representing the view's resolution. The function should return a
     * {@link module:ol/style/Style} or an array of them. This way e.g. a
     * vector layer can be styled.
     *
     * @typedef {function((module:ol/Feature|module:ol/render/Feature), number):
     *     (module:ol/style/Style|Array.<module:ol/style/Style>)} StyleFunction
     */


    /**
     * A function that takes an {@link module:ol/Feature} as argument and returns an
     * {@link module:ol/geom/Geometry} that will be rendered and styled for the feature.
     *
     * @typedef {function((module:ol/Feature|module:ol/render/Feature)):
     *     (module:ol/geom/Geometry|module:ol/render/Feature|undefined)} GeometryFunction
     */


    /**
     * Custom renderer function. Takes two arguments:
     *
     * 1. The pixel coordinates of the geometry in GeoJSON notation.
     * 2. The {@link module:ol/render~State} of the layer renderer.
     *
     * @typedef {function((module:ol/coordinate~Coordinate|Array<module:ol/coordinate~Coordinate>|Array.<Array.<module:ol/coordinate~Coordinate>>),module:ol/render~State)}
     * RenderFunction
     */


    /**
     * @typedef {Object} Options
     * @property {string|module:ol/geom/Geometry|module:ol/style/Style~GeometryFunction} [geometry] Feature property or geometry
     * or function returning a geometry to render for this style.
     * @property {module:ol/style/Fill} [fill] Fill style.
     * @property {module:ol/style/Image} [image] Image style.
     * @property {module:ol/style/Style~RenderFunction} [renderer] Custom renderer. When configured, `fill`, `stroke` and `image` will be
     * ignored, and the provided function will be called with each render frame for each geometry.
     * @property {module:ol/style/Stroke} [stroke] Stroke style.
     * @property {module:ol/style/Text} [text] Text style.
     * @property {number} [zIndex] Z index.
     */


    /**
     * @classdesc
     * Container for vector feature rendering styles. Any changes made to the style
     * or its children through `set*()` methods will not take effect until the
     * feature or layer that uses the style is re-rendered.
     * @api
     */
    var Style = function Style(opt_options) {

      var options = opt_options || {};

      /**
       * @private
       * @type {string|module:ol/geom/Geometry|module:ol/style/Style~GeometryFunction}
       */
      this.geometry_ = null;

      /**
       * @private
       * @type {!module:ol/style/Style~GeometryFunction}
       */
      this.geometryFunction_ = defaultGeometryFunction;

      if (options.geometry !== undefined) {
        this.setGeometry(options.geometry);
      }

      /**
       * @private
       * @type {module:ol/style/Fill}
       */
      this.fill_ = options.fill !== undefined ? options.fill : null;

      /**
         * @private
         * @type {module:ol/style/Image}
         */
      this.image_ = options.image !== undefined ? options.image : null;

      /**
       * @private
       * @type {module:ol/style/Style~RenderFunction|null}
       */
      this.renderer_ = options.renderer !== undefined ? options.renderer : null;

      /**
       * @private
       * @type {module:ol/style/Stroke}
       */
      this.stroke_ = options.stroke !== undefined ? options.stroke : null;

      /**
       * @private
       * @type {module:ol/style/Text}
       */
      this.text_ = options.text !== undefined ? options.text : null;

      /**
       * @private
       * @type {number|undefined}
       */
      this.zIndex_ = options.zIndex;

    };

    /**
     * Clones the style.
     * @return {module:ol/style/Style} The cloned style.
     * @api
     */
    Style.prototype.clone = function clone () {
      var geometry = this.getGeometry();
      if (geometry && geometry.clone) {
        geometry = geometry.clone();
      }
      return new Style({
        geometry: geometry,
        fill: this.getFill() ? this.getFill().clone() : undefined,
        image: this.getImage() ? this.getImage().clone() : undefined,
        stroke: this.getStroke() ? this.getStroke().clone() : undefined,
        text: this.getText() ? this.getText().clone() : undefined,
        zIndex: this.getZIndex()
      });
    };

    /**
     * Get the custom renderer function that was configured with
     * {@link #setRenderer} or the `renderer` constructor option.
     * @return {module:ol/style/Style~RenderFunction|null} Custom renderer function.
     * @api
     */
    Style.prototype.getRenderer = function getRenderer () {
      return this.renderer_;
    };

    /**
     * Sets a custom renderer function for this style. When set, `fill`, `stroke`
     * and `image` options of the style will be ignored.
     * @param {module:ol/style/Style~RenderFunction|null} renderer Custom renderer function.
     * @api
     */
    Style.prototype.setRenderer = function setRenderer (renderer) {
      this.renderer_ = renderer;
    };

    /**
     * Get the geometry to be rendered.
     * @return {string|module:ol/geom/Geometry|module:ol/style/Style~GeometryFunction}
     * Feature property or geometry or function that returns the geometry that will
     * be rendered with this style.
     * @api
     */
    Style.prototype.getGeometry = function getGeometry () {
      return this.geometry_;
    };

    /**
     * Get the function used to generate a geometry for rendering.
     * @return {!module:ol/style/Style~GeometryFunction} Function that is called with a feature
     * and returns the geometry to render instead of the feature's geometry.
     * @api
     */
    Style.prototype.getGeometryFunction = function getGeometryFunction () {
      return this.geometryFunction_;
    };

    /**
     * Get the fill style.
     * @return {module:ol/style/Fill} Fill style.
     * @api
     */
    Style.prototype.getFill = function getFill () {
      return this.fill_;
    };

    /**
     * Set the fill style.
     * @param {module:ol/style/Fill} fill Fill style.
     * @api
     */
    Style.prototype.setFill = function setFill (fill) {
      this.fill_ = fill;
    };

    /**
     * Get the image style.
     * @return {module:ol/style/Image} Image style.
     * @api
     */
    Style.prototype.getImage = function getImage () {
      return this.image_;
    };

    /**
     * Set the image style.
     * @param {module:ol/style/Image} image Image style.
     * @api
     */
    Style.prototype.setImage = function setImage (image) {
      this.image_ = image;
    };

    /**
     * Get the stroke style.
     * @return {module:ol/style/Stroke} Stroke style.
     * @api
     */
    Style.prototype.getStroke = function getStroke () {
      return this.stroke_;
    };

    /**
     * Set the stroke style.
     * @param {module:ol/style/Stroke} stroke Stroke style.
     * @api
     */
    Style.prototype.setStroke = function setStroke (stroke) {
      this.stroke_ = stroke;
    };

    /**
     * Get the text style.
     * @return {module:ol/style/Text} Text style.
     * @api
     */
    Style.prototype.getText = function getText () {
      return this.text_;
    };

    /**
     * Set the text style.
     * @param {module:ol/style/Text} text Text style.
     * @api
     */
    Style.prototype.setText = function setText (text) {
      this.text_ = text;
    };

    /**
     * Get the z-index for the style.
     * @return {number|undefined} ZIndex.
     * @api
     */
    Style.prototype.getZIndex = function getZIndex () {
      return this.zIndex_;
    };

    /**
     * Set a geometry that is rendered instead of the feature's geometry.
     *
     * @param {string|module:ol/geom/Geometry|module:ol/style/Style~GeometryFunction} geometry
     *   Feature property or geometry or function returning a geometry to render
     *   for this style.
     * @api
     */
    Style.prototype.setGeometry = function setGeometry (geometry) {
      if (typeof geometry === 'function') {
        this.geometryFunction_ = geometry;
      } else if (typeof geometry === 'string') {
        this.geometryFunction_ = function(feature) {
          return (
            /** @type {module:ol/geom/Geometry} */ (feature.get(geometry))
          );
        };
      } else if (!geometry) {
        this.geometryFunction_ = defaultGeometryFunction;
      } else if (geometry !== undefined) {
        this.geometryFunction_ = function() {
          return (
            /** @type {module:ol/geom/Geometry} */ (geometry)
          );
        };
      }
      this.geometry_ = geometry;
    };

    /**
     * Set the z-index.
     *
     * @param {number|undefined} zIndex ZIndex.
     * @api
     */
    Style.prototype.setZIndex = function setZIndex (zIndex) {
      this.zIndex_ = zIndex;
    };


    /**
     * Convert the provided object into a style function.  Functions passed through
     * unchanged.  Arrays of module:ol/style/Style or single style objects wrapped in a
     * new style function.
     * @param {module:ol/style/Style~StyleFunction|Array.<module:ol/style/Style>|module:ol/style/Style} obj
     *     A style function, a single style, or an array of styles.
     * @return {module:ol/style/Style~StyleFunction} A style function.
     */
    function toFunction(obj) {
      var styleFunction;

      if (typeof obj === 'function') {
        styleFunction = obj;
      } else {
        /**
         * @type {Array.<module:ol/style/Style>}
         */
        var styles;
        if (Array.isArray(obj)) {
          styles = obj;
        } else {
          assert(obj instanceof Style,
            41); // Expected an `module:ol/style/Style~Style` or an array of `module:ol/style/Style~Style`
          styles = [obj];
        }
        styleFunction = function() {
          return styles;
        };
      }
      return styleFunction;
    }


    /**
     * @type {Array.<module:ol/style/Style>}
     */
    var defaultStyles = null;


    /**
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature.
     * @param {number} resolution Resolution.
     * @return {Array.<module:ol/style/Style>} Style.
     */
    function createDefaultStyle(feature, resolution) {
      // We don't use an immediately-invoked function
      // and a closure so we don't get an error at script evaluation time in
      // browsers that do not support Canvas. (module:ol/style/Circle~CircleStyle does
      // canvas.getContext('2d') at construction time, which will cause an.error
      // in such browsers.)
      if (!defaultStyles) {
        var fill = new Fill({
          color: 'rgba(255,255,255,0.4)'
        });
        var stroke = new Stroke({
          color: '#3399CC',
          width: 1.25
        });
        defaultStyles = [
          new Style({
            image: new CircleStyle({
              fill: fill,
              stroke: stroke,
              radius: 5
            }),
            fill: fill,
            stroke: stroke
          })
        ];
      }
      return defaultStyles;
    }


    /**
     * Function that is called with a feature and returns its default geometry.
     * @param {module:ol/Feature|module:ol/render/Feature} feature Feature to get the geometry for.
     * @return {module:ol/geom/Geometry|module:ol/render/Feature|undefined} Geometry to render.
     */
    function defaultGeometryFunction(feature) {
      return feature.getGeometry();
    }

    /**
     * @module ol/Feature
     */

    /**
     * @classdesc
     * A vector object for geographic features with a geometry and other
     * attribute properties, similar to the features in vector file formats like
     * GeoJSON.
     *
     * Features can be styled individually with `setStyle`; otherwise they use the
     * style of their vector layer.
     *
     * Note that attribute properties are set as {@link module:ol/Object} properties on
     * the feature object, so they are observable, and have get/set accessors.
     *
     * Typically, a feature has a single geometry property. You can set the
     * geometry using the `setGeometry` method and get it with `getGeometry`.
     * It is possible to store more than one geometry on a feature using attribute
     * properties. By default, the geometry used for rendering is identified by
     * the property name `geometry`. If you want to use another geometry property
     * for rendering, use the `setGeometryName` method to change the attribute
     * property associated with the geometry for the feature.  For example:
     *
     * ```js
     *
     * import Feature from 'ol/Feature';
     * import Polygon from 'ol/geom/Polygon';
     * import Point from 'ol/geom/Point';
     *
     * var feature = new Feature({
     *   geometry: new Polygon(polyCoords),
     *   labelPoint: new Point(labelCoords),
     *   name: 'My Polygon'
     * });
     *
     * // get the polygon geometry
     * var poly = feature.getGeometry();
     *
     * // Render the feature as a point using the coordinates from labelPoint
     * feature.setGeometryName('labelPoint');
     *
     * // get the point geometry
     * var point = feature.getGeometry();
     * ```
     *
     * @api
     */
    var Feature = (function (BaseObject$$1) {
      function Feature(opt_geometryOrProperties) {

        BaseObject$$1.call(this);

        /**
         * @private
         * @type {number|string|undefined}
         */
        this.id_ = undefined;

        /**
         * @type {string}
         * @private
         */
        this.geometryName_ = 'geometry';

        /**
         * User provided style.
         * @private
         * @type {module:ol/style/Style|Array.<module:ol/style/Style>|module:ol/style/Style~StyleFunction}
         */
        this.style_ = null;

        /**
         * @private
         * @type {module:ol/style/Style~StyleFunction|undefined}
         */
        this.styleFunction_ = undefined;

        /**
         * @private
         * @type {?module:ol/events~EventsKey}
         */
        this.geometryChangeKey_ = null;

        listen(
          this, getChangeEventType(this.geometryName_),
          this.handleGeometryChanged_, this);

        if (opt_geometryOrProperties !== undefined) {
          if (opt_geometryOrProperties instanceof Geometry ||
              !opt_geometryOrProperties) {
            var geometry = opt_geometryOrProperties;
            this.setGeometry(geometry);
          } else {
            /** @type {Object.<string, *>} */
            var properties = opt_geometryOrProperties;
            this.setProperties(properties);
          }
        }
      }

      if ( BaseObject$$1 ) Feature.__proto__ = BaseObject$$1;
      Feature.prototype = Object.create( BaseObject$$1 && BaseObject$$1.prototype );
      Feature.prototype.constructor = Feature;

      /**
       * Clone this feature. If the original feature has a geometry it
       * is also cloned. The feature id is not set in the clone.
       * @return {module:ol/Feature} The clone.
       * @api
       */
      Feature.prototype.clone = function clone () {
        var clone = new Feature(this.getProperties());
        clone.setGeometryName(this.getGeometryName());
        var geometry = this.getGeometry();
        if (geometry) {
          clone.setGeometry(geometry.clone());
        }
        var style = this.getStyle();
        if (style) {
          clone.setStyle(style);
        }
        return clone;
      };

      /**
       * Get the feature's default geometry.  A feature may have any number of named
       * geometries.  The "default" geometry (the one that is rendered by default) is
       * set when calling {@link module:ol/Feature~Feature#setGeometry}.
       * @return {module:ol/geom/Geometry|undefined} The default geometry for the feature.
       * @api
       * @observable
       */
      Feature.prototype.getGeometry = function getGeometry () {
        return (
          /** @type {module:ol/geom/Geometry|undefined} */ (this.get(this.geometryName_))
        );
      };

      /**
       * Get the feature identifier.  This is a stable identifier for the feature and
       * is either set when reading data from a remote source or set explicitly by
       * calling {@link module:ol/Feature~Feature#setId}.
       * @return {number|string|undefined} Id.
       * @api
       */
      Feature.prototype.getId = function getId () {
        return this.id_;
      };

      /**
       * Get the name of the feature's default geometry.  By default, the default
       * geometry is named `geometry`.
       * @return {string} Get the property name associated with the default geometry
       *     for this feature.
       * @api
       */
      Feature.prototype.getGeometryName = function getGeometryName () {
        return this.geometryName_;
      };

      /**
       * Get the feature's style. Will return what was provided to the
       * {@link module:ol/Feature~Feature#setStyle} method.
       * @return {module:ol/style/Style|Array.<module:ol/style/Style>|module:ol/style/Style~StyleFunction} The feature style.
       * @api
       */
      Feature.prototype.getStyle = function getStyle () {
        return this.style_;
      };

      /**
       * Get the feature's style function.
       * @return {module:ol/style/Style~StyleFunction|undefined} Return a function
       * representing the current style of this feature.
       * @api
       */
      Feature.prototype.getStyleFunction = function getStyleFunction () {
        return this.styleFunction_;
      };

      /**
       * @private
       */
      Feature.prototype.handleGeometryChange_ = function handleGeometryChange_ () {
        this.changed();
      };

      /**
       * @private
       */
      Feature.prototype.handleGeometryChanged_ = function handleGeometryChanged_ () {
        if (this.geometryChangeKey_) {
          unlistenByKey(this.geometryChangeKey_);
          this.geometryChangeKey_ = null;
        }
        var geometry = this.getGeometry();
        if (geometry) {
          this.geometryChangeKey_ = listen(geometry,
            EventType.CHANGE, this.handleGeometryChange_, this);
        }
        this.changed();
      };

      /**
       * Set the default geometry for the feature.  This will update the property
       * with the name returned by {@link module:ol/Feature~Feature#getGeometryName}.
       * @param {module:ol/geom/Geometry|undefined} geometry The new geometry.
       * @api
       * @observable
       */
      Feature.prototype.setGeometry = function setGeometry (geometry) {
        this.set(this.geometryName_, geometry);
      };

      /**
       * Set the style for the feature.  This can be a single style object, an array
       * of styles, or a function that takes a resolution and returns an array of
       * styles. If it is `null` the feature has no style (a `null` style).
       * @param {module:ol/style/Style|Array.<module:ol/style/Style>|module:ol/style/Style~StyleFunction} style Style for this feature.
       * @api
       * @fires module:ol/events/Event~Event#event:change
       */
      Feature.prototype.setStyle = function setStyle (style) {
        this.style_ = style;
        this.styleFunction_ = !style ? undefined : createStyleFunction(style);
        this.changed();
      };

      /**
       * Set the feature id.  The feature id is considered stable and may be used when
       * requesting features or comparing identifiers returned from a remote source.
       * The feature id can be used with the
       * {@link module:ol/source/Vector~VectorSource#getFeatureById} method.
       * @param {number|string|undefined} id The feature id.
       * @api
       * @fires module:ol/events/Event~Event#event:change
       */
      Feature.prototype.setId = function setId (id) {
        this.id_ = id;
        this.changed();
      };

      /**
       * Set the property name to be used when getting the feature's default geometry.
       * When calling {@link module:ol/Feature~Feature#getGeometry}, the value of the property with
       * this name will be returned.
       * @param {string} name The property name of the default geometry.
       * @api
       */
      Feature.prototype.setGeometryName = function setGeometryName (name) {
        unlisten(
          this, getChangeEventType(this.geometryName_),
          this.handleGeometryChanged_, this);
        this.geometryName_ = name;
        listen(
          this, getChangeEventType(this.geometryName_),
          this.handleGeometryChanged_, this);
        this.handleGeometryChanged_();
      };

      return Feature;
    }(BaseObject));


    /**
     * Convert the provided object into a feature style function.  Functions passed
     * through unchanged.  Arrays of module:ol/style/Style or single style objects wrapped
     * in a new feature style function.
     * @param {module:ol/style/Style~StyleFunction|!Array.<module:ol/style/Style>|!module:ol/style/Style} obj
     *     A feature style function, a single style, or an array of styles.
     * @return {module:ol/style/Style~StyleFunction} A style function.
     */
    function createStyleFunction(obj) {
      if (typeof obj === 'function') {
        return obj;
      } else {
        /**
         * @type {Array.<module:ol/style/Style>}
         */
        var styles;
        if (Array.isArray(obj)) {
          styles = obj;
        } else {
          assert(obj instanceof Style,
            41); // Expected an `module:ol/style/Style~Style` or an array of `module:ol/style/Style~Style`
          styles = [obj];
        }
        return function() {
          return styles;
        };
      }
    }

    /**
     * @module ol/CollectionEventType
     */

    /**
     * @enum {string}
     */
    var CollectionEventType = {
      /**
       * Triggered when an item is added to the collection.
       * @event module:ol/Collection~CollectionEvent#add
       * @api
       */
      ADD: 'add',
      /**
       * Triggered when an item is removed from the collection.
       * @event module:ol/Collection~CollectionEvent#remove
       * @api
       */
      REMOVE: 'remove'
    };

    /**
     * @module ol/Collection
     */


    /**
     * @enum {string}
     * @private
     */
    var Property = {
      LENGTH: 'length'
    };


    /**
     * @classdesc
     * Events emitted by {@link module:ol/Collection~Collection} instances are instances of this
     * type.
     */
    var CollectionEvent = (function (Event$$1) {
      function CollectionEvent(type, opt_element) {
        Event$$1.call(this, type);

        /**
         * The element that is added to or removed from the collection.
         * @type {*}
         * @api
         */
        this.element = opt_element;

      }

      if ( Event$$1 ) CollectionEvent.__proto__ = Event$$1;
      CollectionEvent.prototype = Object.create( Event$$1 && Event$$1.prototype );
      CollectionEvent.prototype.constructor = CollectionEvent;

      return CollectionEvent;
    }(Event));


    /**
     * @typedef {Object} Options
     * @property {boolean} [unique=false] Disallow the same item from being added to
     * the collection twice.
     */

    /**
     * @classdesc
     * An expanded version of standard JS Array, adding convenience methods for
     * manipulation. Add and remove changes to the Collection trigger a Collection
     * event. Note that this does not cover changes to the objects _within_ the
     * Collection; they trigger events on the appropriate object, not on the
     * Collection as a whole.
     *
     * @template T
     * @api
     */
    var Collection = (function (BaseObject$$1) {
      function Collection(opt_array, opt_options) {
        var this$1 = this;


        BaseObject$$1.call(this);

        var options = opt_options || {};

        /**
         * @private
         * @type {boolean}
         */
        this.unique_ = !!options.unique;

        /**
         * @private
         * @type {!Array.<T>}
         */
        this.array_ = opt_array ? opt_array : [];

        if (this.unique_) {
          for (var i = 0, ii = this.array_.length; i < ii; ++i) {
            this$1.assertUnique_(this$1.array_[i], i);
          }
        }

        this.updateLength_();

      }

      if ( BaseObject$$1 ) Collection.__proto__ = BaseObject$$1;
      Collection.prototype = Object.create( BaseObject$$1 && BaseObject$$1.prototype );
      Collection.prototype.constructor = Collection;

      /**
       * Remove all elements from the collection.
       * @api
       */
      Collection.prototype.clear = function clear () {
        var this$1 = this;

        while (this.getLength() > 0) {
          this$1.pop();
        }
      };

      /**
       * Add elements to the collection.  This pushes each item in the provided array
       * to the end of the collection.
       * @param {!Array.<T>} arr Array.
       * @return {module:ol/Collection.<T>} This collection.
       * @api
       */
      Collection.prototype.extend = function extend (arr) {
        var this$1 = this;

        for (var i = 0, ii = arr.length; i < ii; ++i) {
          this$1.push(arr[i]);
        }
        return this;
      };

      /**
       * Iterate over each element, calling the provided callback.
       * @param {function(T, number, Array.<T>): *} f The function to call
       *     for every element. This function takes 3 arguments (the element, the
       *     index and the array). The return value is ignored.
       * @api
       */
      Collection.prototype.forEach = function forEach (f) {
        var array = this.array_;
        for (var i = 0, ii = array.length; i < ii; ++i) {
          f(array[i], i, array);
        }
      };

      /**
       * Get a reference to the underlying Array object. Warning: if the array
       * is mutated, no events will be dispatched by the collection, and the
       * collection's "length" property won't be in sync with the actual length
       * of the array.
       * @return {!Array.<T>} Array.
       * @api
       */
      Collection.prototype.getArray = function getArray () {
        return this.array_;
      };

      /**
       * Get the element at the provided index.
       * @param {number} index Index.
       * @return {T} Element.
       * @api
       */
      Collection.prototype.item = function item (index) {
        return this.array_[index];
      };

      /**
       * Get the length of this collection.
       * @return {number} The length of the array.
       * @observable
       * @api
       */
      Collection.prototype.getLength = function getLength () {
        return /** @type {number} */ (this.get(Property.LENGTH));
      };

      /**
       * Insert an element at the provided index.
       * @param {number} index Index.
       * @param {T} elem Element.
       * @api
       */
      Collection.prototype.insertAt = function insertAt (index, elem) {
        if (this.unique_) {
          this.assertUnique_(elem);
        }
        this.array_.splice(index, 0, elem);
        this.updateLength_();
        this.dispatchEvent(
          new CollectionEvent(CollectionEventType.ADD, elem));
      };

      /**
       * Remove the last element of the collection and return it.
       * Return `undefined` if the collection is empty.
       * @return {T|undefined} Element.
       * @api
       */
      Collection.prototype.pop = function pop () {
        return this.removeAt(this.getLength() - 1);
      };

      /**
       * Insert the provided element at the end of the collection.
       * @param {T} elem Element.
       * @return {number} New length of the collection.
       * @api
       */
      Collection.prototype.push = function push (elem) {
        if (this.unique_) {
          this.assertUnique_(elem);
        }
        var n = this.getLength();
        this.insertAt(n, elem);
        return this.getLength();
      };

      /**
       * Remove the first occurrence of an element from the collection.
       * @param {T} elem Element.
       * @return {T|undefined} The removed element or undefined if none found.
       * @api
       */
      Collection.prototype.remove = function remove (elem) {
        var this$1 = this;

        var arr = this.array_;
        for (var i = 0, ii = arr.length; i < ii; ++i) {
          if (arr[i] === elem) {
            return this$1.removeAt(i);
          }
        }
        return undefined;
      };

      /**
       * Remove the element at the provided index and return it.
       * Return `undefined` if the collection does not contain this index.
       * @param {number} index Index.
       * @return {T|undefined} Value.
       * @api
       */
      Collection.prototype.removeAt = function removeAt (index) {
        var prev = this.array_[index];
        this.array_.splice(index, 1);
        this.updateLength_();
        this.dispatchEvent(new CollectionEvent(CollectionEventType.REMOVE, prev));
        return prev;
      };

      /**
       * Set the element at the provided index.
       * @param {number} index Index.
       * @param {T} elem Element.
       * @api
       */
      Collection.prototype.setAt = function setAt (index, elem) {
        var this$1 = this;

        var n = this.getLength();
        if (index < n) {
          if (this.unique_) {
            this.assertUnique_(elem, index);
          }
          var prev = this.array_[index];
          this.array_[index] = elem;
          this.dispatchEvent(
            new CollectionEvent(CollectionEventType.REMOVE, prev));
          this.dispatchEvent(
            new CollectionEvent(CollectionEventType.ADD, elem));
        } else {
          for (var j = n; j < index; ++j) {
            this$1.insertAt(j, undefined);
          }
          this.insertAt(index, elem);
        }
      };

      /**
       * @private
       */
      Collection.prototype.updateLength_ = function updateLength_ () {
        this.set(Property.LENGTH, this.array_.length);
      };

      /**
       * @private
       * @param {T} elem Element.
       * @param {number=} opt_except Optional index to ignore.
       */
      Collection.prototype.assertUnique_ = function assertUnique_ (elem, opt_except) {
        var this$1 = this;

        for (var i = 0, ii = this.array_.length; i < ii; ++i) {
          if (this$1.array_[i] === elem && i !== opt_except) {
            throw new AssertionError(58);
          }
        }
      };

      return Collection;
    }(BaseObject));

    /**
     * @module ol/layer/Property
     */

    /**
     * @enum {string}
     */
    var LayerProperty = {
      OPACITY: 'opacity',
      VISIBLE: 'visible',
      EXTENT: 'extent',
      Z_INDEX: 'zIndex',
      MAX_RESOLUTION: 'maxResolution',
      MIN_RESOLUTION: 'minResolution',
      SOURCE: 'source'
    };

    /**
     * @module ol/layer/Base
     */


    /**
     * @typedef {Object} Options
     * @property {number} [opacity=1] Opacity (0, 1).
     * @property {boolean} [visible=true] Visibility.
     * @property {module:ol/extent~Extent} [extent] The bounding extent for layer rendering.  The layer will not be
     * rendered outside of this extent.
     * @property {number} [zIndex=0] The z-index for layer rendering.  At rendering time, the layers
     * will be ordered, first by Z-index and then by position.
     * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
     * visible.
     * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
     * be visible.
     */


    /**
     * @classdesc
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * Note that with {@link module:ol/layer/Base} and all its subclasses, any property set in
     * the options is set as a {@link module:ol/Object} property on the layer object, so
     * is observable, and has get/set accessors.
     *
     * @api
     */
    var BaseLayer = (function (BaseObject$$1) {
      function BaseLayer(options) {

        BaseObject$$1.call(this);

        /**
        * @type {Object.<string, *>}
        */
        var properties = assign({}, options);
        properties[LayerProperty.OPACITY] =
           options.opacity !== undefined ? options.opacity : 1;
        properties[LayerProperty.VISIBLE] =
           options.visible !== undefined ? options.visible : true;
        properties[LayerProperty.Z_INDEX] =
           options.zIndex !== undefined ? options.zIndex : 0;
        properties[LayerProperty.MAX_RESOLUTION] =
           options.maxResolution !== undefined ? options.maxResolution : Infinity;
        properties[LayerProperty.MIN_RESOLUTION] =
           options.minResolution !== undefined ? options.minResolution : 0;

        this.setProperties(properties);

        /**
        * @type {module:ol/layer/Layer~State}
        * @private
        */
        this.state_ = /** @type {module:ol/layer/Layer~State} */ ({
          layer: /** @type {module:ol/layer/Layer} */ (this),
          managed: true
        });

        /**
        * The layer type.
        * @type {module:ol/LayerType}
        * @protected;
        */
        this.type;

      }

      if ( BaseObject$$1 ) BaseLayer.__proto__ = BaseObject$$1;
      BaseLayer.prototype = Object.create( BaseObject$$1 && BaseObject$$1.prototype );
      BaseLayer.prototype.constructor = BaseLayer;

      /**
      * Get the layer type (used when creating a layer renderer).
      * @return {module:ol/LayerType} The layer type.
      */
      BaseLayer.prototype.getType = function getType () {
        return this.type;
      };

      /**
      * @return {module:ol/layer/Layer~State} Layer state.
      */
      BaseLayer.prototype.getLayerState = function getLayerState () {
        this.state_.opacity = clamp(this.getOpacity(), 0, 1);
        this.state_.sourceState = this.getSourceState();
        this.state_.visible = this.getVisible();
        this.state_.extent = this.getExtent();
        this.state_.zIndex = this.getZIndex();
        this.state_.maxResolution = this.getMaxResolution();
        this.state_.minResolution = Math.max(this.getMinResolution(), 0);

        return this.state_;
      };

      /**
      * @abstract
      * @param {Array.<module:ol/layer/Layer>=} opt_array Array of layers (to be
      *     modified in place).
      * @return {Array.<module:ol/layer/Layer>} Array of layers.
      */
      BaseLayer.prototype.getLayersArray = function getLayersArray (opt_array) {};

      /**
      * @abstract
      * @param {Array.<module:ol/layer/Layer~State>=} opt_states Optional list of layer
      *     states (to be modified in place).
      * @return {Array.<module:ol/layer/Layer~State>} List of layer states.
      */
      BaseLayer.prototype.getLayerStatesArray = function getLayerStatesArray (opt_states) {};

      /**
      * Return the {@link module:ol/extent~Extent extent} of the layer or `undefined` if it
      * will be visible regardless of extent.
      * @return {module:ol/extent~Extent|undefined} The layer extent.
      * @observable
      * @api
      */
      BaseLayer.prototype.getExtent = function getExtent () {
        return (
        /** @type {module:ol/extent~Extent|undefined} */ (this.get(LayerProperty.EXTENT))
        );
      };

      /**
      * Return the maximum resolution of the layer.
      * @return {number} The maximum resolution of the layer.
      * @observable
      * @api
      */
      BaseLayer.prototype.getMaxResolution = function getMaxResolution () {
        return /** @type {number} */ (this.get(LayerProperty.MAX_RESOLUTION));
      };

      /**
      * Return the minimum resolution of the layer.
      * @return {number} The minimum resolution of the layer.
      * @observable
      * @api
      */
      BaseLayer.prototype.getMinResolution = function getMinResolution () {
        return /** @type {number} */ (this.get(LayerProperty.MIN_RESOLUTION));
      };

      /**
      * Return the opacity of the layer (between 0 and 1).
      * @return {number} The opacity of the layer.
      * @observable
      * @api
      */
      BaseLayer.prototype.getOpacity = function getOpacity () {
        return /** @type {number} */ (this.get(LayerProperty.OPACITY));
      };

      /**
      * @abstract
      * @return {module:ol/source/State} Source state.
      */
      BaseLayer.prototype.getSourceState = function getSourceState () {};

      /**
      * Return the visibility of the layer (`true` or `false`).
      * @return {boolean} The visibility of the layer.
      * @observable
      * @api
      */
      BaseLayer.prototype.getVisible = function getVisible () {
        return /** @type {boolean} */ (this.get(LayerProperty.VISIBLE));
      };

      /**
      * Return the Z-index of the layer, which is used to order layers before
      * rendering. The default Z-index is 0.
      * @return {number} The Z-index of the layer.
      * @observable
      * @api
      */
      BaseLayer.prototype.getZIndex = function getZIndex () {
        return /** @type {number} */ (this.get(LayerProperty.Z_INDEX));
      };

      /**
      * Set the extent at which the layer is visible.  If `undefined`, the layer
      * will be visible at all extents.
      * @param {module:ol/extent~Extent|undefined} extent The extent of the layer.
      * @observable
      * @api
      */
      BaseLayer.prototype.setExtent = function setExtent (extent) {
        this.set(LayerProperty.EXTENT, extent);
      };

      /**
      * Set the maximum resolution at which the layer is visible.
      * @param {number} maxResolution The maximum resolution of the layer.
      * @observable
      * @api
      */
      BaseLayer.prototype.setMaxResolution = function setMaxResolution (maxResolution) {
        this.set(LayerProperty.MAX_RESOLUTION, maxResolution);
      };

      /**
      * Set the minimum resolution at which the layer is visible.
      * @param {number} minResolution The minimum resolution of the layer.
      * @observable
      * @api
      */
      BaseLayer.prototype.setMinResolution = function setMinResolution (minResolution) {
        this.set(LayerProperty.MIN_RESOLUTION, minResolution);
      };

      /**
      * Set the opacity of the layer, allowed values range from 0 to 1.
      * @param {number} opacity The opacity of the layer.
      * @observable
      * @api
      */
      BaseLayer.prototype.setOpacity = function setOpacity (opacity) {
        this.set(LayerProperty.OPACITY, opacity);
      };

      /**
      * Set the visibility of the layer (`true` or `false`).
      * @param {boolean} visible The visibility of the layer.
      * @observable
      * @api
      */
      BaseLayer.prototype.setVisible = function setVisible (visible) {
        this.set(LayerProperty.VISIBLE, visible);
      };

      /**
      * Set Z-index of the layer, which is used to order layers before rendering.
      * The default Z-index is 0.
      * @param {number} zindex The z-index of the layer.
      * @observable
      * @api
      */
      BaseLayer.prototype.setZIndex = function setZIndex (zindex) {
        this.set(LayerProperty.Z_INDEX, zindex);
      };

      return BaseLayer;
    }(BaseObject));

    /**
     * @module ol/source/State
     */

    /**
     * State of the source, one of 'undefined', 'loading', 'ready' or 'error'.
     * @enum {string}
     */
    var SourceState = {
      UNDEFINED: 'undefined',
      LOADING: 'loading',
      READY: 'ready',
      ERROR: 'error'
    };

    /**
     * @module ol/layer/Group
     */


    /**
     * @typedef {Object} Options
     * @property {number} [opacity=1] Opacity (0, 1).
     * @property {boolean} [visible=true] Visibility.
     * @property {module:ol/extent~Extent} [extent] The bounding extent for layer rendering.  The layer will not be
     * rendered outside of this extent.
     * @property {number} [zIndex=0] The z-index for layer rendering.  At rendering time, the layers
     * will be ordered, first by Z-index and then by position.
     * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
     * visible.
     * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
     * be visible.
     * @property {(Array.<module:ol/layer/Base>|module:ol/Collection.<module:ol/layer/Base>)} [layers] Child layers.
     */


    /**
     * @enum {string}
     * @private
     */
    var Property$1 = {
      LAYERS: 'layers'
    };


    /**
     * @classdesc
     * A {@link module:ol/Collection~Collection} of layers that are handled together.
     *
     * A generic `change` event is triggered when the group/Collection changes.
     *
     * @api
     */
    var LayerGroup = (function (BaseLayer$$1) {
      function LayerGroup(opt_options) {

        var options = opt_options || {};
        var baseOptions = /** @type {module:ol/layer/Group~Options} */ (assign({}, options));
        delete baseOptions.layers;

        var layers = options.layers;

        BaseLayer$$1.call(this, baseOptions);

        /**
         * @private
         * @type {Array.<module:ol/events~EventsKey>}
         */
        this.layersListenerKeys_ = [];

        /**
         * @private
         * @type {Object.<string, Array.<module:ol/events~EventsKey>>}
         */
        this.listenerKeys_ = {};

        listen(this,
          getChangeEventType(Property$1.LAYERS),
          this.handleLayersChanged_, this);

        if (layers) {
          if (Array.isArray(layers)) {
            layers = new Collection(layers.slice(), {unique: true});
          } else {
            assert(layers instanceof Collection,
              43); // Expected `layers` to be an array or a `Collection`
            layers = layers;
          }
        } else {
          layers = new Collection(undefined, {unique: true});
        }

        this.setLayers(layers);

      }

      if ( BaseLayer$$1 ) LayerGroup.__proto__ = BaseLayer$$1;
      LayerGroup.prototype = Object.create( BaseLayer$$1 && BaseLayer$$1.prototype );
      LayerGroup.prototype.constructor = LayerGroup;

      /**
       * @private
       */
      LayerGroup.prototype.handleLayerChange_ = function handleLayerChange_ () {
        this.changed();
      };

      /**
       * @param {module:ol/events/Event} event Event.
       * @private
       */
      LayerGroup.prototype.handleLayersChanged_ = function handleLayersChanged_ () {
        var this$1 = this;

        this.layersListenerKeys_.forEach(unlistenByKey);
        this.layersListenerKeys_.length = 0;

        var layers = this.getLayers();
        this.layersListenerKeys_.push(
          listen(layers, CollectionEventType.ADD, this.handleLayersAdd_, this),
          listen(layers, CollectionEventType.REMOVE, this.handleLayersRemove_, this)
        );

        for (var id in this$1.listenerKeys_) {
          this$1.listenerKeys_[id].forEach(unlistenByKey);
        }
        clear(this.listenerKeys_);

        var layersArray = layers.getArray();
        for (var i = 0, ii = layersArray.length; i < ii; i++) {
          var layer = layersArray[i];
          this$1.listenerKeys_[getUid(layer).toString()] = [
            listen(layer, ObjectEventType.PROPERTYCHANGE, this$1.handleLayerChange_, this$1),
            listen(layer, EventType.CHANGE, this$1.handleLayerChange_, this$1)
          ];
        }

        this.changed();
      };

      /**
       * @param {module:ol/Collection~CollectionEvent} collectionEvent CollectionEvent.
       * @private
       */
      LayerGroup.prototype.handleLayersAdd_ = function handleLayersAdd_ (collectionEvent) {
        var layer = /** @type {module:ol/layer/Base} */ (collectionEvent.element);
        var key = getUid(layer).toString();
        this.listenerKeys_[key] = [
          listen(layer, ObjectEventType.PROPERTYCHANGE, this.handleLayerChange_, this),
          listen(layer, EventType.CHANGE, this.handleLayerChange_, this)
        ];
        this.changed();
      };

      /**
       * @param {module:ol/Collection~CollectionEvent} collectionEvent CollectionEvent.
       * @private
       */
      LayerGroup.prototype.handleLayersRemove_ = function handleLayersRemove_ (collectionEvent) {
        var layer = /** @type {module:ol/layer/Base} */ (collectionEvent.element);
        var key = getUid(layer).toString();
        this.listenerKeys_[key].forEach(unlistenByKey);
        delete this.listenerKeys_[key];
        this.changed();
      };

      /**
       * Returns the {@link module:ol/Collection collection} of {@link module:ol/layer/Layer~Layer layers}
       * in this group.
       * @return {!module:ol/Collection.<module:ol/layer/Base>} Collection of
       *   {@link module:ol/layer/Base layers} that are part of this group.
       * @observable
       * @api
       */
      LayerGroup.prototype.getLayers = function getLayers () {
        return (
          /** @type {!module:ol/Collection.<module:ol/layer/Base>} */ (this.get(Property$1.LAYERS))
        );
      };

      /**
       * Set the {@link module:ol/Collection collection} of {@link module:ol/layer/Layer~Layer layers}
       * in this group.
       * @param {!module:ol/Collection.<module:ol/layer/Base>} layers Collection of
       *   {@link module:ol/layer/Base layers} that are part of this group.
       * @observable
       * @api
       */
      LayerGroup.prototype.setLayers = function setLayers (layers) {
        this.set(Property$1.LAYERS, layers);
      };

      /**
       * @inheritDoc
       */
      LayerGroup.prototype.getLayersArray = function getLayersArray (opt_array) {
        var array = opt_array !== undefined ? opt_array : [];
        this.getLayers().forEach(function(layer) {
          layer.getLayersArray(array);
        });
        return array;
      };

      /**
       * @inheritDoc
       */
      LayerGroup.prototype.getLayerStatesArray = function getLayerStatesArray (opt_states) {
        var states = opt_states !== undefined ? opt_states : [];

        var pos = states.length;

        this.getLayers().forEach(function(layer) {
          layer.getLayerStatesArray(states);
        });

        var ownLayerState = this.getLayerState();
        for (var i = pos, ii = states.length; i < ii; i++) {
          var layerState = states[i];
          layerState.opacity *= ownLayerState.opacity;
          layerState.visible = layerState.visible && ownLayerState.visible;
          layerState.maxResolution = Math.min(
            layerState.maxResolution, ownLayerState.maxResolution);
          layerState.minResolution = Math.max(
            layerState.minResolution, ownLayerState.minResolution);
          if (ownLayerState.extent !== undefined) {
            if (layerState.extent !== undefined) {
              layerState.extent = getIntersection(layerState.extent, ownLayerState.extent);
            } else {
              layerState.extent = ownLayerState.extent;
            }
          }
        }

        return states;
      };

      /**
       * @inheritDoc
       */
      LayerGroup.prototype.getSourceState = function getSourceState () {
        return SourceState.READY;
      };

      return LayerGroup;
    }(BaseLayer));

    /**
     * @module ol/LayerType
     */

    /**
     * A layer type used when creating layer renderers.
     * @enum {string}
     */
    var LayerType = {
      IMAGE: 'IMAGE',
      TILE: 'TILE',
      VECTOR_TILE: 'VECTOR_TILE',
      VECTOR: 'VECTOR'
    };

    /**
     * @module ol/render/EventType
     */

    /**
     * @enum {string}
     */
    var RenderEventType = {
      /**
       * @event module:ol/render/Event~RenderEvent#postcompose
       * @api
       */
      POSTCOMPOSE: 'postcompose',
      /**
       * @event module:ol/render/Event~RenderEvent#precompose
       * @api
       */
      PRECOMPOSE: 'precompose',
      /**
       * @event module:ol/render/Event~RenderEvent#render
       * @api
       */
      RENDER: 'render'
    };

    /**
     * @module ol/layer/Layer
     */


    /**
     * @typedef {Object} Options
     * @property {number} [opacity=1] Opacity (0, 1).
     * @property {boolean} [visible=true] Visibility.
     * @property {module:ol/extent~Extent} [extent] The bounding extent for layer rendering.  The layer will not be
     * rendered outside of this extent.
     * @property {number} [zIndex=0] The z-index for layer rendering.  At rendering time, the layers
     * will be ordered, first by Z-index and then by position.
     * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
     * visible.
     * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
     * be visible.
     * @property {module:ol/source/Source} [source] Source for this layer.  If not provided to the constructor,
     * the source can be set by calling {@link module:ol/layer/Layer#setSource layer.setSource(source)} after
     * construction.
     */


    /**
     * @typedef {Object} State
     * @property {module:ol/layer/Layer} layer
     * @property {number} opacity
     * @property {module:ol/source/Source~State} sourceState
     * @property {boolean} visible
     * @property {boolean} managed
     * @property {module:ol/extent~Extent} [extent]
     * @property {number} zIndex
     * @property {number} maxResolution
     * @property {number} minResolution
     */

    /**
     * @classdesc
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * A visual representation of raster or vector map data.
     * Layers group together those properties that pertain to how the data is to be
     * displayed, irrespective of the source of that data.
     *
     * Layers are usually added to a map with {@link module:ol/Map#addLayer}. Components
     * like {@link module:ol/interaction/Select~Select} use unmanaged layers
     * internally. These unmanaged layers are associated with the map using
     * {@link module:ol/layer/Layer~Layer#setMap} instead.
     *
     * A generic `change` event is fired when the state of the source changes.
     *
     * @fires module:ol/render/Event~RenderEvent
     */
    var Layer = (function (BaseLayer$$1) {
      function Layer(options) {

        var baseOptions = assign({}, options);
        delete baseOptions.source;

        BaseLayer$$1.call(this, baseOptions);

        /**
         * @private
         * @type {?module:ol/events~EventsKey}
         */
        this.mapPrecomposeKey_ = null;

        /**
         * @private
         * @type {?module:ol/events~EventsKey}
         */
        this.mapRenderKey_ = null;

        /**
         * @private
         * @type {?module:ol/events~EventsKey}
         */
        this.sourceChangeKey_ = null;

        if (options.map) {
          this.setMap(options.map);
        }

        listen(this,
          getChangeEventType(LayerProperty.SOURCE),
          this.handleSourcePropertyChange_, this);

        var source = options.source ? options.source : null;
        this.setSource(source);
      }

      if ( BaseLayer$$1 ) Layer.__proto__ = BaseLayer$$1;
      Layer.prototype = Object.create( BaseLayer$$1 && BaseLayer$$1.prototype );
      Layer.prototype.constructor = Layer;

      /**
       * @inheritDoc
       */
      Layer.prototype.getLayersArray = function getLayersArray (opt_array) {
        var array = opt_array ? opt_array : [];
        array.push(this);
        return array;
      };

      /**
       * @inheritDoc
       */
      Layer.prototype.getLayerStatesArray = function getLayerStatesArray (opt_states) {
        var states = opt_states ? opt_states : [];
        states.push(this.getLayerState());
        return states;
      };

      /**
       * Get the layer source.
       * @return {module:ol/source/Source} The layer source (or `null` if not yet set).
       * @observable
       * @api
       */
      Layer.prototype.getSource = function getSource () {
        var source = this.get(LayerProperty.SOURCE);
        return (
          /** @type {module:ol/source/Source} */ (source) || null
        );
      };

      /**
        * @inheritDoc
        */
      Layer.prototype.getSourceState = function getSourceState () {
        var source = this.getSource();
        return !source ? SourceState.UNDEFINED : source.getState();
      };

      /**
       * @private
       */
      Layer.prototype.handleSourceChange_ = function handleSourceChange_ () {
        this.changed();
      };

      /**
       * @private
       */
      Layer.prototype.handleSourcePropertyChange_ = function handleSourcePropertyChange_ () {
        if (this.sourceChangeKey_) {
          unlistenByKey(this.sourceChangeKey_);
          this.sourceChangeKey_ = null;
        }
        var source = this.getSource();
        if (source) {
          this.sourceChangeKey_ = listen(source,
            EventType.CHANGE, this.handleSourceChange_, this);
        }
        this.changed();
      };

      /**
       * Sets the layer to be rendered on top of other layers on a map. The map will
       * not manage this layer in its layers collection, and the callback in
       * {@link module:ol/Map#forEachLayerAtPixel} will receive `null` as layer. This
       * is useful for temporary layers. To remove an unmanaged layer from the map,
       * use `#setMap(null)`.
       *
       * To add the layer to a map and have it managed by the map, use
       * {@link module:ol/Map#addLayer} instead.
       * @param {module:ol/PluggableMap} map Map.
       * @api
       */
      Layer.prototype.setMap = function setMap (map) {
        if (this.mapPrecomposeKey_) {
          unlistenByKey(this.mapPrecomposeKey_);
          this.mapPrecomposeKey_ = null;
        }
        if (!map) {
          this.changed();
        }
        if (this.mapRenderKey_) {
          unlistenByKey(this.mapRenderKey_);
          this.mapRenderKey_ = null;
        }
        if (map) {
          this.mapPrecomposeKey_ = listen(map, RenderEventType.PRECOMPOSE, function(evt) {
            var layerState = this.getLayerState();
            layerState.managed = false;
            layerState.zIndex = Infinity;
            evt.frameState.layerStatesArray.push(layerState);
            evt.frameState.layerStates[getUid(this)] = layerState;
          }, this);
          this.mapRenderKey_ = listen(this, EventType.CHANGE, map.render, map);
          this.changed();
        }
      };

      /**
       * Set the layer source.
       * @param {module:ol/source/Source} source The layer source.
       * @observable
       * @api
       */
      Layer.prototype.setSource = function setSource (source) {
        this.set(LayerProperty.SOURCE, source);
      };

      return Layer;
    }(BaseLayer));

    /**
     * @module ol/layer/VectorRenderType
     */

    /**
     * @enum {string}
     * Render mode for vector layers:
     *  * `'image'`: Vector layers are rendered as images. Great performance, but
     *    point symbols and texts are always rotated with the view and pixels are
     *    scaled during zoom animations.
     *  * `'vector'`: Vector layers are rendered as vectors. Most accurate rendering
     *    even during animations, but slower performance.
     * @api
     */
    var VectorRenderType = {
      IMAGE: 'image',
      VECTOR: 'vector'
    };

    /**
     * @module ol/layer/Vector
     */


    /**
     * @enum {string}
     * @private
     */
    var Property$2 = {
      RENDER_ORDER: 'renderOrder'
    };


    /**
     * @classdesc
     * Vector data that is rendered client-side.
     * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
     * property on the layer object; for example, setting `title: 'My Title'` in the
     * options means that `title` is observable, and has get/set accessors.
     *
     * @api
     */
    var VectorLayer = (function (Layer$$1) {
      function VectorLayer(opt_options) {
        var options = opt_options ?
          opt_options : /** @type {module:ol/layer/Vector~Options} */ ({});

        var baseOptions = assign({}, options);

        delete baseOptions.style;
        delete baseOptions.renderBuffer;
        delete baseOptions.updateWhileAnimating;
        delete baseOptions.updateWhileInteracting;
        Layer$$1.call(this, baseOptions);

        /**
        * @private
        * @type {boolean}
        */
        this.declutter_ = options.declutter !== undefined ? options.declutter : false;

        /**
        * @type {number}
        * @private
        */
        this.renderBuffer_ = options.renderBuffer !== undefined ?
          options.renderBuffer : 100;

        /**
        * User provided style.
        * @type {module:ol/style/Style|Array.<module:ol/style/Style>|module:ol/style/Style~StyleFunction}
        * @private
        */
        this.style_ = null;

        /**
        * Style function for use within the library.
        * @type {module:ol/style/Style~StyleFunction|undefined}
        * @private
        */
        this.styleFunction_ = undefined;

        this.setStyle(options.style);

        /**
        * @type {boolean}
        * @private
        */
        this.updateWhileAnimating_ = options.updateWhileAnimating !== undefined ?
          options.updateWhileAnimating : false;

        /**
        * @type {boolean}
        * @private
        */
        this.updateWhileInteracting_ = options.updateWhileInteracting !== undefined ?
          options.updateWhileInteracting : false;

        /**
        * @private
        * @type {module:ol/layer/VectorTileRenderType|string}
        */
        this.renderMode_ = options.renderMode || VectorRenderType.VECTOR;

        /**
        * The layer type.
        * @protected
        * @type {module:ol/LayerType}
        */
        this.type = LayerType.VECTOR;

      }

      if ( Layer$$1 ) VectorLayer.__proto__ = Layer$$1;
      VectorLayer.prototype = Object.create( Layer$$1 && Layer$$1.prototype );
      VectorLayer.prototype.constructor = VectorLayer;

      /**
      * @return {boolean} Declutter.
      */
      VectorLayer.prototype.getDeclutter = function getDeclutter () {
        return this.declutter_;
      };

      /**
      * @param {boolean} declutter Declutter.
      */
      VectorLayer.prototype.setDeclutter = function setDeclutter (declutter) {
        this.declutter_ = declutter;
      };

      /**
      * @return {number|undefined} Render buffer.
      */
      VectorLayer.prototype.getRenderBuffer = function getRenderBuffer () {
        return this.renderBuffer_;
      };

      /**
      * @return {function(module:ol/Feature, module:ol/Feature): number|null|undefined} Render
      *     order.
      */
      VectorLayer.prototype.getRenderOrder = function getRenderOrder () {
        return (
        /** @type {module:ol/render~OrderFunction|null|undefined} */ (this.get(Property$2.RENDER_ORDER))
        );
      };

      /**
      * Get the style for features.  This returns whatever was passed to the `style`
      * option at construction or to the `setStyle` method.
      * @return {module:ol/style/Style|Array.<module:ol/style/Style>|module:ol/style/Style~StyleFunction}
      *     Layer style.
      * @api
      */
      VectorLayer.prototype.getStyle = function getStyle () {
        return this.style_;
      };

      /**
      * Get the style function.
      * @return {module:ol/style/Style~StyleFunction|undefined} Layer style function.
      * @api
      */
      VectorLayer.prototype.getStyleFunction = function getStyleFunction () {
        return this.styleFunction_;
      };

      /**
      * @return {boolean} Whether the rendered layer should be updated while
      *     animating.
      */
      VectorLayer.prototype.getUpdateWhileAnimating = function getUpdateWhileAnimating () {
        return this.updateWhileAnimating_;
      };

      /**
      * @return {boolean} Whether the rendered layer should be updated while
      *     interacting.
      */
      VectorLayer.prototype.getUpdateWhileInteracting = function getUpdateWhileInteracting () {
        return this.updateWhileInteracting_;
      };

      /**
      * @param {module:ol/render~OrderFunction|null|undefined} renderOrder
      *     Render order.
      */
      VectorLayer.prototype.setRenderOrder = function setRenderOrder (renderOrder) {
        this.set(Property$2.RENDER_ORDER, renderOrder);
      };

      /**
      * Set the style for features.  This can be a single style object, an array
      * of styles, or a function that takes a feature and resolution and returns
      * an array of styles. If it is `undefined` the default style is used. If
      * it is `null` the layer has no style (a `null` style), so only features
      * that have their own styles will be rendered in the layer. See
      * {@link module:ol/style} for information on the default style.
      * @param {module:ol/style/Style|Array.<module:ol/style/Style>|module:ol/style/Style~StyleFunction|null|undefined}
      *     style Layer style.
      * @api
      */
      VectorLayer.prototype.setStyle = function setStyle (style) {
        this.style_ = style !== undefined ? style : createDefaultStyle;
        this.styleFunction_ = style === null ?
          undefined : toFunction(this.style_);
        this.changed();
      };

      /**
      * @return {module:ol/layer/VectorRenderType|string} The render mode.
      */
      VectorLayer.prototype.getRenderMode = function getRenderMode () {
        return this.renderMode_;
      };

      return VectorLayer;
    }(Layer));


    /**
     * Return the associated {@link module:ol/source/Vector vectorsource} of the layer.
     * @function
     * @return {module:ol/source/Vector} Source.
     * @api
     */
    VectorLayer.prototype.getSource;

    /**
     * @module ol/style/IconAnchorUnits
     */

    /**
     * Icon anchor units. One of 'fraction', 'pixels'.
     * @enum {string}
     */
    var IconAnchorUnits = {
      FRACTION: 'fraction',
      PIXELS: 'pixels'
    };

    /**
     * @module ol/style/IconImageCache
     */

    /**
     * @classdesc
     * Singleton class. Available through {@link module:ol/style/IconImageCache~shared}.
     */
    var IconImageCache = function IconImageCache() {

      /**
      * @type {!Object.<string, module:ol/style/IconImage>}
      * @private
      */
      this.cache_ = {};

      /**
      * @type {number}
      * @private
      */
      this.cacheSize_ = 0;

      /**
      * @type {number}
      * @private
      */
      this.maxCacheSize_ = 32;
    };

    /**
    * FIXME empty description for jsdoc
    */
    IconImageCache.prototype.clear = function clear () {
      this.cache_ = {};
      this.cacheSize_ = 0;
    };

    /**
    * FIXME empty description for jsdoc
    */
    IconImageCache.prototype.expire = function expire () {
        var this$1 = this;

      if (this.cacheSize_ > this.maxCacheSize_) {
        var i = 0;
        for (var key in this$1.cache_) {
          var iconImage = this$1.cache_[key];
          if ((i++ & 3) === 0 && !iconImage.hasListener()) {
            delete this$1.cache_[key];
            --this$1.cacheSize_;
          }
        }
      }
    };

    /**
    * @param {string} src Src.
    * @param {?string} crossOrigin Cross origin.
    * @param {module:ol/color~Color} color Color.
    * @return {module:ol/style/IconImage} Icon image.
    */
    IconImageCache.prototype.get = function get (src, crossOrigin, color) {
      var key = getKey(src, crossOrigin, color);
      return key in this.cache_ ? this.cache_[key] : null;
    };

    /**
    * @param {string} src Src.
    * @param {?string} crossOrigin Cross origin.
    * @param {module:ol/color~Color} color Color.
    * @param {module:ol/style/IconImage} iconImage Icon image.
    */
    IconImageCache.prototype.set = function set (src, crossOrigin, color, iconImage) {
      var key = getKey(src, crossOrigin, color);
      this.cache_[key] = iconImage;
      ++this.cacheSize_;
    };

    /**
    * Set the cache size of the icon cache. Default is `32`. Change this value when
    * your map uses more than 32 different icon images and you are not caching icon
    * styles on the application level.
    * @param {number} maxCacheSize Cache max size.
    * @api
    */
    IconImageCache.prototype.setSize = function setSize (maxCacheSize) {
      this.maxCacheSize_ = maxCacheSize;
      this.expire();
    };


    /**
     * @param {string} src Src.
     * @param {?string} crossOrigin Cross origin.
     * @param {module:ol/color~Color} color Color.
     * @return {string} Cache key.
     */
    function getKey(src, crossOrigin, color) {
      var colorString = color ? asString(color) : 'null';
      return crossOrigin + ':' + src + ':' + colorString;
    }


    /**
     * The {@link module:ol/style/IconImageCache~IconImageCache} for
     * {@link module:ol/style/Icon~Icon} images.
     * @api
     */
    var shared = new IconImageCache();

    /**
     * @module ol/style/IconImage
     */

    var IconImage = (function (EventTarget$$1) {
      function IconImage(image, src, size, crossOrigin, imageState, color) {

        EventTarget$$1.call(this);

        /**
         * @private
         * @type {HTMLImageElement|HTMLCanvasElement}
         */
        this.hitDetectionImage_ = null;

        /**
         * @private
         * @type {HTMLImageElement|HTMLCanvasElement}
         */
        this.image_ = !image ? new Image() : image;

        if (crossOrigin !== null) {
          this.image_.crossOrigin = crossOrigin;
        }

        /**
         * @private
         * @type {HTMLCanvasElement}
         */
        this.canvas_ = color ?
          /** @type {HTMLCanvasElement} */ (document.createElement('CANVAS')) :
          null;

        /**
         * @private
         * @type {module:ol/color~Color}
         */
        this.color_ = color;

        /**
         * @private
         * @type {Array.<module:ol/events~EventsKey>}
         */
        this.imageListenerKeys_ = null;

        /**
         * @private
         * @type {module:ol/ImageState}
         */
        this.imageState_ = imageState;

        /**
         * @private
         * @type {module:ol/size~Size}
         */
        this.size_ = size;

        /**
         * @private
         * @type {string|undefined}
         */
        this.src_ = src;

        /**
         * @private
         * @type {boolean}
         */
        this.tainting_ = false;
        if (this.imageState_ == ImageState.LOADED) {
          this.determineTainting_();
        }

      }

      if ( EventTarget$$1 ) IconImage.__proto__ = EventTarget$$1;
      IconImage.prototype = Object.create( EventTarget$$1 && EventTarget$$1.prototype );
      IconImage.prototype.constructor = IconImage;

      /**
       * @private
       */
      IconImage.prototype.determineTainting_ = function determineTainting_ () {
        var context = createCanvasContext2D(1, 1);
        try {
          context.drawImage(this.image_, 0, 0);
          context.getImageData(0, 0, 1, 1);
        } catch (e) {
          this.tainting_ = true;
        }
      };

      /**
       * @private
       */
      IconImage.prototype.dispatchChangeEvent_ = function dispatchChangeEvent_ () {
        this.dispatchEvent(EventType.CHANGE);
      };

      /**
       * @private
       */
      IconImage.prototype.handleImageError_ = function handleImageError_ () {
        this.imageState_ = ImageState.ERROR;
        this.unlistenImage_();
        this.dispatchChangeEvent_();
      };

      /**
       * @private
       */
      IconImage.prototype.handleImageLoad_ = function handleImageLoad_ () {
        this.imageState_ = ImageState.LOADED;
        if (this.size_) {
          this.image_.width = this.size_[0];
          this.image_.height = this.size_[1];
        }
        this.size_ = [this.image_.width, this.image_.height];
        this.unlistenImage_();
        this.determineTainting_();
        this.replaceColor_();
        this.dispatchChangeEvent_();
      };

      /**
       * @param {number} pixelRatio Pixel ratio.
       * @return {HTMLImageElement|HTMLCanvasElement} Image or Canvas element.
       */
      IconImage.prototype.getImage = function getImage (pixelRatio) {
        return this.canvas_ ? this.canvas_ : this.image_;
      };

      /**
       * @return {module:ol/ImageState} Image state.
       */
      IconImage.prototype.getImageState = function getImageState () {
        return this.imageState_;
      };

      /**
       * @param {number} pixelRatio Pixel ratio.
       * @return {HTMLImageElement|HTMLCanvasElement} Image element.
       */
      IconImage.prototype.getHitDetectionImage = function getHitDetectionImage (pixelRatio) {
        if (!this.hitDetectionImage_) {
          if (this.tainting_) {
            var width = this.size_[0];
            var height = this.size_[1];
            var context = createCanvasContext2D(width, height);
            context.fillRect(0, 0, width, height);
            this.hitDetectionImage_ = context.canvas;
          } else {
            this.hitDetectionImage_ = this.image_;
          }
        }
        return this.hitDetectionImage_;
      };

      /**
       * @return {module:ol/size~Size} Image size.
       */
      IconImage.prototype.getSize = function getSize () {
        return this.size_;
      };

      /**
       * @return {string|undefined} Image src.
       */
      IconImage.prototype.getSrc = function getSrc () {
        return this.src_;
      };

      /**
       * Load not yet loaded URI.
       */
      IconImage.prototype.load = function load () {
        if (this.imageState_ == ImageState.IDLE) {
          this.imageState_ = ImageState.LOADING;
          this.imageListenerKeys_ = [
            listenOnce(this.image_, EventType.ERROR,
              this.handleImageError_, this),
            listenOnce(this.image_, EventType.LOAD,
              this.handleImageLoad_, this)
          ];
          try {
            this.image_.src = this.src_;
          } catch (e) {
            this.handleImageError_();
          }
        }
      };

      /**
       * @private
       */
      IconImage.prototype.replaceColor_ = function replaceColor_ () {
        if (this.tainting_ || this.color_ === null) {
          return;
        }

        this.canvas_.width = this.image_.width;
        this.canvas_.height = this.image_.height;

        var ctx = this.canvas_.getContext('2d');
        ctx.drawImage(this.image_, 0, 0);

        var imgData = ctx.getImageData(0, 0, this.image_.width, this.image_.height);
        var data = imgData.data;
        var r = this.color_[0] / 255.0;
        var g = this.color_[1] / 255.0;
        var b = this.color_[2] / 255.0;

        for (var i = 0, ii = data.length; i < ii; i += 4) {
          data[i] *= r;
          data[i + 1] *= g;
          data[i + 2] *= b;
        }
        ctx.putImageData(imgData, 0, 0);
      };

      /**
       * Discards event handlers which listen for load completion or errors.
       *
       * @private
       */
      IconImage.prototype.unlistenImage_ = function unlistenImage_ () {
        this.imageListenerKeys_.forEach(unlistenByKey);
        this.imageListenerKeys_ = null;
      };

      return IconImage;
    }(EventTarget));


    /**
     * @param {HTMLImageElement|HTMLCanvasElement} image Image.
     * @param {string} src Src.
     * @param {module:ol/size~Size} size Size.
     * @param {?string} crossOrigin Cross origin.
     * @param {module:ol/ImageState} imageState Image state.
     * @param {module:ol/color~Color} color Color.
     * @return {module:ol/style/IconImage} Icon image.
     */
    function get$3(image, src, size, crossOrigin, imageState, color) {
      var iconImage = shared.get(src, crossOrigin, color);
      if (!iconImage) {
        iconImage = new IconImage(image, src, size, crossOrigin, imageState, color);
        shared.set(src, crossOrigin, color, iconImage);
      }
      return iconImage;
    }

    /**
     * @module ol/style/IconOrigin
     */

    /**
     * Icon origin. One of 'bottom-left', 'bottom-right', 'top-left', 'top-right'.
     * @enum {string}
     */
    var IconOrigin = {
      BOTTOM_LEFT: 'bottom-left',
      BOTTOM_RIGHT: 'bottom-right',
      TOP_LEFT: 'top-left',
      TOP_RIGHT: 'top-right'
    };

    /**
     * @module ol/style/Icon
     */


    /**
     * @typedef {Object} Options
     * @property {Array.<number>} [anchor=[0.5, 0.5]] Anchor. Default value is the icon center.
     * @property {module:ol/style/IconOrigin} [anchorOrigin] Origin of the anchor: `bottom-left`, `bottom-right`,
     * `top-left` or `top-right`. Default is `top-left`.
     * @property {module:ol/style/IconAnchorUnits} [anchorXUnits] Units in which the anchor x value is
     * specified. A value of `'fraction'` indicates the x value is a fraction of the icon. A value of `'pixels'` indicates
     * the x value in pixels. Default is `'fraction'`.
     * @property {module:ol/style/IconAnchorUnits} [anchorYUnits] Units in which the anchor y value is
     * specified. A value of `'fraction'` indicates the y value is a fraction of the icon. A value of `'pixels'` indicates
     * the y value in pixels. Default is `'fraction'`.
     * @property {module:ol/color~Color|string} [color] Color to tint the icon. If not specified,
     * the icon will be left as is.
     * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images. Note that you must provide a
     * `crossOrigin` value if you are using the WebGL renderer or if you want to access pixel data with the Canvas renderer.
     * See https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image for more detail.
     * @property {HTMLImageElement|HTMLCanvasElement} [img] Image object for the icon. If the `src` option is not provided then the
     * provided image must already be loaded. And in that case, it is required
     * to provide the size of the image, with the `imgSize` option.
     * @property {Array.<number>} [offset=[0, 0]] Offset, which, together with the size and the offset origin, define the
     * sub-rectangle to use from the original icon image.
     * @property {module:ol/style/IconOrigin} [offsetOrigin] Origin of the offset: `bottom-left`, `bottom-right`,
     * `top-left` or `top-right`. Default is `top-left`.
     * @property {number} [opacity=1] Opacity of the icon.
     * @property {number} [scale=1] Scale.
     * @property {boolean} [snapToPixel=true] If `true` integral numbers of pixels are used as the X and Y pixel coordinate
     * when drawing the icon in the output canvas. If `false` fractional numbers may be used. Using `true` allows for
     * "sharp" rendering (no blur), while using `false` allows for "accurate" rendering. Note that accuracy is important if
     * the icon's position is animated. Without it, the icon may jitter noticeably.
     * @property {boolean} [rotateWithView=false] Whether to rotate the icon with the view.
     * @property {number} [rotation=0] Rotation in radians (positive rotation clockwise).
     * @property {module:ol/size~Size} [size] Icon size in pixel. Can be used together with `offset` to define the
     * sub-rectangle to use from the origin (sprite) icon image.
     * @property {module:ol/size~Size} [imgSize] Image size in pixels. Only required if `img` is set and `src` is not, and
     * for SVG images in Internet Explorer 11. The provided `imgSize` needs to match the actual size of the image.
     * @property {string} [src] Image source URI.
     */


    /**
     * @classdesc
     * Set icon style for vector features.
     * @api
     */
    var Icon = (function (ImageStyle$$1) {
      function Icon(opt_options) {
        var options = opt_options || {};

        /**
         * @type {number}
         */
        var opacity = options.opacity !== undefined ? options.opacity : 1;

        /**
         * @type {number}
         */
        var rotation = options.rotation !== undefined ? options.rotation : 0;

        /**
         * @type {number}
         */
        var scale = options.scale !== undefined ? options.scale : 1;

        /**
         * @type {boolean}
         */
        var rotateWithView = options.rotateWithView !== undefined ?
          options.rotateWithView : false;

        /**
         * @type {boolean}
         */
        var snapToPixel = options.snapToPixel !== undefined ?
          options.snapToPixel : true;

        ImageStyle$$1.call(this, {
          opacity: opacity,
          rotation: rotation,
          scale: scale,
          snapToPixel: snapToPixel,
          rotateWithView: rotateWithView
        });

        /**
         * @private
         * @type {Array.<number>}
         */
        this.anchor_ = options.anchor !== undefined ? options.anchor : [0.5, 0.5];

        /**
         * @private
         * @type {Array.<number>}
         */
        this.normalizedAnchor_ = null;

        /**
         * @private
         * @type {module:ol/style/IconOrigin}
         */
        this.anchorOrigin_ = options.anchorOrigin !== undefined ?
          options.anchorOrigin : IconOrigin.TOP_LEFT;

        /**
         * @private
         * @type {module:ol/style/IconAnchorUnits}
         */
        this.anchorXUnits_ = options.anchorXUnits !== undefined ?
          options.anchorXUnits : IconAnchorUnits.FRACTION;

        /**
         * @private
         * @type {module:ol/style/IconAnchorUnits}
         */
        this.anchorYUnits_ = options.anchorYUnits !== undefined ?
          options.anchorYUnits : IconAnchorUnits.FRACTION;

        /**
         * @private
         * @type {?string}
         */
        this.crossOrigin_ =
            options.crossOrigin !== undefined ? options.crossOrigin : null;

        /**
         * @type {HTMLImageElement|HTMLCanvasElement}
         */
        var image = options.img !== undefined ? options.img : null;

        /**
         * @type {module:ol/size~Size}
         */
        var imgSize = options.imgSize !== undefined ? options.imgSize : null;

        /**
         * @type {string|undefined}
         */
        var src = options.src;

        assert(!(src !== undefined && image),
          4); // `image` and `src` cannot be provided at the same time
        assert(!image || (image && imgSize),
          5); // `imgSize` must be set when `image` is provided

        if ((src === undefined || src.length === 0) && image) {
          src = image.src || getUid(image).toString();
        }
        assert(src !== undefined && src.length > 0,
          6); // A defined and non-empty `src` or `image` must be provided

        /**
         * @type {module:ol/ImageState}
         */
        var imageState = options.src !== undefined ?
          ImageState.IDLE : ImageState.LOADED;

        /**
         * @private
         * @type {module:ol/color~Color}
         */
        this.color_ = options.color !== undefined ? asArray(options.color) : null;

        /**
         * @private
         * @type {module:ol/style/IconImage}
         */
        this.iconImage_ = get$3(
          image, /** @type {string} */ (src), imgSize, this.crossOrigin_, imageState, this.color_);

        /**
         * @private
         * @type {Array.<number>}
         */
        this.offset_ = options.offset !== undefined ? options.offset : [0, 0];

        /**
         * @private
         * @type {module:ol/style/IconOrigin}
         */
        this.offsetOrigin_ = options.offsetOrigin !== undefined ?
          options.offsetOrigin : IconOrigin.TOP_LEFT;

        /**
         * @private
         * @type {Array.<number>}
         */
        this.origin_ = null;

        /**
         * @private
         * @type {module:ol/size~Size}
         */
        this.size_ = options.size !== undefined ? options.size : null;

      }

      if ( ImageStyle$$1 ) Icon.__proto__ = ImageStyle$$1;
      Icon.prototype = Object.create( ImageStyle$$1 && ImageStyle$$1.prototype );
      Icon.prototype.constructor = Icon;

      /**
       * Clones the style. The underlying Image/HTMLCanvasElement is not cloned.
       * @return {module:ol/style/Icon} The cloned style.
       * @api
       */
      Icon.prototype.clone = function clone () {
        return new Icon({
          anchor: this.anchor_.slice(),
          anchorOrigin: this.anchorOrigin_,
          anchorXUnits: this.anchorXUnits_,
          anchorYUnits: this.anchorYUnits_,
          crossOrigin: this.crossOrigin_,
          color: (this.color_ && this.color_.slice) ? this.color_.slice() : this.color_ || undefined,
          src: this.getSrc(),
          offset: this.offset_.slice(),
          offsetOrigin: this.offsetOrigin_,
          size: this.size_ !== null ? this.size_.slice() : undefined,
          opacity: this.getOpacity(),
          scale: this.getScale(),
          snapToPixel: this.getSnapToPixel(),
          rotation: this.getRotation(),
          rotateWithView: this.getRotateWithView()
        });
      };

      /**
       * @inheritDoc
       * @api
       */
      Icon.prototype.getAnchor = function getAnchor () {
        if (this.normalizedAnchor_) {
          return this.normalizedAnchor_;
        }
        var anchor = this.anchor_;
        var size = this.getSize();
        if (this.anchorXUnits_ == IconAnchorUnits.FRACTION ||
            this.anchorYUnits_ == IconAnchorUnits.FRACTION) {
          if (!size) {
            return null;
          }
          anchor = this.anchor_.slice();
          if (this.anchorXUnits_ == IconAnchorUnits.FRACTION) {
            anchor[0] *= size[0];
          }
          if (this.anchorYUnits_ == IconAnchorUnits.FRACTION) {
            anchor[1] *= size[1];
          }
        }

        if (this.anchorOrigin_ != IconOrigin.TOP_LEFT) {
          if (!size) {
            return null;
          }
          if (anchor === this.anchor_) {
            anchor = this.anchor_.slice();
          }
          if (this.anchorOrigin_ == IconOrigin.TOP_RIGHT ||
              this.anchorOrigin_ == IconOrigin.BOTTOM_RIGHT) {
            anchor[0] = -anchor[0] + size[0];
          }
          if (this.anchorOrigin_ == IconOrigin.BOTTOM_LEFT ||
              this.anchorOrigin_ == IconOrigin.BOTTOM_RIGHT) {
            anchor[1] = -anchor[1] + size[1];
          }
        }
        this.normalizedAnchor_ = anchor;
        return this.normalizedAnchor_;
      };

      /**
       * Set the anchor point. The anchor determines the center point for the
       * symbolizer.
       *
       * @param {Array.<number>} anchor Anchor.
       * @api
       */
      Icon.prototype.setAnchor = function setAnchor (anchor) {
        this.anchor_ = anchor;
        this.normalizedAnchor_ = null;
      };

      /**
       * Get the icon color.
       * @return {module:ol/color~Color} Color.
       * @api
       */
      Icon.prototype.getColor = function getColor () {
        return this.color_;
      };

      /**
       * Get the image icon.
       * @param {number} pixelRatio Pixel ratio.
       * @return {HTMLImageElement|HTMLCanvasElement} Image or Canvas element.
       * @override
       * @api
       */
      Icon.prototype.getImage = function getImage (pixelRatio) {
        return this.iconImage_.getImage(pixelRatio);
      };

      /**
       * @override
       */
      Icon.prototype.getImageSize = function getImageSize () {
        return this.iconImage_.getSize();
      };

      /**
       * @override
       */
      Icon.prototype.getHitDetectionImageSize = function getHitDetectionImageSize () {
        return this.getImageSize();
      };

      /**
       * @override
       */
      Icon.prototype.getImageState = function getImageState () {
        return this.iconImage_.getImageState();
      };

      /**
       * @override
       */
      Icon.prototype.getHitDetectionImage = function getHitDetectionImage (pixelRatio) {
        return this.iconImage_.getHitDetectionImage(pixelRatio);
      };

      /**
       * @inheritDoc
       * @api
       */
      Icon.prototype.getOrigin = function getOrigin () {
        if (this.origin_) {
          return this.origin_;
        }
        var offset = this.offset_;

        if (this.offsetOrigin_ != IconOrigin.TOP_LEFT) {
          var size = this.getSize();
          var iconImageSize = this.iconImage_.getSize();
          if (!size || !iconImageSize) {
            return null;
          }
          offset = offset.slice();
          if (this.offsetOrigin_ == IconOrigin.TOP_RIGHT ||
              this.offsetOrigin_ == IconOrigin.BOTTOM_RIGHT) {
            offset[0] = iconImageSize[0] - size[0] - offset[0];
          }
          if (this.offsetOrigin_ == IconOrigin.BOTTOM_LEFT ||
              this.offsetOrigin_ == IconOrigin.BOTTOM_RIGHT) {
            offset[1] = iconImageSize[1] - size[1] - offset[1];
          }
        }
        this.origin_ = offset;
        return this.origin_;
      };

      /**
       * Get the image URL.
       * @return {string|undefined} Image src.
       * @api
       */
      Icon.prototype.getSrc = function getSrc () {
        return this.iconImage_.getSrc();
      };

      /**
       * @inheritDoc
       * @api
       */
      Icon.prototype.getSize = function getSize () {
        return !this.size_ ? this.iconImage_.getSize() : this.size_;
      };

      /**
       * @override
       */
      Icon.prototype.listenImageChange = function listenImageChange (listener, thisArg) {
        return listen(this.iconImage_, EventType.CHANGE,
          listener, thisArg);
      };

      /**
       * Load not yet loaded URI.
       * When rendering a feature with an icon style, the vector renderer will
       * automatically call this method. However, you might want to call this
       * method yourself for preloading or other purposes.
       * @override
       * @api
       */
      Icon.prototype.load = function load () {
        this.iconImage_.load();
      };

      /**
       * @override
       */
      Icon.prototype.unlistenImageChange = function unlistenImageChange (listener, thisArg) {
        unlisten(this.iconImage_, EventType.CHANGE,
          listener, thisArg);
      };

      return Icon;
    }(ImageStyle));

    /**
     * @module ol/layer/Heatmap
     */


    /**
     * @typedef {Object} Options
     * @property {number} [opacity=1] Opacity (0, 1).
     * @property {boolean} [visible=true] Visibility.
     * @property {module:ol/extent~Extent} [extent] The bounding extent for layer rendering.  The layer will not be
     * rendered outside of this extent.
     * @property {number} [zIndex=0] The z-index for layer rendering.  At rendering time, the layers
     * will be ordered, first by Z-index and then by position.
     * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
     * visible.
     * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
     * be visible.
     * @property {Array.<string>} [gradient=['#00f', '#0ff', '#0f0', '#ff0', '#f00']] The color gradient
     * of the heatmap, specified as an array of CSS color strings.
     * @property {number} [radius=8] Radius size in pixels.
     * @property {number} [blur=15] Blur size in pixels.
     * @property {number} [shadow=250] Shadow size in pixels.
     * @property {string|function(module:ol/Feature):number} [weight='weight'] The feature
     * attribute to use for the weight or a function that returns a weight from a feature. Weight values
     * should range from 0 to 1 (and values outside will be clamped to that range).
     * @property {module:ol/layer/VectorRenderType|string} [renderMode='vector'] Render mode for vector layers:
     *  * `'image'`: Vector layers are rendered as images. Great performance, but point symbols and
     *    texts are always rotated with the view and pixels are scaled during zoom animations.
     *  * `'vector'`: Vector layers are rendered as vectors. Most accurate rendering even during
     *    animations, but slower performance.
     * @property {module:ol/source/Vector} [source] Source.
     */


    /**
     * @enum {string}
     * @private
     */
    var Property$3 = {
      BLUR: 'blur',
      GRADIENT: 'gradient',
      RADIUS: 'radius'
    };


    /**
     * @const
     * @type {Array.<string>}
     */
    var DEFAULT_GRADIENT = ['#00f', '#0ff', '#0f0', '#ff0', '#f00'];


    /**
     * @classdesc
     * Layer for rendering vector data as a heatmap.
     * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
     * property on the layer object; for example, setting `title: 'My Title'` in the
     * options means that `title` is observable, and has get/set accessors.
     *
     * @fires module:ol/render/Event~RenderEvent
     * @api
     */
    var Heatmap = (function (VectorLayer$$1) {
      function Heatmap(opt_options) {
        var options = opt_options ? opt_options : {};

        var baseOptions = assign({}, options);

        delete baseOptions.gradient;
        delete baseOptions.radius;
        delete baseOptions.blur;
        delete baseOptions.shadow;
        delete baseOptions.weight;
        VectorLayer$$1.call(this, baseOptions);

        /**
         * @private
         * @type {Uint8ClampedArray}
         */
        this.gradient_ = null;

        /**
         * @private
         * @type {number}
         */
        this.shadow_ = options.shadow !== undefined ? options.shadow : 250;

        /**
         * @private
         * @type {string|undefined}
         */
        this.circleImage_ = undefined;

        /**
         * @private
         * @type {Array.<Array.<module:ol/style/Style>>}
         */
        this.styleCache_ = null;

        listen(this,
          getChangeEventType(Property$3.GRADIENT),
          this.handleGradientChanged_, this);

        this.setGradient(options.gradient ? options.gradient : DEFAULT_GRADIENT);

        this.setBlur(options.blur !== undefined ? options.blur : 15);

        this.setRadius(options.radius !== undefined ? options.radius : 8);

        listen(this,
          getChangeEventType(Property$3.BLUR),
          this.handleStyleChanged_, this);
        listen(this,
          getChangeEventType(Property$3.RADIUS),
          this.handleStyleChanged_, this);

        this.handleStyleChanged_();

        var weight = options.weight ? options.weight : 'weight';
        var weightFunction;
        if (typeof weight === 'string') {
          weightFunction = function(feature) {
            return feature.get(weight);
          };
        } else {
          weightFunction = weight;
        }

        this.setStyle(function(feature, resolution) {
          var weight = weightFunction(feature);
          var opacity = weight !== undefined ? clamp(weight, 0, 1) : 1;
          // cast to 8 bits
          var index = (255 * opacity) | 0;
          var style = this.styleCache_[index];
          if (!style) {
            style = [
              new Style({
                image: new Icon({
                  opacity: opacity,
                  src: this.circleImage_
                })
              })
            ];
            this.styleCache_[index] = style;
          }
          return style;
        }.bind(this));

        // For performance reasons, don't sort the features before rendering.
        // The render order is not relevant for a heatmap representation.
        this.setRenderOrder(null);

        listen(this, RenderEventType.RENDER, this.handleRender_, this);
      }

      if ( VectorLayer$$1 ) Heatmap.__proto__ = VectorLayer$$1;
      Heatmap.prototype = Object.create( VectorLayer$$1 && VectorLayer$$1.prototype );
      Heatmap.prototype.constructor = Heatmap;

      /**
       * @return {string} Data URL for a circle.
       * @private
       */
      Heatmap.prototype.createCircle_ = function createCircle_ () {
        var radius = this.getRadius();
        var blur = this.getBlur();
        var halfSize = radius + blur + 1;
        var size = 2 * halfSize;
        var context = createCanvasContext2D(size, size);
        context.shadowOffsetX = context.shadowOffsetY = this.shadow_;
        context.shadowBlur = blur;
        context.shadowColor = '#000';
        context.beginPath();
        var center = halfSize - this.shadow_;
        context.arc(center, center, radius, 0, Math.PI * 2, true);
        context.fill();
        return context.canvas.toDataURL();
      };

      /**
       * Return the blur size in pixels.
       * @return {number} Blur size in pixels.
       * @api
       * @observable
       */
      Heatmap.prototype.getBlur = function getBlur () {
        return /** @type {number} */ (this.get(Property$3.BLUR));
      };

      /**
       * Return the gradient colors as array of strings.
       * @return {Array.<string>} Colors.
       * @api
       * @observable
       */
      Heatmap.prototype.getGradient = function getGradient () {
        return /** @type {Array.<string>} */ (this.get(Property$3.GRADIENT));
      };

      /**
       * Return the size of the radius in pixels.
       * @return {number} Radius size in pixel.
       * @api
       * @observable
       */
      Heatmap.prototype.getRadius = function getRadius () {
        return /** @type {number} */ (this.get(Property$3.RADIUS));
      };

      /**
       * @private
       */
      Heatmap.prototype.handleGradientChanged_ = function handleGradientChanged_ () {
        this.gradient_ = createGradient(this.getGradient());
      };

      /**
       * @private
       */
      Heatmap.prototype.handleStyleChanged_ = function handleStyleChanged_ () {
        this.circleImage_ = this.createCircle_();
        this.styleCache_ = new Array(256);
        this.changed();
      };

      /**
       * @param {module:ol/render/Event} event Post compose event
       * @private
       */
      Heatmap.prototype.handleRender_ = function handleRender_ (event) {
        var this$1 = this;

        var context = event.context;
        var canvas = context.canvas;
        var image = context.getImageData(0, 0, canvas.width, canvas.height);
        var view8 = image.data;
        for (var i = 0, ii = view8.length; i < ii; i += 4) {
          var alpha = view8[i + 3] * 4;
          if (alpha) {
            view8[i] = this$1.gradient_[alpha];
            view8[i + 1] = this$1.gradient_[alpha + 1];
            view8[i + 2] = this$1.gradient_[alpha + 2];
          }
        }
        context.putImageData(image, 0, 0);
      };

      /**
       * Set the blur size in pixels.
       * @param {number} blur Blur size in pixels.
       * @api
       * @observable
       */
      Heatmap.prototype.setBlur = function setBlur (blur) {
        this.set(Property$3.BLUR, blur);
      };

      /**
       * Set the gradient colors as array of strings.
       * @param {Array.<string>} colors Gradient.
       * @api
       * @observable
       */
      Heatmap.prototype.setGradient = function setGradient (colors) {
        this.set(Property$3.GRADIENT, colors);
      };

      /**
       * Set the size of the radius in pixels.
       * @param {number} radius Radius size in pixel.
       * @api
       * @observable
       */
      Heatmap.prototype.setRadius = function setRadius (radius) {
        this.set(Property$3.RADIUS, radius);
      };

      return Heatmap;
    }(VectorLayer));


    /**
     * @param {Array.<string>} colors A list of colored.
     * @return {Uint8ClampedArray} An array.
     */
    function createGradient(colors) {
      var width = 1;
      var height = 256;
      var context = createCanvasContext2D(width, height);

      var gradient = context.createLinearGradient(0, 0, width, height);
      var step = 1 / (colors.length - 1);
      for (var i = 0, ii = colors.length; i < ii; ++i) {
        gradient.addColorStop(i * step, colors[i]);
      }

      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      return context.getImageData(0, 0, width, height).data;
    }

    /**
     * @module ol/layer/Image
     */


    /**
     * @typedef {Object} Options
     * @property {number} [opacity=1] Opacity (0, 1).
     * @property {boolean} [visible=true] Visibility.
     * @property {module:ol/extent~Extent} [extent] The bounding extent for layer rendering.  The layer will not be
     * rendered outside of this extent.
     * @property {number} [zIndex=0] The z-index for layer rendering.  At rendering time, the layers
     * will be ordered, first by Z-index and then by position.
     * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
     * visible.
     * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
     * be visible.
     * @property {module:ol/PluggableMap} [map] Sets the layer as overlay on a map. The map will not manage
     * this layer in its layers collection, and the layer will be rendered on top. This is useful for
     * temporary layers. The standard way to add a layer to a map and have it managed by the map is to
     * use {@link module:ol/Map#addLayer}.
     * @property {module:ol/source/Image} [source] Source for this layer.
     */


    /**
     * @classdesc
     * Server-rendered images that are available for arbitrary extents and
     * resolutions.
     * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
     * property on the layer object; for example, setting `title: 'My Title'` in the
     * options means that `title` is observable, and has get/set accessors.
     *
     * @fires module:ol/render/Event~RenderEvent
     * @api
     */
    var ImageLayer$1 = (function (Layer$$1) {
      function ImageLayer$$1(opt_options) {
        var options = opt_options ? opt_options : {};
        Layer$$1.call(this, options);

        /**
         * The layer type.
         * @protected
         * @type {module:ol/LayerType}
         */
        this.type = LayerType.IMAGE;

      }

      if ( Layer$$1 ) ImageLayer$$1.__proto__ = Layer$$1;
      ImageLayer$$1.prototype = Object.create( Layer$$1 && Layer$$1.prototype );
      ImageLayer$$1.prototype.constructor = ImageLayer$$1;

      return ImageLayer$$1;
    }(Layer));


    /**
     * Return the associated {@link module:ol/source/Image source} of the image layer.
     * @function
     * @return {module:ol/source/Image} Source.
     * @api
     */
    ImageLayer$1.prototype.getSource;

    /**
     * @module ol/layer/TileProperty
     */

    /**
     * @enum {string}
     */
    var TileProperty = {
      PRELOAD: 'preload',
      USE_INTERIM_TILES_ON_ERROR: 'useInterimTilesOnError'
    };

    /**
     * @module ol/layer/Tile
     */


    /**
     * @typedef {Object} Options
     * @property {number} [opacity=1] Opacity (0, 1).
     * @property {boolean} [visible=true] Visibility.
     * @property {module:ol/extent~Extent} [extent] The bounding extent for layer rendering.  The layer will not be
     * rendered outside of this extent.
     * @property {number} [zIndex=0] The z-index for layer rendering.  At rendering time, the layers
     * will be ordered, first by Z-index and then by position.
     * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
     * visible.
     * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
     * be visible.
     * @property {number} [preload=0] Preload. Load low-resolution tiles up to `preload` levels. `0`
     * means no preloading.
     * @property {module:ol/source/Tile} [source] Source for this layer.
     * @property {module:ol/PluggableMap} [map] Sets the layer as overlay on a map. The map will not manage
     * this layer in its layers collection, and the layer will be rendered on top. This is useful for
     * temporary layers. The standard way to add a layer to a map and have it managed by the map is to
     * use {@link module:ol/Map#addLayer}.
     * @property {boolean} [useInterimTilesOnError=true] Use interim tiles on error.
     */

    /**
     * @classdesc
     * For layer sources that provide pre-rendered, tiled images in grids that are
     * organized by zoom levels for specific resolutions.
     * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
     * property on the layer object; for example, setting `title: 'My Title'` in the
     * options means that `title` is observable, and has get/set accessors.
     *
     * @api
     */
    var TileLayer$1 = (function (Layer$$1) {
      function TileLayer$$1(opt_options) {
        var options = opt_options ? opt_options : {};

        var baseOptions = assign({}, options);

        delete baseOptions.preload;
        delete baseOptions.useInterimTilesOnError;
        Layer$$1.call(this, baseOptions);

        this.setPreload(options.preload !== undefined ? options.preload : 0);
        this.setUseInterimTilesOnError(options.useInterimTilesOnError !== undefined ?
          options.useInterimTilesOnError : true);

        /**
        * The layer type.
        * @protected
        * @type {module:ol/LayerType}
        */
        this.type = LayerType.TILE;

      }

      if ( Layer$$1 ) TileLayer$$1.__proto__ = Layer$$1;
      TileLayer$$1.prototype = Object.create( Layer$$1 && Layer$$1.prototype );
      TileLayer$$1.prototype.constructor = TileLayer$$1;

      /**
      * Return the level as number to which we will preload tiles up to.
      * @return {number} The level to preload tiles up to.
      * @observable
      * @api
      */
      TileLayer$$1.prototype.getPreload = function getPreload () {
        return /** @type {number} */ (this.get(TileProperty.PRELOAD));
      };

      /**
      * Set the level as number to which we will preload tiles up to.
      * @param {number} preload The level to preload tiles up to.
      * @observable
      * @api
      */
      TileLayer$$1.prototype.setPreload = function setPreload (preload) {
        this.set(TileProperty.PRELOAD, preload);
      };

      /**
      * Whether we use interim tiles on error.
      * @return {boolean} Use interim tiles on error.
      * @observable
      * @api
      */
      TileLayer$$1.prototype.getUseInterimTilesOnError = function getUseInterimTilesOnError () {
        return /** @type {boolean} */ (this.get(TileProperty.USE_INTERIM_TILES_ON_ERROR));
      };

      /**
      * Set whether we use interim tiles on error.
      * @param {boolean} useInterimTilesOnError Use interim tiles on error.
      * @observable
      * @api
      */
      TileLayer$$1.prototype.setUseInterimTilesOnError = function setUseInterimTilesOnError (useInterimTilesOnError) {
        this.set(TileProperty.USE_INTERIM_TILES_ON_ERROR, useInterimTilesOnError);
      };

      return TileLayer$$1;
    }(Layer));


    /**
     * Return the associated {@link module:ol/source/Tile tilesource} of the layer.
     * @function
     * @return {module:ol/source/Tile} Source.
     * @api
     */
    TileLayer$1.prototype.getSource;

    /**
     * @module ol/layer/VectorTileRenderType
     */

    /**
     * @enum {string}
     * Render mode for vector tiles:
     *  * `'image'`: Vector tiles are rendered as images. Great performance, but
     *    point symbols and texts are always rotated with the view and pixels are
     *    scaled during zoom animations.
     *  * `'hybrid'`: Polygon and line elements are rendered as images, so pixels
     *    are scaled during zoom animations. Point symbols and texts are accurately
     *    rendered as vectors and can stay upright on rotated views.
     *  * `'vector'`: Vector tiles are rendered as vectors. Most accurate rendering
     *    even during animations, but slower performance than the other options.
     * @api
     */
    var VectorTileRenderType = {
      IMAGE: 'image',
      HYBRID: 'hybrid',
      VECTOR: 'vector'
    };

    /**
     * @module ol/layer/VectorTile
     */


    /**
     * @typedef {Object} Options
     * @property {number} [opacity=1] Opacity (0, 1).
     * @property {boolean} [visible=true] Visibility.
     * @property {module:ol/extent~Extent} [extent] The bounding extent for layer rendering.  The layer will not be
     * rendered outside of this extent.
     * @property {number} [zIndex=0] The z-index for layer rendering.  At rendering time, the layers
     * will be ordered, first by Z-index and then by position.
     * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
     * visible.
     * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
     * be visible.
     * @property {module:ol/render~OrderFunction} [renderOrder] Render order. Function to be used when sorting
     * features before rendering. By default features are drawn in the order that they are created. Use
     * `null` to avoid the sort, but get an undefined draw order.
     * @property {number} [renderBuffer=100] The buffer in pixels around the tile extent used by the
     * renderer when getting features from the vector tile for the rendering or hit-detection.
     * Recommended value: Vector tiles are usually generated with a buffer, so this value should match
     * the largest possible buffer of the used tiles. It should be at least the size of the largest
     * point symbol or line width.
     * @property {module:ol/layer/VectorTileRenderType|string} [renderMode='hybrid'] Render mode for vector tiles:
     *  * `'image'`: Vector tiles are rendered as images. Great performance, but point symbols and texts
     *    are always rotated with the view and pixels are scaled during zoom animations.
     *  * `'hybrid'`: Polygon and line elements are rendered as images, so pixels are scaled during zoom
     *    animations. Point symbols and texts are accurately rendered as vectors and can stay upright on
     *    rotated views.
     *  * `'vector'`: Vector tiles are rendered as vectors. Most accurate rendering even during
     *    animations, but slower performance than the other options.
     *
     * When `declutter` is set to `true`, `'hybrid'` will be used instead of `'image'`.
     * @property {module:ol/source/VectorTile} [source] Source.
     * @property {module:ol/PluggableMap} [map] Sets the layer as overlay on a map. The map will not manage
     * this layer in its layers collection, and the layer will be rendered on top. This is useful for
     * temporary layers. The standard way to add a layer to a map and have it managed by the map is to
     * use {@link module:ol/Map#addLayer}.
     * @property {boolean} [declutter=false] Declutter images and text. Decluttering is applied to all
     * image and text styles, and the priority is defined by the z-index of the style. Lower z-index
     * means higher priority. When set to `true`, a `renderMode` of `'image'` will be overridden with
     * `'hybrid'`.
     * @property {module:ol/style/Style|Array.<module:ol/style/Style>|module:ol/style/Style~StyleFunction} [style] Layer style. See
     * {@link module:ol/style} for default style which will be used if this is not defined.
     * @property {boolean} [updateWhileAnimating=false] When set to `true`, feature batches will be
     * recreated during animations. This means that no vectors will be shown clipped, but the setting
     * will have a performance impact for large amounts of vector data. When set to `false`, batches
     * will be recreated when no animation is active.
     * @property {boolean} [updateWhileInteracting=false] When set to `true`, feature batches will be
     * recreated during interactions. See also `updateWhileAnimating`.
     * @property {number} [preload=0] Preload. Load low-resolution tiles up to `preload` levels. `0`
     * means no preloading.
     * @property {module:ol/render~OrderFunction} [renderOrder] Render order. Function to be used when sorting
     * features before rendering. By default features are drawn in the order that they are created.
     * @property {(module:ol/style/Style|Array.<module:ol/style/Style>|module:ol/style/Style~StyleFunction)} [style] Layer style. See
     * {@link module:ol/style} for default style which will be used if this is not defined.
     * @property {boolean} [useInterimTilesOnError=true] Use interim tiles on error.
     */


    /**
     * @classdesc
     * Layer for vector tile data that is rendered client-side.
     * Note that any property set in the options is set as a {@link module:ol/Object~BaseObject}
     * property on the layer object; for example, setting `title: 'My Title'` in the
     * options means that `title` is observable, and has get/set accessors.
     *
     * @param {module:ol/layer/VectorTile~Options=} opt_options Options.
     * @api
     */
    var VectorTileLayer = (function (VectorLayer$$1) {
      function VectorTileLayer(opt_options) {
        var options = opt_options ? opt_options : {};

        var renderMode = options.renderMode || VectorTileRenderType.HYBRID;
        assert(renderMode == undefined ||
           renderMode == VectorTileRenderType.IMAGE ||
           renderMode == VectorTileRenderType.HYBRID ||
           renderMode == VectorTileRenderType.VECTOR,
        28); // `renderMode` must be `'image'`, `'hybrid'` or `'vector'`
        if (options.declutter && renderMode == VectorTileRenderType.IMAGE) {
          renderMode = VectorTileRenderType.HYBRID;
        }
        options.renderMode = renderMode;

        var baseOptions = assign({}, options);

        delete baseOptions.preload;
        delete baseOptions.useInterimTilesOnError;
        VectorLayer$$1.call(this, baseOptions);

        this.setPreload(options.preload ? options.preload : 0);
        this.setUseInterimTilesOnError(options.useInterimTilesOnError !== undefined ?
          options.useInterimTilesOnError : true);

        /**
        * The layer type.
        * @protected
        * @type {module:ol/LayerType}
        */
        this.type = LayerType.VECTOR_TILE;

      }

      if ( VectorLayer$$1 ) VectorTileLayer.__proto__ = VectorLayer$$1;
      VectorTileLayer.prototype = Object.create( VectorLayer$$1 && VectorLayer$$1.prototype );
      VectorTileLayer.prototype.constructor = VectorTileLayer;

      /**
      * Return the level as number to which we will preload tiles up to.
      * @return {number} The level to preload tiles up to.
      * @observable
      * @api
      */
      VectorTileLayer.prototype.getPreload = function getPreload () {
        return /** @type {number} */ (this.get(TileProperty.PRELOAD));
      };

      /**
      * Whether we use interim tiles on error.
      * @return {boolean} Use interim tiles on error.
      * @observable
      * @api
      */
      VectorTileLayer.prototype.getUseInterimTilesOnError = function getUseInterimTilesOnError () {
        return /** @type {boolean} */ (this.get(TileProperty.USE_INTERIM_TILES_ON_ERROR));
      };

      /**
      * Set the level as number to which we will preload tiles up to.
      * @param {number} preload The level to preload tiles up to.
      * @observable
      * @api
      */
      VectorTileLayer.prototype.setPreload = function setPreload (preload) {
        this.set(TileProperty.PRELOAD, preload);
      };

      /**
      * Set whether we use interim tiles on error.
      * @param {boolean} useInterimTilesOnError Use interim tiles on error.
      * @observable
      * @api
      */
      VectorTileLayer.prototype.setUseInterimTilesOnError = function setUseInterimTilesOnError (useInterimTilesOnError) {
        this.set(TileProperty.USE_INTERIM_TILES_ON_ERROR, useInterimTilesOnError);
      };

      return VectorTileLayer;
    }(VectorLayer));


    /**
     * Return the associated {@link module:ol/source/VectorTile vectortilesource} of the layer.
     * @function
     * @return {module:ol/source/VectorTile} Source.
     * @api
     */
    VectorTileLayer.prototype.getSource;

    /**
     * @module ol/array
     */


    /**
     * @param {Array.<VALUE>} arr The array to modify.
     * @param {!Array.<VALUE>|VALUE} data The elements or arrays of elements to add to arr.
     * @template VALUE
     */
    function extend$1(arr, data) {
      var extension = Array.isArray(data) ? data : [data];
      var length = extension.length;
      for (var i = 0; i < length; i++) {
        arr[arr.length] = extension[i];
      }
    }

    /**
     * @module ol/format/FormatType
     */

    /**
     * @enum {string}
     */
    var FormatType = {
      ARRAY_BUFFER: 'arraybuffer',
      JSON: 'json',
      TEXT: 'text',
      XML: 'xml'
    };

    /**
     * @module ol/featureloader
     */


    /**
     * {@link module:ol/source/Vector} sources use a function of this type to
     * load features.
     *
     * This function takes an {@link module:ol/extent~Extent} representing the area to be loaded,
     * a `{number}` representing the resolution (map units per pixel) and an
     * {@link module:ol/proj/Projection} for the projection  as
     * arguments. `this` within the function is bound to the
     * {@link module:ol/source/Vector} it's called from.
     *
     * The function is responsible for loading the features and adding them to the
     * source.
     * @typedef {function(this:module:ol/source/Vector, module:ol/extent~Extent, number,
     *                    module:ol/proj/Projection)} FeatureLoader
     * @api
     */


    /**
     * {@link module:ol/source/Vector} sources use a function of this type to
     * get the url to load features from.
     *
     * This function takes an {@link module:ol/extent~Extent} representing the area
     * to be loaded, a `{number}` representing the resolution (map units per pixel)
     * and an {@link module:ol/proj/Projection} for the projection  as
     * arguments and returns a `{string}` representing the URL.
     * @typedef {function(module:ol/extent~Extent, number, module:ol/proj/Projection): string} FeatureUrlFunction
     * @api
     */


    /**
     * @param {string|module:ol/featureloader~FeatureUrlFunction} url Feature URL service.
     * @param {module:ol/format/Feature} format Feature format.
     * @param {function(this:module:ol/VectorTile, Array.<module:ol/Feature>, module:ol/proj/Projection, module:ol/extent~Extent)|function(this:module:ol/source/Vector, Array.<module:ol/Feature>)} success
     *     Function called with the loaded features and optionally with the data
     *     projection. Called with the vector tile or source as `this`.
     * @param {function(this:module:ol/VectorTile)|function(this:module:ol/source/Vector)} failure
     *     Function called when loading failed. Called with the vector tile or
     *     source as `this`.
     * @return {module:ol/featureloader~FeatureLoader} The feature loader.
     */
    function loadFeaturesXhr(url, format, success, failure) {
      return (
        /**
         * @param {module:ol/extent~Extent} extent Extent.
         * @param {number} resolution Resolution.
         * @param {module:ol/proj/Projection} projection Projection.
         * @this {module:ol/source/Vector|module:ol/VectorTile}
         */
        function(extent, resolution, projection) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET',
            typeof url === 'function' ? url(extent, resolution, projection) : url,
            true);
          if (format.getType() == FormatType.ARRAY_BUFFER) {
            xhr.responseType = 'arraybuffer';
          }
          /**
           * @param {Event} event Event.
           * @private
           */
          xhr.onload = function(event) {
            // status will be 0 for file:// urls
            if (!xhr.status || xhr.status >= 200 && xhr.status < 300) {
              var type = format.getType();
              /** @type {Document|Node|Object|string|undefined} */
              var source;
              if (type == FormatType.JSON || type == FormatType.TEXT) {
                source = xhr.responseText;
              } else if (type == FormatType.XML) {
                source = xhr.responseXML;
                if (!source) {
                  source = new DOMParser().parseFromString(xhr.responseText, 'application/xml');
                }
              } else if (type == FormatType.ARRAY_BUFFER) {
                source = /** @type {ArrayBuffer} */ (xhr.response);
              }
              if (source) {
                success.call(this, format.readFeatures(source,
                  {featureProjection: projection}),
                format.readProjection(source), format.getLastExtent());
              } else {
                failure.call(this);
              }
            } else {
              failure.call(this);
            }
          }.bind(this);
          /**
           * @private
           */
          xhr.onerror = function() {
            failure.call(this);
          }.bind(this);
          xhr.send();
        }
      );
    }


    /**
     * Create an XHR feature loader for a `url` and `format`. The feature loader
     * loads features (with XHR), parses the features, and adds them to the
     * vector source.
     * @param {string|module:ol/featureloader~FeatureUrlFunction} url Feature URL service.
     * @param {module:ol/format/Feature} format Feature format.
     * @return {module:ol/featureloader~FeatureLoader} The feature loader.
     * @api
     */
    function xhr(url, format) {
      return loadFeaturesXhr(url, format,
        /**
         * @param {Array.<module:ol/Feature>} features The loaded features.
         * @param {module:ol/proj/Projection} dataProjection Data
         * projection.
         * @this {module:ol/source/Vector}
         */
        function(features, dataProjection) {
          this.addFeatures(features);
        }, /* FIXME handle error */ UNDEFINED);
    }

    /**
     * @module ol/loadingstrategy
     */


    /**
     * Strategy function for loading all features with a single request.
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {number} resolution Resolution.
     * @return {Array.<module:ol/extent~Extent>} Extents.
     * @api
     */
    function all(extent, resolution) {
      return [[-Infinity, -Infinity, Infinity, Infinity]];
    }

    /**
     * @module ol/source/Source
     */


    /**
     * A function that returns a string or an array of strings representing source
     * attributions.
     *
     * @typedef {function(module:ol/PluggableMap~FrameState): (string|Array.<string>)} Attribution
     */


    /**
     * A type that can be used to provide attribution information for data sources.
     *
     * It represents either
     * * a simple string (e.g. `'© Acme Inc.'`)
     * * an array of simple strings (e.g. `['© Acme Inc.', '© Bacme Inc.']`)
     * * a function that returns a string or array of strings (`{@link module:ol/source/Source~Attribution}`)
     *
     * @typedef {string|Array.<string>|module:ol/source/Source~Attribution} AttributionLike
     */


    /**
     * @typedef {Object} Options
     * @property {module:ol/source/Source~AttributionLike} [attributions]
     * @property {module:ol/proj~ProjectionLike} projection
     * @property {module:ol/source/State} [state]
     * @property {boolean} [wrapX]
     */


    /**
     * @classdesc
     * Abstract base class; normally only used for creating subclasses and not
     * instantiated in apps.
     * Base class for {@link module:ol/layer/Layer~Layer} sources.
     *
     * A generic `change` event is triggered when the state of the source changes.
     * @api
     */
    var Source = (function (BaseObject$$1) {
      function Source(options) {

        BaseObject$$1.call(this);

        /**
        * @private
        * @type {module:ol/proj/Projection}
        */
        this.projection_ = get$2(options.projection);

        /**
        * @private
        * @type {?module:ol/source/Source~Attribution}
        */
        this.attributions_ = this.adaptAttributions_(options.attributions);

        /**
        * @private
        * @type {module:ol/source/State}
        */
        this.state_ = options.state !== undefined ?
          options.state : SourceState.READY;

        /**
        * @private
        * @type {boolean}
        */
        this.wrapX_ = options.wrapX !== undefined ? options.wrapX : false;

      }

      if ( BaseObject$$1 ) Source.__proto__ = BaseObject$$1;
      Source.prototype = Object.create( BaseObject$$1 && BaseObject$$1.prototype );
      Source.prototype.constructor = Source;

      /**
      * Turns the attributions option into an attributions function.
      * @param {module:ol/source/Source~AttributionLike|undefined} attributionLike The attribution option.
      * @return {?module:ol/source/Source~Attribution} An attribution function (or null).
      */
      Source.prototype.adaptAttributions_ = function adaptAttributions_ (attributionLike) {
        if (!attributionLike) {
          return null;
        }
        if (Array.isArray(attributionLike)) {
          return function(frameState) {
            return attributionLike;
          };
        }

        if (typeof attributionLike === 'function') {
          return attributionLike;
        }

        return function(frameState) {
          return [attributionLike];
        };
      };

      /**
      * Get the attribution function for the source.
      * @return {?module:ol/source/Source~Attribution} Attribution function.
      */
      Source.prototype.getAttributions = function getAttributions () {
        return this.attributions_;
      };

      /**
      * Get the projection of the source.
      * @return {module:ol/proj/Projection} Projection.
      * @api
      */
      Source.prototype.getProjection = function getProjection () {
        return this.projection_;
      };

      /**
      * @abstract
      * @return {Array.<number>|undefined} Resolutions.
      */
      Source.prototype.getResolutions = function getResolutions () {};

      /**
      * Get the state of the source, see {@link module:ol/source/State~State} for possible states.
      * @return {module:ol/source/State} State.
      * @api
      */
      Source.prototype.getState = function getState () {
        return this.state_;
      };

      /**
      * @return {boolean|undefined} Wrap X.
      */
      Source.prototype.getWrapX = function getWrapX () {
        return this.wrapX_;
      };

      /**
      * Refreshes the source and finally dispatches a 'change' event.
      * @api
      */
      Source.prototype.refresh = function refresh () {
        this.changed();
      };

      /**
      * Set the attributions of the source.
      * @param {module:ol/source/Source~AttributionLike|undefined} attributions Attributions.
      *     Can be passed as `string`, `Array<string>`, `{@link module:ol/source/Source~Attribution}`,
      *     or `undefined`.
      * @api
      */
      Source.prototype.setAttributions = function setAttributions (attributions) {
        this.attributions_ = this.adaptAttributions_(attributions);
        this.changed();
      };

      /**
      * Set the state of the source.
      * @param {module:ol/source/State} state State.
      * @protected
      */
      Source.prototype.setState = function setState (state) {
        this.state_ = state;
        this.changed();
      };

      return Source;
    }(BaseObject));

    /**
     * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
     * @param {number} resolution Resolution.
     * @param {number} rotation Rotation.
     * @param {number} hitTolerance Hit tolerance in pixels.
     * @param {Object.<string, boolean>} skippedFeatureUids Skipped feature uids.
     * @param {function((module:ol/Feature|module:ol/render/Feature)): T} callback Feature callback.
     * @return {T|undefined} Callback result.
     * @template T
     */
    Source.prototype.forEachFeatureAtCoordinate = UNDEFINED;

    /**
     * @module ol/source/VectorEventType
     */

    /**
     * @enum {string}
     */
    var VectorEventType = {
      /**
       * Triggered when a feature is added to the source.
       * @event ol/source/Vector~VectorSourceEvent#addfeature
       * @api
       */
      ADDFEATURE: 'addfeature',

      /**
       * Triggered when a feature is updated.
       * @event ol/source/Vector~VectorSourceEvent#changefeature
       * @api
       */
      CHANGEFEATURE: 'changefeature',

      /**
       * Triggered when the clear method is called on the source.
       * @event ol/source/Vector~VectorSourceEvent#clear
       * @api
       */
      CLEAR: 'clear',

      /**
       * Triggered when a feature is removed from the source.
       * See {@link module:ol/source/Vector#clear source.clear()} for exceptions.
       * @event ol/source/Vector~VectorSourceEvent#removefeature
       * @api
       */
      REMOVEFEATURE: 'removefeature'
    };

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var quickselect = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
    	module.exports = factory();
    }(commonjsGlobal, (function () {
    function quickselect(arr, k, left, right, compare) {
        quickselectStep(arr, k, left || 0, right || (arr.length - 1), compare || defaultCompare);
    }

    function quickselectStep(arr, k, left, right, compare) {

        while (right > left) {
            if (right - left > 600) {
                var n = right - left + 1;
                var m = k - left + 1;
                var z = Math.log(n);
                var s = 0.5 * Math.exp(2 * z / 3);
                var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
                var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
                var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
                quickselectStep(arr, k, newLeft, newRight, compare);
            }

            var t = arr[k];
            var i = left;
            var j = right;

            swap(arr, left, k);
            if (compare(arr[right], t) > 0) swap(arr, left, right);

            while (i < j) {
                swap(arr, i, j);
                i++;
                j--;
                while (compare(arr[i], t) < 0) i++;
                while (compare(arr[j], t) > 0) j--;
            }

            if (compare(arr[left], t) === 0) swap(arr, left, j);
            else {
                j++;
                swap(arr, j, right);
            }

            if (j <= k) left = j + 1;
            if (k <= j) right = j - 1;
        }
    }

    function swap(arr, i, j) {
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    function defaultCompare(a, b) {
        return a < b ? -1 : a > b ? 1 : 0;
    }

    return quickselect;

    })));
    });

    var C__Users_rendr_nextgis_nextgisweb_frontend_packages_olMapAdapter_node_modules_rbush = rbush;
    var default_1 = rbush;



    function rbush(maxEntries, format) {
        if (!(this instanceof rbush)) return new rbush(maxEntries, format);

        // max entries in a node is 9 by default; min node fill is 40% for best performance
        this._maxEntries = Math.max(4, maxEntries || 9);
        this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));

        if (format) {
            this._initFormat(format);
        }

        this.clear();
    }

    rbush.prototype = {

        all: function () {
            return this._all(this.data, []);
        },

        search: function (bbox) {

            var node = this.data,
                result = [],
                toBBox = this.toBBox;

            if (!intersects$1(bbox, node)) return result;

            var nodesToSearch = [],
                i, len, child, childBBox;

            while (node) {
                for (i = 0, len = node.children.length; i < len; i++) {

                    child = node.children[i];
                    childBBox = node.leaf ? toBBox(child) : child;

                    if (intersects$1(bbox, childBBox)) {
                        if (node.leaf) result.push(child);
                        else if (contains(bbox, childBBox)) this._all(child, result);
                        else nodesToSearch.push(child);
                    }
                }
                node = nodesToSearch.pop();
            }

            return result;
        },

        collides: function (bbox) {

            var node = this.data,
                toBBox = this.toBBox;

            if (!intersects$1(bbox, node)) return false;

            var nodesToSearch = [],
                i, len, child, childBBox;

            while (node) {
                for (i = 0, len = node.children.length; i < len; i++) {

                    child = node.children[i];
                    childBBox = node.leaf ? toBBox(child) : child;

                    if (intersects$1(bbox, childBBox)) {
                        if (node.leaf || contains(bbox, childBBox)) return true;
                        nodesToSearch.push(child);
                    }
                }
                node = nodesToSearch.pop();
            }

            return false;
        },

        load: function (data) {
            if (!(data && data.length)) return this;

            if (data.length < this._minEntries) {
                for (var i = 0, len = data.length; i < len; i++) {
                    this.insert(data[i]);
                }
                return this;
            }

            // recursively build the tree with the given data from scratch using OMT algorithm
            var node = this._build(data.slice(), 0, data.length - 1, 0);

            if (!this.data.children.length) {
                // save as is if tree is empty
                this.data = node;

            } else if (this.data.height === node.height) {
                // split root if trees have the same height
                this._splitRoot(this.data, node);

            } else {
                if (this.data.height < node.height) {
                    // swap trees if inserted one is bigger
                    var tmpNode = this.data;
                    this.data = node;
                    node = tmpNode;
                }

                // insert the small tree into the large tree at appropriate level
                this._insert(node, this.data.height - node.height - 1, true);
            }

            return this;
        },

        insert: function (item) {
            if (item) this._insert(item, this.data.height - 1);
            return this;
        },

        clear: function () {
            this.data = createNode([]);
            return this;
        },

        remove: function (item, equalsFn) {
            if (!item) return this;

            var node = this.data,
                bbox = this.toBBox(item),
                path = [],
                indexes = [],
                i, parent, index, goingUp;

            // depth-first iterative tree traversal
            while (node || path.length) {

                if (!node) { // go up
                    node = path.pop();
                    parent = path[path.length - 1];
                    i = indexes.pop();
                    goingUp = true;
                }

                if (node.leaf) { // check current node
                    index = findItem(item, node.children, equalsFn);

                    if (index !== -1) {
                        // item found, remove the item and condense tree upwards
                        node.children.splice(index, 1);
                        path.push(node);
                        this._condense(path);
                        return this;
                    }
                }

                if (!goingUp && !node.leaf && contains(node, bbox)) { // go down
                    path.push(node);
                    indexes.push(i);
                    i = 0;
                    parent = node;
                    node = node.children[0];

                } else if (parent) { // go right
                    i++;
                    node = parent.children[i];
                    goingUp = false;

                } else node = null; // nothing found
            }

            return this;
        },

        toBBox: function (item) { return item; },

        compareMinX: compareNodeMinX,
        compareMinY: compareNodeMinY,

        toJSON: function () { return this.data; },

        fromJSON: function (data) {
            this.data = data;
            return this;
        },

        _all: function (node, result) {
            var nodesToSearch = [];
            while (node) {
                if (node.leaf) result.push.apply(result, node.children);
                else nodesToSearch.push.apply(nodesToSearch, node.children);

                node = nodesToSearch.pop();
            }
            return result;
        },

        _build: function (items, left, right, height) {

            var N = right - left + 1,
                M = this._maxEntries,
                node;

            if (N <= M) {
                // reached leaf level; return leaf
                node = createNode(items.slice(left, right + 1));
                calcBBox(node, this.toBBox);
                return node;
            }

            if (!height) {
                // target height of the bulk-loaded tree
                height = Math.ceil(Math.log(N) / Math.log(M));

                // target number of root entries to maximize storage utilization
                M = Math.ceil(N / Math.pow(M, height - 1));
            }

            node = createNode([]);
            node.leaf = false;
            node.height = height;

            // split the items into M mostly square tiles

            var N2 = Math.ceil(N / M),
                N1 = N2 * Math.ceil(Math.sqrt(M)),
                i, j, right2, right3;

            multiSelect(items, left, right, N1, this.compareMinX);

            for (i = left; i <= right; i += N1) {

                right2 = Math.min(i + N1 - 1, right);

                multiSelect(items, i, right2, N2, this.compareMinY);

                for (j = i; j <= right2; j += N2) {

                    right3 = Math.min(j + N2 - 1, right2);

                    // pack each entry recursively
                    node.children.push(this._build(items, j, right3, height - 1));
                }
            }

            calcBBox(node, this.toBBox);

            return node;
        },

        _chooseSubtree: function (bbox, node, level, path) {

            var i, len, child, targetNode, area, enlargement, minArea, minEnlargement;

            while (true) {
                path.push(node);

                if (node.leaf || path.length - 1 === level) break;

                minArea = minEnlargement = Infinity;

                for (i = 0, len = node.children.length; i < len; i++) {
                    child = node.children[i];
                    area = bboxArea(child);
                    enlargement = enlargedArea(bbox, child) - area;

                    // choose entry with the least area enlargement
                    if (enlargement < minEnlargement) {
                        minEnlargement = enlargement;
                        minArea = area < minArea ? area : minArea;
                        targetNode = child;

                    } else if (enlargement === minEnlargement) {
                        // otherwise choose one with the smallest area
                        if (area < minArea) {
                            minArea = area;
                            targetNode = child;
                        }
                    }
                }

                node = targetNode || node.children[0];
            }

            return node;
        },

        _insert: function (item, level, isNode) {

            var toBBox = this.toBBox,
                bbox = isNode ? item : toBBox(item),
                insertPath = [];

            // find the best node for accommodating the item, saving all nodes along the path too
            var node = this._chooseSubtree(bbox, this.data, level, insertPath);

            // put the item into the node
            node.children.push(item);
            extend$2(node, bbox);

            // split on node overflow; propagate upwards if necessary
            while (level >= 0) {
                if (insertPath[level].children.length > this._maxEntries) {
                    this._split(insertPath, level);
                    level--;
                } else break;
            }

            // adjust bboxes along the insertion path
            this._adjustParentBBoxes(bbox, insertPath, level);
        },

        // split overflowed node into two
        _split: function (insertPath, level) {

            var node = insertPath[level],
                M = node.children.length,
                m = this._minEntries;

            this._chooseSplitAxis(node, m, M);

            var splitIndex = this._chooseSplitIndex(node, m, M);

            var newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
            newNode.height = node.height;
            newNode.leaf = node.leaf;

            calcBBox(node, this.toBBox);
            calcBBox(newNode, this.toBBox);

            if (level) insertPath[level - 1].children.push(newNode);
            else this._splitRoot(node, newNode);
        },

        _splitRoot: function (node, newNode) {
            // split root node
            this.data = createNode([node, newNode]);
            this.data.height = node.height + 1;
            this.data.leaf = false;
            calcBBox(this.data, this.toBBox);
        },

        _chooseSplitIndex: function (node, m, M) {

            var i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;

            minOverlap = minArea = Infinity;

            for (i = m; i <= M - m; i++) {
                bbox1 = distBBox(node, 0, i, this.toBBox);
                bbox2 = distBBox(node, i, M, this.toBBox);

                overlap = intersectionArea(bbox1, bbox2);
                area = bboxArea(bbox1) + bboxArea(bbox2);

                // choose distribution with minimum overlap
                if (overlap < minOverlap) {
                    minOverlap = overlap;
                    index = i;

                    minArea = area < minArea ? area : minArea;

                } else if (overlap === minOverlap) {
                    // otherwise choose distribution with minimum area
                    if (area < minArea) {
                        minArea = area;
                        index = i;
                    }
                }
            }

            return index;
        },

        // sorts node children by the best axis for split
        _chooseSplitAxis: function (node, m, M) {

            var compareMinX = node.leaf ? this.compareMinX : compareNodeMinX,
                compareMinY = node.leaf ? this.compareMinY : compareNodeMinY,
                xMargin = this._allDistMargin(node, m, M, compareMinX),
                yMargin = this._allDistMargin(node, m, M, compareMinY);

            // if total distributions margin value is minimal for x, sort by minX,
            // otherwise it's already sorted by minY
            if (xMargin < yMargin) node.children.sort(compareMinX);
        },

        // total margin of all possible split distributions where each node is at least m full
        _allDistMargin: function (node, m, M, compare) {

            node.children.sort(compare);

            var toBBox = this.toBBox,
                leftBBox = distBBox(node, 0, m, toBBox),
                rightBBox = distBBox(node, M - m, M, toBBox),
                margin = bboxMargin(leftBBox) + bboxMargin(rightBBox),
                i, child;

            for (i = m; i < M - m; i++) {
                child = node.children[i];
                extend$2(leftBBox, node.leaf ? toBBox(child) : child);
                margin += bboxMargin(leftBBox);
            }

            for (i = M - m - 1; i >= m; i--) {
                child = node.children[i];
                extend$2(rightBBox, node.leaf ? toBBox(child) : child);
                margin += bboxMargin(rightBBox);
            }

            return margin;
        },

        _adjustParentBBoxes: function (bbox, path, level) {
            // adjust bboxes along the given tree path
            for (var i = level; i >= 0; i--) {
                extend$2(path[i], bbox);
            }
        },

        _condense: function (path) {
            // go through the path, removing empty nodes and updating bboxes
            for (var i = path.length - 1, siblings; i >= 0; i--) {
                if (path[i].children.length === 0) {
                    if (i > 0) {
                        siblings = path[i - 1].children;
                        siblings.splice(siblings.indexOf(path[i]), 1);

                    } else this.clear();

                } else calcBBox(path[i], this.toBBox);
            }
        },

        _initFormat: function (format) {
            // data format (minX, minY, maxX, maxY accessors)

            // uses eval-type function compilation instead of just accepting a toBBox function
            // because the algorithms are very sensitive to sorting functions performance,
            // so they should be dead simple and without inner calls

            var compareArr = ['return a', ' - b', ';'];

            this.compareMinX = new Function('a', 'b', compareArr.join(format[0]));
            this.compareMinY = new Function('a', 'b', compareArr.join(format[1]));

            this.toBBox = new Function('a',
                'return {minX: a' + format[0] +
                ', minY: a' + format[1] +
                ', maxX: a' + format[2] +
                ', maxY: a' + format[3] + '};');
        }
    };

    function findItem(item, items, equalsFn) {
        if (!equalsFn) return items.indexOf(item);

        for (var i = 0; i < items.length; i++) {
            if (equalsFn(item, items[i])) return i;
        }
        return -1;
    }

    // calculate node's bbox from bboxes of its children
    function calcBBox(node, toBBox) {
        distBBox(node, 0, node.children.length, toBBox, node);
    }

    // min bounding rectangle of node children from k to p-1
    function distBBox(node, k, p, toBBox, destNode) {
        if (!destNode) destNode = createNode(null);
        destNode.minX = Infinity;
        destNode.minY = Infinity;
        destNode.maxX = -Infinity;
        destNode.maxY = -Infinity;

        for (var i = k, child; i < p; i++) {
            child = node.children[i];
            extend$2(destNode, node.leaf ? toBBox(child) : child);
        }

        return destNode;
    }

    function extend$2(a, b) {
        a.minX = Math.min(a.minX, b.minX);
        a.minY = Math.min(a.minY, b.minY);
        a.maxX = Math.max(a.maxX, b.maxX);
        a.maxY = Math.max(a.maxY, b.maxY);
        return a;
    }

    function compareNodeMinX(a, b) { return a.minX - b.minX; }
    function compareNodeMinY(a, b) { return a.minY - b.minY; }

    function bboxArea(a)   { return (a.maxX - a.minX) * (a.maxY - a.minY); }
    function bboxMargin(a) { return (a.maxX - a.minX) + (a.maxY - a.minY); }

    function enlargedArea(a, b) {
        return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) *
               (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
    }

    function intersectionArea(a, b) {
        var minX = Math.max(a.minX, b.minX),
            minY = Math.max(a.minY, b.minY),
            maxX = Math.min(a.maxX, b.maxX),
            maxY = Math.min(a.maxY, b.maxY);

        return Math.max(0, maxX - minX) *
               Math.max(0, maxY - minY);
    }

    function contains(a, b) {
        return a.minX <= b.minX &&
               a.minY <= b.minY &&
               b.maxX <= a.maxX &&
               b.maxY <= a.maxY;
    }

    function intersects$1(a, b) {
        return b.minX <= a.maxX &&
               b.minY <= a.maxY &&
               b.maxX >= a.minX &&
               b.maxY >= a.minY;
    }

    function createNode(children) {
        return {
            children: children,
            height: 1,
            leaf: true,
            minX: Infinity,
            minY: Infinity,
            maxX: -Infinity,
            maxY: -Infinity
        };
    }

    // sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
    // combines selection algorithm with binary divide & conquer approach

    function multiSelect(arr, left, right, n, compare) {
        var stack = [left, right],
            mid;

        while (stack.length) {
            right = stack.pop();
            left = stack.pop();

            if (right - left <= n) continue;

            mid = left + Math.ceil((right - left) / n / 2) * n;
            quickselect(arr, mid, left, right, compare);

            stack.push(left, mid, mid, right);
        }
    }
    C__Users_rendr_nextgis_nextgisweb_frontend_packages_olMapAdapter_node_modules_rbush.default = default_1;

    /**
     * @module ol/structs/RBush
     */

    /**
     * @typedef {Object} Entry
     * @property {number} minX
     * @property {number} minY
     * @property {number} maxX
     * @property {number} maxY
     * @property {Object} [value]
     */

    /**
     * @classdesc
     * Wrapper around the RBush by Vladimir Agafonkin.
     * See https://github.com/mourner/rbush.
     *
     * @template T
     */
    var RBush = function RBush(opt_maxEntries) {

      /**
       * @private
       */
      this.rbush_ = C__Users_rendr_nextgis_nextgisweb_frontend_packages_olMapAdapter_node_modules_rbush(opt_maxEntries, undefined);

      /**
       * A mapping between the objects added to this rbush wrapper
       * and the objects that are actually added to the internal rbush.
       * @private
       * @type {Object.<number, module:ol/structs/RBush~Entry>}
       */
      this.items_ = {};

    };

    /**
     * Insert a value into the RBush.
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {T} value Value.
     */
    RBush.prototype.insert = function insert (extent, value) {
      /** @type {module:ol/structs/RBush~Entry} */
      var item = {
        minX: extent[0],
        minY: extent[1],
        maxX: extent[2],
        maxY: extent[3],
        value: value
      };

      this.rbush_.insert(item);
      this.items_[getUid(value)] = item;
    };


    /**
     * Bulk-insert values into the RBush.
     * @param {Array.<module:ol/extent~Extent>} extents Extents.
     * @param {Array.<T>} values Values.
     */
    RBush.prototype.load = function load (extents, values) {
        var this$1 = this;

      var items = new Array(values.length);
      for (var i = 0, l = values.length; i < l; i++) {
        var extent = extents[i];
        var value = values[i];

        /** @type {module:ol/structs/RBush~Entry} */
        var item = {
          minX: extent[0],
          minY: extent[1],
          maxX: extent[2],
          maxY: extent[3],
          value: value
        };
        items[i] = item;
        this$1.items_[getUid(value)] = item;
      }
      this.rbush_.load(items);
    };


    /**
     * Remove a value from the RBush.
     * @param {T} value Value.
     * @return {boolean} Removed.
     */
    RBush.prototype.remove = function remove (value) {
      var uid = getUid(value);

      // get the object in which the value was wrapped when adding to the
      // internal rbush. then use that object to do the removal.
      var item = this.items_[uid];
      delete this.items_[uid];
      return this.rbush_.remove(item) !== null;
    };


    /**
     * Update the extent of a value in the RBush.
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {T} value Value.
     */
    RBush.prototype.update = function update (extent, value) {
      var item = this.items_[getUid(value)];
      var bbox = [item.minX, item.minY, item.maxX, item.maxY];
      if (!equals(bbox, extent)) {
        this.remove(value);
        this.insert(extent, value);
      }
    };


    /**
     * Return all values in the RBush.
     * @return {Array.<T>} All.
     */
    RBush.prototype.getAll = function getAll () {
      var items = this.rbush_.all();
      return items.map(function(item) {
        return item.value;
      });
    };


    /**
     * Return all values in the given extent.
     * @param {module:ol/extent~Extent} extent Extent.
     * @return {Array.<T>} All in extent.
     */
    RBush.prototype.getInExtent = function getInExtent (extent) {
      /** @type {module:ol/structs/RBush~Entry} */
      var bbox = {
        minX: extent[0],
        minY: extent[1],
        maxX: extent[2],
        maxY: extent[3]
      };
      var items = this.rbush_.search(bbox);
      return items.map(function(item) {
        return item.value;
      });
    };


    /**
     * Calls a callback function with each value in the tree.
     * If the callback returns a truthy value, this value is returned without
     * checking the rest of the tree.
     * @param {function(this: S, T): *} callback Callback.
     * @param {S=} opt_this The object to use as `this` in `callback`.
     * @return {*} Callback return value.
     * @template S
     */
    RBush.prototype.forEach = function forEach (callback, opt_this) {
      return this.forEach_(this.getAll(), callback, opt_this);
    };


    /**
     * Calls a callback function with each value in the provided extent.
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {function(this: S, T): *} callback Callback.
     * @param {S=} opt_this The object to use as `this` in `callback`.
     * @return {*} Callback return value.
     * @template S
     */
    RBush.prototype.forEachInExtent = function forEachInExtent (extent, callback, opt_this) {
      return this.forEach_(this.getInExtent(extent), callback, opt_this);
    };


    /**
     * @param {Array.<T>} values Values.
     * @param {function(this: S, T): *} callback Callback.
     * @param {S=} opt_this The object to use as `this` in `callback`.
     * @private
     * @return {*} Callback return value.
     * @template S
     */
    RBush.prototype.forEach_ = function forEach_ (values, callback, opt_this) {
      var result;
      for (var i = 0, l = values.length; i < l; i++) {
        result = callback.call(opt_this, values[i]);
        if (result) {
          return result;
        }
      }
      return result;
    };


    /**
     * @return {boolean} Is empty.
     */
    RBush.prototype.isEmpty = function isEmpty$1$$1 () {
      return isEmpty$1(this.items_);
    };


    /**
     * Remove all values from the RBush.
     */
    RBush.prototype.clear = function clear$$1 () {
      this.rbush_.clear();
      this.items_ = {};
    };


    /**
     * @param {module:ol/extent~Extent=} opt_extent Extent.
     * @return {module:ol/extent~Extent} Extent.
     */
    RBush.prototype.getExtent = function getExtent (opt_extent) {
      // FIXME add getExtent() to rbush
      var data = this.rbush_.data;
      return createOrUpdate(data.minX, data.minY, data.maxX, data.maxY, opt_extent);
    };


    /**
     * @param {module:ol/structs/RBush} rbush R-Tree.
     */
    RBush.prototype.concat = function concat (rbush) {
        var this$1 = this;

      this.rbush_.load(rbush.rbush_.all());
      for (var i in rbush.items_) {
        this$1.items_[i | 0] = rbush.items_[i | 0];
      }
    };

    /**
     * @module ol/source/Vector
     */

    /**
     * A function that takes an {@link module:ol/extent~Extent} and a resolution as arguments, and
     * returns an array of {@link module:ol/extent~Extent} with the extents to load. Usually this
     * is one of the standard {@link module:ol/loadingstrategy} strategies.
     *
     * @typedef {function(module:ol/extent~Extent, number): Array.<module:ol/extent~Extent>} LoadingStrategy
     * @api
     */


    /**
     * @classdesc
     * Events emitted by {@link module:ol/source/Vector} instances are instances of this
     * type.
     */
    var VectorSourceEvent = (function (Event$$1) {
      function VectorSourceEvent(type, opt_feature) {

        Event$$1.call(this, type);

        /**
         * The feature being added or removed.
         * @type {module:ol/Feature|undefined}
         * @api
         */
        this.feature = opt_feature;

      }

      if ( Event$$1 ) VectorSourceEvent.__proto__ = Event$$1;
      VectorSourceEvent.prototype = Object.create( Event$$1 && Event$$1.prototype );
      VectorSourceEvent.prototype.constructor = VectorSourceEvent;

      return VectorSourceEvent;
    }(Event));


    /**
     * @typedef {Object} Options
     * @property {module:ol/source/Source~AttributionLike} [attributions] Attributions.
     * @property {Array.<module:ol/Feature>|module:ol/Collection.<module:ol/Feature>} [features]
     * Features. If provided as {@link module:ol/Collection}, the features in the source
     * and the collection will stay in sync.
     * @property {module:ol/format/Feature} [format] The feature format used by the XHR
     * feature loader when `url` is set. Required if `url` is set, otherwise ignored.
     * @property {module:ol/featureloader~FeatureLoader} [loader]
     * The loader function used to load features, from a remote source for example.
     * If this is not set and `url` is set, the source will create and use an XHR
     * feature loader.
     *
     * Example:
     *
     * ```js
     * import {Vector} from 'ol/source';
     * import {GeoJSON} from 'ol/format';
     * import {bbox} from 'ol/loadingstrategy';
     *
     * var vectorSource = new Vector({
     *   format: new GeoJSON(),
     *   loader: function(extent, resolution, projection) {
     *      var proj = projection.getCode();
     *      var url = 'https://ahocevar.com/geoserver/wfs?service=WFS&' +
     *          'version=1.1.0&request=GetFeature&typename=osm:water_areas&' +
     *          'outputFormat=application/json&srsname=' + proj + '&' +
     *          'bbox=' + extent.join(',') + ',' + proj;
     *      var xhr = new XMLHttpRequest();
     *      xhr.open('GET', url);
     *      var onError = function() {
     *        vectorSource.removeLoadedExtent(extent);
     *      }
     *      xhr.onerror = onError;
     *      xhr.onload = function() {
     *        if (xhr.status == 200) {
     *          vectorSource.addFeatures(
     *              vectorSource.getFormat().readFeatures(xhr.responseText));
     *        } else {
     *          onError();
     *        }
     *      }
     *      xhr.send();
     *    },
     *    strategy: bbox
     *  });
     * ```
     * @property {boolean} [overlaps=true] This source may have overlapping geometries.
     * Setting this to `false` (e.g. for sources with polygons that represent administrative
     * boundaries or TopoJSON sources) allows the renderer to optimise fill and
     * stroke operations.
     * @property {module:ol/source/Vector~LoadingStrategy} [strategy] The loading strategy to use.
     * By default an {@link module:ol/loadingstrategy~all}
     * strategy is used, a one-off strategy which loads all features at once.
     * @property {string|module:ol/featureloader~FeatureUrlfunction} [url]
     * Setting this option instructs the source to load features using an XHR loader
     * (see {@link module:ol/featureloader~xhr}). Use a `string` and an
     * {@link module:ol/loadingstrategy~all} for a one-off download of all features from
     * the given URL. Use a {@link module:ol/featureloader~FeatureUrlfunction} to generate the url with
     * other loading strategies.
     * Requires `format` to be set as well.
     * When default XHR feature loader is provided, the features will
     * be transformed from the data projection to the view projection
     * during parsing. If your remote data source does not advertise its projection
     * properly, this transformation will be incorrect. For some formats, the
     * default projection (usually EPSG:4326) can be overridden by setting the
     * dataProjection constructor option on the format.
     * Note that if a source contains non-feature data, such as a GeoJSON geometry
     * or a KML NetworkLink, these will be ignored. Use a custom loader to load these.
     * @property {boolean} [useSpatialIndex=true]
     * By default, an RTree is used as spatial index. When features are removed and
     * added frequently, and the total number of features is low, setting this to
     * `false` may improve performance.
     *
     * Note that
     * {@link module:ol/source/Vector~VectorSource#getFeaturesInExtent},
     * {@link module:ol/source/Vector~VectorSource#getClosestFeatureToCoordinate} and
     * {@link module:ol/source/Vector~VectorSource#getExtent} cannot be used when `useSpatialIndex` is
     * set to `false`, and {@link module:ol/source/Vector~VectorSource#forEachFeatureInExtent} will loop
     * through all features.
     *
     * When set to `false`, the features will be maintained in an
     * {@link module:ol/Collection}, which can be retrieved through
     * {@link module:ol/source/Vector~VectorSource#getFeaturesCollection}.
     * @property {boolean} [wrapX=true] Wrap the world horizontally. For vector editing across the
     * -180° and 180° meridians to work properly, this should be set to `false`. The
     * resulting geometry coordinates will then exceed the world bounds.
     */


    /**
     * @classdesc
     * Provides a source of features for vector layers. Vector features provided
     * by this source are suitable for editing. See {@link module:ol/source/VectorTile~VectorTile} for
     * vector data that is optimized for rendering.
     *
     * @fires ol/source/Vector~VectorSourceEvent
     * @api
     */
    var VectorSource = (function (Source$$1) {
      function VectorSource(opt_options) {

        var options = opt_options || {};

        Source$$1.call(this, {
          attributions: options.attributions,
          projection: undefined,
          state: SourceState.READY,
          wrapX: options.wrapX !== undefined ? options.wrapX : true
        });

        /**
         * @private
         * @type {module:ol/featureloader~FeatureLoader}
         */
        this.loader_ = UNDEFINED;

        /**
         * @private
         * @type {module:ol/format/Feature|undefined}
         */
        this.format_ = options.format;

        /**
         * @private
         * @type {boolean}
         */
        this.overlaps_ = options.overlaps == undefined ? true : options.overlaps;

        /**
         * @private
         * @type {string|module:ol/featureloader~FeatureUrlFunction|undefined}
         */
        this.url_ = options.url;

        if (options.loader !== undefined) {
          this.loader_ = options.loader;
        } else if (this.url_ !== undefined) {
          assert(this.format_, 7); // `format` must be set when `url` is set
          // create a XHR feature loader for "url" and "format"
          this.loader_ = xhr(this.url_, /** @type {module:ol/format/Feature} */ (this.format_));
        }

        /**
         * @private
         * @type {module:ol/source/Vector~LoadingStrategy}
         */
        this.strategy_ = options.strategy !== undefined ? options.strategy : all;

        var useSpatialIndex =
            options.useSpatialIndex !== undefined ? options.useSpatialIndex : true;

        /**
         * @private
         * @type {module:ol/structs/RBush.<module:ol/Feature>}
         */
        this.featuresRtree_ = useSpatialIndex ? new RBush() : null;

        /**
         * @private
         * @type {module:ol/structs/RBush.<{extent: module:ol/extent~Extent}>}
         */
        this.loadedExtentsRtree_ = new RBush();

        /**
         * @private
         * @type {!Object.<string, module:ol/Feature>}
         */
        this.nullGeometryFeatures_ = {};

        /**
         * A lookup of features by id (the return from feature.getId()).
         * @private
         * @type {!Object.<string, module:ol/Feature>}
         */
        this.idIndex_ = {};

        /**
         * A lookup of features without id (keyed by getUid(feature)).
         * @private
         * @type {!Object.<string, module:ol/Feature>}
         */
        this.undefIdIndex_ = {};

        /**
         * @private
         * @type {Object.<string, Array.<module:ol/events~EventsKey>>}
         */
        this.featureChangeKeys_ = {};

        /**
         * @private
         * @type {module:ol/Collection.<module:ol/Feature>}
         */
        this.featuresCollection_ = null;

        var collection, features;
        if (options.features instanceof Collection) {
          collection = options.features;
          features = collection.getArray();
        } else if (Array.isArray(options.features)) {
          features = options.features;
        }
        if (!useSpatialIndex && collection === undefined) {
          collection = new Collection(features);
        }
        if (features !== undefined) {
          this.addFeaturesInternal(features);
        }
        if (collection !== undefined) {
          this.bindFeaturesCollection_(collection);
        }

      }

      if ( Source$$1 ) VectorSource.__proto__ = Source$$1;
      VectorSource.prototype = Object.create( Source$$1 && Source$$1.prototype );
      VectorSource.prototype.constructor = VectorSource;

      return VectorSource;
    }(Source));


    /**
     * Add a single feature to the source.  If you want to add a batch of features
     * at once, call {@link module:ol/source/Vector~VectorSource#addFeatures #addFeatures()}
     * instead. A feature will not be added to the source if feature with
     * the same id is already there. The reason for this behavior is to avoid
     * feature duplication when using bbox or tile loading strategies.
     * @param {module:ol/Feature} feature Feature to add.
     * @api
     */
    VectorSource.prototype.addFeature = function(feature) {
      this.addFeatureInternal(feature);
      this.changed();
    };


    /**
     * Add a feature without firing a `change` event.
     * @param {module:ol/Feature} feature Feature.
     * @protected
     */
    VectorSource.prototype.addFeatureInternal = function(feature) {
      var featureKey = getUid(feature).toString();

      if (!this.addToIndex_(featureKey, feature)) {
        return;
      }

      this.setupChangeEvents_(featureKey, feature);

      var geometry = feature.getGeometry();
      if (geometry) {
        var extent = geometry.getExtent();
        if (this.featuresRtree_) {
          this.featuresRtree_.insert(extent, feature);
        }
      } else {
        this.nullGeometryFeatures_[featureKey] = feature;
      }

      this.dispatchEvent(
        new VectorSourceEvent(VectorEventType.ADDFEATURE, feature));
    };


    /**
     * @param {string} featureKey Unique identifier for the feature.
     * @param {module:ol/Feature} feature The feature.
     * @private
     */
    VectorSource.prototype.setupChangeEvents_ = function(featureKey, feature) {
      this.featureChangeKeys_[featureKey] = [
        listen(feature, EventType.CHANGE,
          this.handleFeatureChange_, this),
        listen(feature, ObjectEventType.PROPERTYCHANGE,
          this.handleFeatureChange_, this)
      ];
    };


    /**
     * @param {string} featureKey Unique identifier for the feature.
     * @param {module:ol/Feature} feature The feature.
     * @return {boolean} The feature is "valid", in the sense that it is also a
     *     candidate for insertion into the Rtree.
     * @private
     */
    VectorSource.prototype.addToIndex_ = function(featureKey, feature) {
      var valid = true;
      var id = feature.getId();
      if (id !== undefined) {
        if (!(id.toString() in this.idIndex_)) {
          this.idIndex_[id.toString()] = feature;
        } else {
          valid = false;
        }
      } else {
        assert(!(featureKey in this.undefIdIndex_),
          30); // The passed `feature` was already added to the source
        this.undefIdIndex_[featureKey] = feature;
      }
      return valid;
    };


    /**
     * Add a batch of features to the source.
     * @param {Array.<module:ol/Feature>} features Features to add.
     * @api
     */
    VectorSource.prototype.addFeatures = function(features) {
      this.addFeaturesInternal(features);
      this.changed();
    };


    /**
     * Add features without firing a `change` event.
     * @param {Array.<module:ol/Feature>} features Features.
     * @protected
     */
    VectorSource.prototype.addFeaturesInternal = function(features) {
      var this$1 = this;

      var extents = [];
      var newFeatures = [];
      var geometryFeatures = [];

      for (var i = 0, length = features.length; i < length; i++) {
        var feature = features[i];
        var featureKey = getUid(feature).toString();
        if (this$1.addToIndex_(featureKey, feature)) {
          newFeatures.push(feature);
        }
      }

      for (var i$1 = 0, length$1 = newFeatures.length; i$1 < length$1; i$1++) {
        var feature$1 = newFeatures[i$1];
        var featureKey$1 = getUid(feature$1).toString();
        this$1.setupChangeEvents_(featureKey$1, feature$1);

        var geometry = feature$1.getGeometry();
        if (geometry) {
          var extent = geometry.getExtent();
          extents.push(extent);
          geometryFeatures.push(feature$1);
        } else {
          this$1.nullGeometryFeatures_[featureKey$1] = feature$1;
        }
      }
      if (this.featuresRtree_) {
        this.featuresRtree_.load(extents, geometryFeatures);
      }

      for (var i$2 = 0, length$2 = newFeatures.length; i$2 < length$2; i$2++) {
        this$1.dispatchEvent(new VectorSourceEvent(VectorEventType.ADDFEATURE, newFeatures[i$2]));
      }
    };


    /**
     * @param {!module:ol/Collection.<module:ol/Feature>} collection Collection.
     * @private
     */
    VectorSource.prototype.bindFeaturesCollection_ = function(collection) {
      var modifyingCollection = false;
      listen(this, VectorEventType.ADDFEATURE,
        function(evt) {
          if (!modifyingCollection) {
            modifyingCollection = true;
            collection.push(evt.feature);
            modifyingCollection = false;
          }
        });
      listen(this, VectorEventType.REMOVEFEATURE,
        function(evt) {
          if (!modifyingCollection) {
            modifyingCollection = true;
            collection.remove(evt.feature);
            modifyingCollection = false;
          }
        });
      listen(collection, CollectionEventType.ADD,
        function(evt) {
          if (!modifyingCollection) {
            modifyingCollection = true;
            this.addFeature(/** @type {module:ol/Feature} */ (evt.element));
            modifyingCollection = false;
          }
        }, this);
      listen(collection, CollectionEventType.REMOVE,
        function(evt) {
          if (!modifyingCollection) {
            modifyingCollection = true;
            this.removeFeature(/** @type {module:ol/Feature} */ (evt.element));
            modifyingCollection = false;
          }
        }, this);
      this.featuresCollection_ = collection;
    };


    /**
     * Remove all features from the source.
     * @param {boolean=} opt_fast Skip dispatching of {@link module:ol/source/Vector~VectorSourceEvent#removefeature} events.
     * @api
     */
    VectorSource.prototype.clear = function(opt_fast) {
      var this$1 = this;

      if (opt_fast) {
        for (var featureId in this$1.featureChangeKeys_) {
          var keys = this$1.featureChangeKeys_[featureId];
          keys.forEach(unlistenByKey);
        }
        if (!this.featuresCollection_) {
          this.featureChangeKeys_ = {};
          this.idIndex_ = {};
          this.undefIdIndex_ = {};
        }
      } else {
        if (this.featuresRtree_) {
          this.featuresRtree_.forEach(this.removeFeatureInternal, this);
          for (var id in this$1.nullGeometryFeatures_) {
            this$1.removeFeatureInternal(this$1.nullGeometryFeatures_[id]);
          }
        }
      }
      if (this.featuresCollection_) {
        this.featuresCollection_.clear();
      }

      if (this.featuresRtree_) {
        this.featuresRtree_.clear();
      }
      this.loadedExtentsRtree_.clear();
      this.nullGeometryFeatures_ = {};

      var clearEvent = new VectorSourceEvent(VectorEventType.CLEAR);
      this.dispatchEvent(clearEvent);
      this.changed();
    };


    /**
     * Iterate through all features on the source, calling the provided callback
     * with each one.  If the callback returns any "truthy" value, iteration will
     * stop and the function will return the same value.
     * Note: this function only iterate through the feature that have a defined geometry.
     *
     * @param {function(module:ol/Feature): T} callback Called with each feature
     *     on the source.  Return a truthy value to stop iteration.
     * @return {T|undefined} The return value from the last call to the callback.
     * @template T
     * @api
     */
    VectorSource.prototype.forEachFeature = function(callback) {
      if (this.featuresRtree_) {
        return this.featuresRtree_.forEach(callback);
      } else if (this.featuresCollection_) {
        return this.featuresCollection_.forEach(callback);
      }
    };


    /**
     * Iterate through all features whose geometries contain the provided
     * coordinate, calling the callback with each feature.  If the callback returns
     * a "truthy" value, iteration will stop and the function will return the same
     * value.
     *
     * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
     * @param {function(module:ol/Feature): T} callback Called with each feature
     *     whose goemetry contains the provided coordinate.
     * @return {T|undefined} The return value from the last call to the callback.
     * @template T
     */
    VectorSource.prototype.forEachFeatureAtCoordinateDirect = function(coordinate, callback) {
      var extent = [coordinate[0], coordinate[1], coordinate[0], coordinate[1]];
      return this.forEachFeatureInExtent(extent, function(feature) {
        var geometry = feature.getGeometry();
        if (geometry.intersectsCoordinate(coordinate)) {
          return callback(feature);
        } else {
          return undefined;
        }
      });
    };


    /**
     * Iterate through all features whose bounding box intersects the provided
     * extent (note that the feature's geometry may not intersect the extent),
     * calling the callback with each feature.  If the callback returns a "truthy"
     * value, iteration will stop and the function will return the same value.
     *
     * If you are interested in features whose geometry intersects an extent, call
     * the {@link module:ol/source/Vector~VectorSource#forEachFeatureIntersectingExtent #forEachFeatureIntersectingExtent()} method instead.
     *
     * When `useSpatialIndex` is set to false, this method will loop through all
     * features, equivalent to {@link module:ol/source/Vector~VectorSource#forEachFeature #forEachFeature()}.
     *
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {function(module:ol/Feature): T} callback Called with each feature
     *     whose bounding box intersects the provided extent.
     * @return {T|undefined} The return value from the last call to the callback.
     * @template T
     * @api
     */
    VectorSource.prototype.forEachFeatureInExtent = function(extent, callback) {
      if (this.featuresRtree_) {
        return this.featuresRtree_.forEachInExtent(extent, callback);
      } else if (this.featuresCollection_) {
        return this.featuresCollection_.forEach(callback);
      }
    };


    /**
     * Iterate through all features whose geometry intersects the provided extent,
     * calling the callback with each feature.  If the callback returns a "truthy"
     * value, iteration will stop and the function will return the same value.
     *
     * If you only want to test for bounding box intersection, call the
     * {@link module:ol/source/Vector~VectorSource#forEachFeatureInExtent #forEachFeatureInExtent()} method instead.
     *
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {function(module:ol/Feature): T} callback Called with each feature
     *     whose geometry intersects the provided extent.
     * @return {T|undefined} The return value from the last call to the callback.
     * @template T
     * @api
     */
    VectorSource.prototype.forEachFeatureIntersectingExtent = function(extent, callback) {
      return this.forEachFeatureInExtent(extent,
        /**
         * @param {module:ol/Feature} feature Feature.
         * @return {T|undefined} The return value from the last call to the callback.
         * @template T
         */
        function(feature) {
          var geometry = feature.getGeometry();
          if (geometry.intersectsExtent(extent)) {
            var result = callback(feature);
            if (result) {
              return result;
            }
          }
        });
    };


    /**
     * Get the features collection associated with this source. Will be `null`
     * unless the source was configured with `useSpatialIndex` set to `false`, or
     * with an {@link module:ol/Collection} as `features`.
     * @return {module:ol/Collection.<module:ol/Feature>} The collection of features.
     * @api
     */
    VectorSource.prototype.getFeaturesCollection = function() {
      return this.featuresCollection_;
    };


    /**
     * Get all features on the source in random order.
     * @return {Array.<module:ol/Feature>} Features.
     * @api
     */
    VectorSource.prototype.getFeatures = function() {
      var features;
      if (this.featuresCollection_) {
        features = this.featuresCollection_.getArray();
      } else if (this.featuresRtree_) {
        features = this.featuresRtree_.getAll();
        if (!isEmpty$1(this.nullGeometryFeatures_)) {
          extend$1(features, getValues(this.nullGeometryFeatures_));
        }
      }
      return (
        /** @type {Array.<module:ol/Feature>} */ (features)
      );
    };


    /**
     * Get all features whose geometry intersects the provided coordinate.
     * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
     * @return {Array.<module:ol/Feature>} Features.
     * @api
     */
    VectorSource.prototype.getFeaturesAtCoordinate = function(coordinate) {
      var features = [];
      this.forEachFeatureAtCoordinateDirect(coordinate, function(feature) {
        features.push(feature);
      });
      return features;
    };


    /**
     * Get all features in the provided extent.  Note that this returns an array of
     * all features intersecting the given extent in random order (so it may include
     * features whose geometries do not intersect the extent).
     *
     * This method is not available when the source is configured with
     * `useSpatialIndex` set to `false`.
     * @param {module:ol/extent~Extent} extent Extent.
     * @return {Array.<module:ol/Feature>} Features.
     * @api
     */
    VectorSource.prototype.getFeaturesInExtent = function(extent) {
      return this.featuresRtree_.getInExtent(extent);
    };


    /**
     * Get the closest feature to the provided coordinate.
     *
     * This method is not available when the source is configured with
     * `useSpatialIndex` set to `false`.
     * @param {module:ol/coordinate~Coordinate} coordinate Coordinate.
     * @param {function(module:ol/Feature):boolean=} opt_filter Feature filter function.
     *     The filter function will receive one argument, the {@link module:ol/Feature feature}
     *     and it should return a boolean value. By default, no filtering is made.
     * @return {module:ol/Feature} Closest feature.
     * @api
     */
    VectorSource.prototype.getClosestFeatureToCoordinate = function(coordinate, opt_filter) {
      // Find the closest feature using branch and bound.  We start searching an
      // infinite extent, and find the distance from the first feature found.  This
      // becomes the closest feature.  We then compute a smaller extent which any
      // closer feature must intersect.  We continue searching with this smaller
      // extent, trying to find a closer feature.  Every time we find a closer
      // feature, we update the extent being searched so that any even closer
      // feature must intersect it.  We continue until we run out of features.
      var x = coordinate[0];
      var y = coordinate[1];
      var closestFeature = null;
      var closestPoint = [NaN, NaN];
      var minSquaredDistance = Infinity;
      var extent = [-Infinity, -Infinity, Infinity, Infinity];
      var filter = opt_filter ? opt_filter : TRUE;
      this.featuresRtree_.forEachInExtent(extent,
        /**
         * @param {module:ol/Feature} feature Feature.
         */
        function(feature) {
          if (filter(feature)) {
            var geometry = feature.getGeometry();
            var previousMinSquaredDistance = minSquaredDistance;
            minSquaredDistance = geometry.closestPointXY(
              x, y, closestPoint, minSquaredDistance);
            if (minSquaredDistance < previousMinSquaredDistance) {
              closestFeature = feature;
              // This is sneaky.  Reduce the extent that it is currently being
              // searched while the R-Tree traversal using this same extent object
              // is still in progress.  This is safe because the new extent is
              // strictly contained by the old extent.
              var minDistance = Math.sqrt(minSquaredDistance);
              extent[0] = x - minDistance;
              extent[1] = y - minDistance;
              extent[2] = x + minDistance;
              extent[3] = y + minDistance;
            }
          }
        });
      return closestFeature;
    };


    /**
     * Get the extent of the features currently in the source.
     *
     * This method is not available when the source is configured with
     * `useSpatialIndex` set to `false`.
     * @param {module:ol/extent~Extent=} opt_extent Destination extent. If provided, no new extent
     *     will be created. Instead, that extent's coordinates will be overwritten.
     * @return {module:ol/extent~Extent} Extent.
     * @api
     */
    VectorSource.prototype.getExtent = function(opt_extent) {
      return this.featuresRtree_.getExtent(opt_extent);
    };


    /**
     * Get a feature by its identifier (the value returned by feature.getId()).
     * Note that the index treats string and numeric identifiers as the same.  So
     * `source.getFeatureById(2)` will return a feature with id `'2'` or `2`.
     *
     * @param {string|number} id Feature identifier.
     * @return {module:ol/Feature} The feature (or `null` if not found).
     * @api
     */
    VectorSource.prototype.getFeatureById = function(id) {
      var feature = this.idIndex_[id.toString()];
      return feature !== undefined ? feature : null;
    };


    /**
     * Get the format associated with this source.
     *
     * @return {module:ol/format/Feature|undefined} The feature format.
     * @api
     */
    VectorSource.prototype.getFormat = function() {
      return this.format_;
    };


    /**
     * @return {boolean} The source can have overlapping geometries.
     */
    VectorSource.prototype.getOverlaps = function() {
      return this.overlaps_;
    };


    /**
     * @override
     */
    VectorSource.prototype.getResolutions = function() {};


    /**
     * Get the url associated with this source.
     *
     * @return {string|module:ol/featureloader~FeatureUrlFunction|undefined} The url.
     * @api
     */
    VectorSource.prototype.getUrl = function() {
      return this.url_;
    };


    /**
     * @param {module:ol/events/Event} event Event.
     * @private
     */
    VectorSource.prototype.handleFeatureChange_ = function(event) {
      var feature = /** @type {module:ol/Feature} */ (event.target);
      var featureKey = getUid(feature).toString();
      var geometry = feature.getGeometry();
      if (!geometry) {
        if (!(featureKey in this.nullGeometryFeatures_)) {
          if (this.featuresRtree_) {
            this.featuresRtree_.remove(feature);
          }
          this.nullGeometryFeatures_[featureKey] = feature;
        }
      } else {
        var extent = geometry.getExtent();
        if (featureKey in this.nullGeometryFeatures_) {
          delete this.nullGeometryFeatures_[featureKey];
          if (this.featuresRtree_) {
            this.featuresRtree_.insert(extent, feature);
          }
        } else {
          if (this.featuresRtree_) {
            this.featuresRtree_.update(extent, feature);
          }
        }
      }
      var id = feature.getId();
      if (id !== undefined) {
        var sid = id.toString();
        if (featureKey in this.undefIdIndex_) {
          delete this.undefIdIndex_[featureKey];
          this.idIndex_[sid] = feature;
        } else {
          if (this.idIndex_[sid] !== feature) {
            this.removeFromIdIndex_(feature);
            this.idIndex_[sid] = feature;
          }
        }
      } else {
        if (!(featureKey in this.undefIdIndex_)) {
          this.removeFromIdIndex_(feature);
          this.undefIdIndex_[featureKey] = feature;
        }
      }
      this.changed();
      this.dispatchEvent(new VectorSourceEvent(
        VectorEventType.CHANGEFEATURE, feature));
    };

    /**
     * Returns true if the feature is contained within the source.
     * @param {module:ol/Feature} feature Feature.
     * @return {boolean} Has feature.
     * @api
     */
    VectorSource.prototype.hasFeature = function(feature) {
      var id = feature.getId();
      if (id !== undefined) {
        return id in this.idIndex_;
      } else {
        var featureKey = getUid(feature).toString();
        return featureKey in this.undefIdIndex_;
      }
    };

    /**
     * @return {boolean} Is empty.
     */
    VectorSource.prototype.isEmpty = function() {
      return this.featuresRtree_.isEmpty() && isEmpty$1(this.nullGeometryFeatures_);
    };


    /**
     * @param {module:ol/extent~Extent} extent Extent.
     * @param {number} resolution Resolution.
     * @param {module:ol/proj/Projection} projection Projection.
     */
    VectorSource.prototype.loadFeatures = function(extent, resolution, projection) {
      var this$1 = this;

      var loadedExtentsRtree = this.loadedExtentsRtree_;
      var extentsToLoad = this.strategy_(extent, resolution);
      var loop = function ( i, ii ) {
        var extentToLoad = extentsToLoad[i];
        var alreadyLoaded = loadedExtentsRtree.forEachInExtent(extentToLoad,
          /**
           * @param {{extent: module:ol/extent~Extent}} object Object.
           * @return {boolean} Contains.
           */
          function(object) {
            return containsExtent(object.extent, extentToLoad);
          });
        if (!alreadyLoaded) {
          this$1.loader_.call(this$1, extentToLoad, resolution, projection);
          loadedExtentsRtree.insert(extentToLoad, {extent: extentToLoad.slice()});
        }
      };

      for (var i = 0, ii = extentsToLoad.length; i < ii; ++i) loop( i, ii );
    };


    /**
     * Remove an extent from the list of loaded extents.
     * @param {module:ol/extent~Extent} extent Extent.
     * @api
     */
    VectorSource.prototype.removeLoadedExtent = function(extent) {
      var loadedExtentsRtree = this.loadedExtentsRtree_;
      var obj;
      loadedExtentsRtree.forEachInExtent(extent, function(object) {
        if (equals(object.extent, extent)) {
          obj = object;
          return true;
        }
      });
      if (obj) {
        loadedExtentsRtree.remove(obj);
      }
    };


    /**
     * Remove a single feature from the source.  If you want to remove all features
     * at once, use the {@link module:ol/source/Vector~VectorSource#clear #clear()} method
     * instead.
     * @param {module:ol/Feature} feature Feature to remove.
     * @api
     */
    VectorSource.prototype.removeFeature = function(feature) {
      var featureKey = getUid(feature).toString();
      if (featureKey in this.nullGeometryFeatures_) {
        delete this.nullGeometryFeatures_[featureKey];
      } else {
        if (this.featuresRtree_) {
          this.featuresRtree_.remove(feature);
        }
      }
      this.removeFeatureInternal(feature);
      this.changed();
    };


    /**
     * Remove feature without firing a `change` event.
     * @param {module:ol/Feature} feature Feature.
     * @protected
     */
    VectorSource.prototype.removeFeatureInternal = function(feature) {
      var featureKey = getUid(feature).toString();
      this.featureChangeKeys_[featureKey].forEach(unlistenByKey);
      delete this.featureChangeKeys_[featureKey];
      var id = feature.getId();
      if (id !== undefined) {
        delete this.idIndex_[id.toString()];
      } else {
        delete this.undefIdIndex_[featureKey];
      }
      this.dispatchEvent(new VectorSourceEvent(
        VectorEventType.REMOVEFEATURE, feature));
    };


    /**
     * Remove a feature from the id index.  Called internally when the feature id
     * may have changed.
     * @param {module:ol/Feature} feature The feature.
     * @return {boolean} Removed the feature from the index.
     * @private
     */
    VectorSource.prototype.removeFromIdIndex_ = function(feature) {
      var this$1 = this;

      var removed = false;
      for (var id in this$1.idIndex_) {
        if (this$1.idIndex_[id] === feature) {
          delete this$1.idIndex_[id];
          removed = true;
          break;
        }
      }
      return removed;
    };


    /**
     * Set the new loader of the source. The next loadFeatures call will use the
     * new loader.
     * @param {module:ol/featureloader~FeatureLoader} loader The loader to set.
     * @api
     */
    VectorSource.prototype.setLoader = function(loader) {
      this.loader_ = loader;
    };

    var ID$1 = 1;
    var MarkerAdapter = /** @class */ (function () {
        function MarkerAdapter() {
        }
        MarkerAdapter.prototype.addLayer = function (options) {
            this.name = options.id || 'marker-' + ID$1++;
            var _a = options.latLng, lat = _a.lat, lng = _a.lng;
            var point = new Feature({
                geometry: new Point(proj.fromLonLat([lng, lat])),
            });
            console.log(point);
            // const icon = new Icon({
            //   color: '#4271AE',
            //   crossOrigin: 'anonymous',
            //   // src: 'data/dot.png'
            // });
            // point.setStyle(new Style({
            //   image: icon
            // }));
            var source = new VectorSource({
                features: [point]
            });
            var layer = new VectorLayer({
                source: source
            });
            return layer;
        };
        return MarkerAdapter;
    }());

    var OlMapAdapter = /** @class */ (function () {
        function OlMapAdapter() {
            this.displayProjection = 'EPSG:3857';
            this.lonlatProjection = 'EPSG:4326';
            this.emitter = new EventEmitter();
            this._layers = {};
            this._order = 0;
            this._length = 9999; // TODO: get real layers length count, after all registered
            this.DPI = 1000 / 39.37 / 0.28;
            this.IPM = 39.37;
        }
        // private _layers: {[name: string]: LayerMem} = {};
        // create(options: MapOptions = {target: 'map'}) {
        OlMapAdapter.prototype.create = function (options) {
            if (options === void 0) { options = { target: 'map' }; }
            this.options = Object.assign({}, options);
            var view = new View({
                center: [-9101767, 2822912],
                zoom: 14,
                projection: this.displayProjection,
            });
            var defOpt = {
                logo: false,
                controls: [],
                view: view,
                layers: [],
            };
            var mapInitOptions = __assign({}, defOpt, options);
            this.map = new Map(mapInitOptions);
            this._olView = this.map.getView();
            // olView.on('change:resolution', (evt) => {
            //   this.set('resolution', olView.getResolution());
            // });
            // olView.on('change:center', (evt) => {
            //   this.set('center', olView.getCenter());
            // });
            this._addMapListeners();
        };
        OlMapAdapter.prototype.getContainer = function () {
            return document.getElementById(this.options.target);
        };
        OlMapAdapter.prototype.onMapLoad = function (cb) {
            return new Promise(function (resolve) {
                resolve(cb && cb());
            });
        };
        OlMapAdapter.prototype.setCenter = function (latLng) {
            this._olView.setCenter(proj.fromLonLat(latLng));
        };
        OlMapAdapter.prototype.setZoom = function (zoom) {
            this._olView.setZoom(zoom);
        };
        OlMapAdapter.prototype.fit = function (extent) {
            extent = proj.transformExtent(extent, this.lonlatProjection, this.displayProjection);
            this._olView.fit(extent);
        };
        OlMapAdapter.prototype.setRotation = function (angle) {
            this._olView.setRotation(angle);
        };
        OlMapAdapter.prototype.getLayerAdapter = function (name) {
            return OlMapAdapter.layerAdapters[name];
        };
        OlMapAdapter.prototype.getLayer = function (layerName) {
            return this._layers[layerName] !== undefined;
        };
        OlMapAdapter.prototype.getLayers = function () {
            return Object.keys(this._layers);
        };
        OlMapAdapter.prototype.isLayerOnTheMap = function (layerName) {
            var layerMem = this._layers[layerName];
            return layerMem.onMap;
        };
        OlMapAdapter.prototype.addLayer = function (adapterDef, options) {
            var adapterEngine;
            if (typeof adapterDef === 'string') {
                adapterEngine = this.getLayerAdapter(adapterDef);
            }
            if (adapterEngine) {
                var adapter = new adapterEngine(this.map, options);
                var layer = adapter.addLayer(options);
                var layerId = adapter.name;
                this._layers[layerId] = { layer: layer, order: options.order || this._order++, onMap: false };
                this._length++;
                return Promise.resolve(adapter);
            }
            return Promise.reject('No adapter');
        };
        OlMapAdapter.prototype.removeLayer = function (layerName) {
            // ignore
        };
        OlMapAdapter.prototype.showLayer = function (layerName) {
            this.toggleLayer(layerName, true);
        };
        OlMapAdapter.prototype.hideLayer = function (layerName) {
            this.toggleLayer(layerName, false);
        };
        OlMapAdapter.prototype.setLayerOpacity = function (layerName, value) {
            // ignore
        };
        OlMapAdapter.prototype.getScaleForResolution = function (res, mpu) {
            return parseFloat(res) * (mpu * this.IPM * this.DPI);
        };
        OlMapAdapter.prototype.getResolutionForScale = function (scale, mpu) {
            return parseFloat(scale) / (mpu * this.IPM * this.DPI);
        };
        OlMapAdapter.prototype.toggleLayer = function (layerName, status) {
            var _this = this;
            var action = function (source, l) {
                if (status) {
                    if (source instanceof Map) {
                        source.addLayer(l.layer);
                        l.layer.setZIndex(_this._length - l.order);
                    }
                }
                else {
                    source.removeLayer(l.layer);
                }
                l.onMap = status;
            };
            var layer = this._layers[layerName];
            if (layer && layer.onMap !== status) {
                action(this.map, layer);
            }
        };
        OlMapAdapter.prototype.addControl = function (controlDef, position) {
            // ignore
        };
        OlMapAdapter.prototype.onMapClick = function (evt) {
            var _a = proj.transform(evt.coordinate, this.displayProjection, this.lonlatProjection), lng = _a[0], lat = _a[1];
            var latLng = {
                lat: lat, lng: lng
            };
            this.emitter.emit('click', {
                latLng: latLng,
                pixel: { left: evt.pixel[0], top: evt.pixel[1] },
                source: evt
            });
        };
        OlMapAdapter.prototype._addMapListeners = function () {
            var _this = this;
            this.map.on('click', function (evt) {
                _this.onMapClick(evt);
            });
        };
        OlMapAdapter.layerAdapters = {
            IMAGE: ImageAdapter,
            // TILE: TileAdapter,
            // MVT: MvtAdapter,
            OSM: OsmAdapter,
            MARKER: MarkerAdapter
        };
        return OlMapAdapter;
    }());

    exports.OlMapAdapter = OlMapAdapter;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
