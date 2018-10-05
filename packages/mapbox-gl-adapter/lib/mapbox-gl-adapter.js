(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('mapbox-gl')) :
    typeof define === 'function' && define.amd ? define(['exports', 'mapbox-gl'], factory) :
    (factory((global.MapboxglAdapter = {}),global.mapboxGl));
}(this, (function (exports,mapboxGl) { 'use strict';

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

    var ID = 1;
    var BaseAdapter = (function () {
        function BaseAdapter(map, options) {
            this.map = map;
            this.name = options.id || String(ID++);
            this.options = Object.assign({}, this.options, options);
        }
        BaseAdapter.prototype.addLayer = function (options) {
            return '';
        };
        return BaseAdapter;
    }());

    var MvtAdapter = (function (_super) {
        __extends(MvtAdapter, _super);
        function MvtAdapter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MvtAdapter.prototype.addLayer = function (options) {
            options = Object.assign({}, this.options, options || {});
            var idString = String(this.name);
            var layerOptions = {
                'id': idString,
                'type': options.type || 'fill',
                'source-layer': options['source-layer'] || idString,
                'source': {
                    type: 'vector',
                    tiles: [options.url],
                },
                'layout': {
                    visibility: 'none',
                },
            };
            if (options.paint) {
                layerOptions.paint = options.paint;
            }
            this.map.addLayer(layerOptions, options.before);
            return this.name;
        };
        return MvtAdapter;
    }(BaseAdapter));

    var TileAdapter = (function (_super) {
        __extends(TileAdapter, _super);
        function TileAdapter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TileAdapter.prototype.addLayer = function (options) {
            var opt = Object.assign({}, this.options, options || {});
            var tiles;
            if (opt && opt.subdomains) {
                tiles = opt.subdomains.split('').map(function (x) {
                    var subUrl = opt.url.replace('{s}', x);
                    return subUrl;
                });
            }
            else {
                tiles = [opt.url];
            }
            this.map.addLayer({
                id: String(this.name),
                type: 'raster',
                layout: {
                    visibility: 'none',
                },
                source: {
                    type: 'raster',
                    tiles: tiles,
                    tileSize: opt && opt.tileSize || 256,
                },
            }, options.before);
            return this.name;
        };
        return TileAdapter;
    }(BaseAdapter));

    var OPTIONS = {
        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
        subdomains: 'abc',
    };
    var OsmAdapter = (function (_super) {
        __extends(OsmAdapter, _super);
        function OsmAdapter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OsmAdapter.prototype.addLayer = function (options) {
            return _super.prototype.addLayer.call(this, Object.assign({}, OPTIONS, options));
        };
        return OsmAdapter;
    }(TileAdapter));

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

    var ZoomControl = (function (_super) {
        __extends(ZoomControl, _super);
        function ZoomControl(options) {
            if (options === void 0) { options = {}; }
            var _this = this;
            options = Object.assign({}, options, { showCompass: false });
            _this = _super.call(this, options) || this;
            return _this;
        }
        return ZoomControl;
    }(mapboxGl.NavigationControl));

    var CompassControl = (function (_super) {
        __extends(CompassControl, _super);
        function CompassControl(options) {
            if (options === void 0) { options = {}; }
            var _this = this;
            options = Object.assign({}, options, { showZoom: false });
            _this = _super.call(this, options) || this;
            return _this;
        }
        return CompassControl;
    }(mapboxGl.NavigationControl));

    var MapboxglAdapter = (function () {
        function MapboxglAdapter() {
            this.displayProjection = 'EPSG:3857';
            this.lonlatProjection = 'EPSG:4326';
            this.emitter = new EventEmitter();
            this.layerAdapters = MapboxglAdapter.layerAdapters;
            this._layers = {};
            this._baseLayers = [];
            this.DPI = 1000 / 39.37 / 0.28;
            this.IPM = 39.37;
            this.isLoaded = false;
            this.orders = [];
            this._sourcedataloading = {};
        }
        MapboxglAdapter.prototype.create = function (options) {
            if (!this.map) {
                this.options = options;
                this.map = new mapboxGl.Map({
                    container: options.target,
                    center: [96, 63],
                    zoom: 2,
                    style: {
                        version: 8,
                        name: 'Empty style',
                        sources: {},
                        layers: [],
                    },
                });
                this._addEventsListeners();
            }
        };
        MapboxglAdapter.prototype.getContainer = function () {
            return this.map.getContainer();
        };
        MapboxglAdapter.prototype.setCenter = function (latLng) {
        };
        MapboxglAdapter.prototype.setZoom = function (zoom) {
        };
        MapboxglAdapter.prototype.fit = function (extent) {
        };
        MapboxglAdapter.prototype.setRotation = function (angle) {
        };
        MapboxglAdapter.prototype.showLayer = function (layerName) {
            var _this = this;
            this.onMapLoad(function () { return _this.toggleLayer(layerName, true); });
        };
        MapboxglAdapter.prototype.hideLayer = function (layerName) {
            var _this = this;
            this.onMapLoad(function () { return _this.toggleLayer(layerName, false); });
        };
        MapboxglAdapter.prototype.addLayer = function (adapterDef, options, baselayer) {
            var _this = this;
            return this.onMapLoad(function () {
                var adapterEngine;
                if (typeof adapterDef === 'string') {
                    adapterEngine = _this.getLayerAdapter(adapterDef);
                }
                if (adapterEngine) {
                    var adapter_1 = new adapterEngine(_this.map, options);
                    if (baselayer && _this.orders.length) {
                        options.before = _this.orders[0];
                    }
                    var addlayerFun = adapter_1.addLayer(options);
                    var toResolve_1 = function () {
                        var layerId = adapter_1.name;
                        _this._layers[layerId] = false;
                        _this.orders.push(layerId);
                        _this._baseLayers.push(layerId);
                        if (!baselayer) {
                            _this.map.moveLayer(layerId);
                        }
                        else {
                            _this.map.moveLayer(layerId, _this.orders[0]);
                        }
                        return adapter_1;
                    };
                    return addlayerFun.then ? addlayerFun.then(function (layer) { return toResolve_1(); }) : Promise.resolve(toResolve_1());
                }
            });
        };
        MapboxglAdapter.prototype.removeLayer = function (layerId) {
            if (this._layers[layerId]) {
                this.map.removeLayer(layerId);
                this.map.removeSource(layerId);
                delete this._layers[layerId];
            }
        };
        MapboxglAdapter.prototype.getLayer = function (layerName) {
            return this._layers[layerName] !== undefined;
        };
        MapboxglAdapter.prototype.isLayerOnTheMap = function (layerName) {
            return this._layers[layerName];
        };
        MapboxglAdapter.prototype.getLayers = function () {
            return Object.keys(this._layers);
        };
        MapboxglAdapter.prototype.setLayerOpacity = function (layerName, opacity) {
            var _this = this;
            this.onMapLoad().then(function () {
                var layer = _this.map.getLayer(layerName);
                if (layer) {
                    _this.map.setPaintProperty(layerName, layer.type + '-opacity', opacity);
                }
            });
        };
        MapboxglAdapter.prototype.getScaleForResolution = function (res, mpu) {
            return parseFloat(res) * (mpu * this.IPM * this.DPI);
        };
        MapboxglAdapter.prototype.getResolutionForScale = function (scale, mpu) {
            return parseFloat(scale) / (mpu * this.IPM * this.DPI);
        };
        MapboxglAdapter.prototype.onMapLoad = function (cb) {
            var _this = this;
            return new Promise(function (resolve) {
                if (_this.isLoaded) {
                    resolve(cb && cb());
                }
                else {
                    _this.map.once('load', function () {
                        _this.isLoaded = true;
                        resolve(cb && cb());
                    });
                }
            });
        };
        MapboxglAdapter.prototype.toggleLayer = function (layerId, status) {
            var _this = this;
            this.onMapLoad().then(function () {
                var exist = _this._layers[layerId];
                if (exist !== undefined && exist !== status) {
                    _this.map.setLayoutProperty(layerId, 'visibility', status ? 'visible' : 'none');
                    _this._layers[layerId] = status;
                }
            });
        };
        MapboxglAdapter.prototype.addControl = function (controlDef, position) {
            var control;
            if (typeof controlDef === 'string') {
                var engine = MapboxglAdapter.controlAdapters[controlDef];
                if (engine) {
                    control = new engine();
                }
            }
            else {
                control = controlDef;
            }
            if (control) {
                this.map.addControl(control, position);
            }
        };
        MapboxglAdapter.prototype.onMapClick = function (evt) {
            var latLng = evt.lngLat;
            var _a = evt.point, x = _a.x, y = _a.y;
            this.emitter.emit('click', { latLng: latLng, pixel: { top: y, left: x } });
        };
        MapboxglAdapter.prototype.getLayerAdapter = function (name) {
            return MapboxglAdapter.layerAdapters[name];
        };
        MapboxglAdapter.prototype._addEventsListeners = function () {
            var _this = this;
            this.map.on('sourcedataloading', function (data) {
                _this._sourcedataloading[data.sourceId] = _this._sourcedataloading[data.sourceId] || [];
                if (data.tile) {
                    _this._sourcedataloading[data.sourceId].push(data.tile);
                }
            });
            this.map.on('sourcedata', function (data) {
                if (data.dataType === 'source') {
                    var isLoaded = data.isSourceLoaded;
                    var emit_1 = function (target) {
                        if (_this._layers[target]) {
                            _this.emitter.emit('data-loaded', { target: target });
                        }
                    };
                    if (isLoaded) {
                        Object.keys(_this._sourcedataloading).forEach(function (x) {
                            emit_1(x);
                        });
                        _this._sourcedataloading = {};
                    }
                    else {
                        var tiles = _this._sourcedataloading[data.sourceId];
                        if (tiles && data.tile) {
                            var index = tiles.indexOf(data.tile);
                            if (index !== -1) {
                                _this._sourcedataloading[data.sourceId].splice(index, 1);
                            }
                            if (!tiles.length) {
                                emit_1(data.sourceId);
                                delete _this._sourcedataloading[data.sourceId];
                            }
                        }
                    }
                }
            });
            this.map.on('click', function (evt) {
                _this.onMapClick(evt);
            });
        };
        MapboxglAdapter.layerAdapters = {
            TILE: TileAdapter,
            MVT: MvtAdapter,
            OSM: OsmAdapter,
        };
        MapboxglAdapter.controlAdapters = {
            ZOOM: ZoomControl,
            COMPASS: CompassControl,
        };
        return MapboxglAdapter;
    }());

    exports.MapboxglAdapter = MapboxglAdapter;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mapbox-gl-adapter.js.map
