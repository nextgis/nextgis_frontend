(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('leaflet')) :
  typeof define === 'function' && define.amd ? define(['exports', 'leaflet'], factory) :
  (factory((global.LeafletMapAdapter = {}),global.leaflet));
}(this, (function (exports,leaflet) { 'use strict';

  var leaflet__default = 'default' in leaflet ? leaflet['default'] : leaflet;

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

  function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
              t[p[i]] = s[p[i]];
      return t;
  }

  var ID = 1;
  var BaseAdapter = (function () {
      function BaseAdapter(map, options) {
          this.map = map;
          this.name = options.id || String(ID++);
          this.options = Object.assign({}, this.options, options);
      }
      BaseAdapter.prototype.addLayer = function (options) {
          return null;
      };
      return BaseAdapter;
  }());

  var ID$1 = 1;
  var TileAdapter = (function (_super) {
      __extends(TileAdapter, _super);
      function TileAdapter() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      TileAdapter.prototype.addLayer = function (options) {
          this.name = options.id || 'tile-' + ID$1++;
          var url = options.url, opt = __rest(options, ["url"]);
          var layer = new leaflet.TileLayer(url, opt);
          return layer;
      };
      return TileAdapter;
  }(BaseAdapter));

  var ID$2 = 1;
  var GeoJsonAdapter = (function (_super) {
      __extends(GeoJsonAdapter, _super);
      function GeoJsonAdapter() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      GeoJsonAdapter.prototype.addLayer = function (options) {
          this.name = options.id || 'geojson-' + ID$2++;
          var layer = new leaflet.GeoJSON(options.data, options);
          return layer;
      };
      return GeoJsonAdapter;
  }(BaseAdapter));

  var AttributionControl = (function (_super) {
      __extends(AttributionControl, _super);
      function AttributionControl(options) {
          var _this = _super.call(this, options) || this;
          if (options.customAttribution) {
              var attributions = [].concat(options.customAttribution);
              attributions.forEach(function (x) { return _this.addAttribution(x); });
          }
          return _this;
      }
      return AttributionControl;
  }(leaflet.Control.Attribution));

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var leaflet_wms = createCommonjsModule(function (module) {
  /*!
   * leaflet.wms.js
   * A collection of Leaflet utilities for working with Web Mapping services.
   * (c) 2014-2016, Houston Engineering, Inc.
   * MIT License
   */

  (function (factory) {
      // Module systems magic dance, Leaflet edition
      {
          // Node/CommonJS
          module.exports = factory(leaflet__default);
      }
  }(function (L) {

  // Module object
  var wms = {};

  // Quick shim for Object.keys()
  if (!('keys' in Object)) {
      Object.keys = function(obj) {
          var result = [];
          for (var i in obj) {
              if (obj.hasOwnProperty(i)) {
                  result.push(i);
              }
          }
          return result;
      };
  }

  /*
   * wms.Source
   * The Source object manages a single WMS connection.  Multiple "layers" can be
   * created with the getLayer function, but a single request will be sent for
   * each image update.  Can be used in non-tiled "overlay" mode (default), or
   * tiled mode, via an internal wms.Overlay or wms.TileLayer, respectively.
   */
  wms.Source = L.Layer.extend({
      'options': {
          'untiled': true,
          'identify': true
      },

      'initialize': function(url, options) {
          L.setOptions(this, options);
          if (this.options.tiled) {
              this.options.untiled = false;
          }
          this._url = url;
          this._subLayers = {};
          this._overlay = this.createOverlay(this.options.untiled);
      },

      'createOverlay': function(untiled) {
          // Create overlay with all options other than untiled & identify
          var overlayOptions = {};
          for (var opt in this.options) {
              if (opt != 'untiled' && opt != 'identify') {
                  overlayOptions[opt] = this.options[opt];
              }
          }
          if (untiled) {
              return wms.overlay(this._url, overlayOptions);
          } else {
              return wms.tileLayer(this._url, overlayOptions);
          }
      },

      'onAdd': function() {
          this.refreshOverlay();
      },

      'getEvents': function() {
          if (this.options.identify) {
              return {'click': this.identify};
          } else {
              return {};
          }
      },

      'setOpacity': function(opacity) {
           this.options.opacity = opacity;
           if (this._overlay) {
               this._overlay.setOpacity(opacity);
           }
      },
      
      'bringToBack': function() {
           this.options.isBack = true;
           if (this._overlay) {
               this._overlay.bringToBack();
           }
      },

      'bringToFront': function() {
           this.options.isBack = false;
           if (this._overlay) {
               this._overlay.bringToFront();
           }
      },

      'getLayer': function(name) {
          return wms.layer(this, name);
      },

      'addSubLayer': function(name) {
          this._subLayers[name] = true;
          this.refreshOverlay();
      },

      'removeSubLayer': function(name) {
          delete this._subLayers[name];
          this.refreshOverlay();
      },

      'refreshOverlay': function() {
          var subLayers = Object.keys(this._subLayers).join(",");
          if (!this._map) {
              return;
          }
          if (!subLayers) {
              this._overlay.remove();
          } else {
              this._overlay.setParams({'layers': subLayers});
              this._overlay.addTo(this._map);
          }
      },

      'identify': function(evt) {
          // Identify map features in response to map clicks. To customize this
          // behavior, create a class extending wms.Source and override one or
          // more of the following hook functions.

          var layers = this.getIdentifyLayers();
          if (!layers.length) {
              return;
          }
          this.getFeatureInfo(
              evt.containerPoint, evt.latlng, layers,
              this.showFeatureInfo
          );
      },

      'getFeatureInfo': function(point, latlng, layers, callback) {
          // Request WMS GetFeatureInfo and call callback with results
          // (split from identify() to faciliate use outside of map events)
          var params = this.getFeatureInfoParams(point, layers),
              url = this._url + L.Util.getParamString(params, this._url);

          this.showWaiting();
          this.ajax(url, done);

          function done(result) {
              this.hideWaiting();
              var text = this.parseFeatureInfo(result, url);
              callback.call(this, latlng, text);
          }
      },

      'ajax': function(url, callback) {
          ajax.call(this, url, callback);
      },

      'getIdentifyLayers': function() {
          // Hook to determine which layers to identify
          if (this.options.identifyLayers)
              return this.options.identifyLayers;
          return Object.keys(this._subLayers);
       },

      'getFeatureInfoParams': function(point, layers) {
          // Hook to generate parameters for WMS service GetFeatureInfo request
          var wmsParams, overlay;
          if (this.options.untiled) {
              // Use existing overlay
              wmsParams = this._overlay.wmsParams;
          } else {
              // Create overlay instance to leverage updateWmsParams
              overlay = this.createOverlay(true);
              overlay.updateWmsParams(this._map);
              wmsParams = overlay.wmsParams;
              wmsParams.layers = layers.join(',');
          }
          var infoParams = {
              'request': 'GetFeatureInfo',
              'query_layers': layers.join(','),
              'X': Math.round(point.x),
              'Y': Math.round(point.y)
          };
          return L.extend({}, wmsParams, infoParams);
      },

      'parseFeatureInfo': function(result, url) {
          // Hook to handle parsing AJAX response
          if (result == "error") {
              // AJAX failed, possibly due to CORS issues.
              // Try loading content in <iframe>.
              result = "<iframe src='" + url + "' style='border:none'>";
          }
          return result;
      },

      'showFeatureInfo': function(latlng, info) {
          // Hook to handle displaying parsed AJAX response to the user
          if (!this._map) {
              return;
          }
          this._map.openPopup(info, latlng);
      },

      'showWaiting': function() {
          // Hook to customize AJAX wait animation
          if (!this._map)
              return;
          this._map._container.style.cursor = "progress";
      },

      'hideWaiting': function() {
          // Hook to remove AJAX wait animation
          if (!this._map)
              return;
          this._map._container.style.cursor = "default";
      }
  });

  wms.source = function(url, options) {
      return new wms.Source(url, options);
  };

  /*
   * Layer
   * Leaflet "layer" with all actual rendering handled via an underlying Source
   * object.  Can be called directly with a URL to automatically create or reuse
   * an existing Source.  Note that the auto-source feature doesn't work well in
   * multi-map environments; so for best results, create a Source first and use
   * getLayer() to retrieve wms.Layer instances.
   */

  wms.Layer = L.Layer.extend({
      'initialize': function(source, layerName, options) {
          L.setOptions(this, options);
          if (!source.addSubLayer) {
              // Assume source is a URL
              source = wms.getSourceForUrl(source, options);
          }
          this._source = source;
          this._name = layerName;
      },
      'onAdd': function() {
          if (!this._source._map)
              this._source.addTo(this._map);
          this._source.addSubLayer(this._name);
      },
      'onRemove': function() {
          this._source.removeSubLayer(this._name);
      },
      'setOpacity': function(opacity) {
          this._source.setOpacity(opacity);
      },
      'bringToBack': function() {
          this._source.bringToBack();
      },
      'bringToFront': function() {
          this._source.bringToFront();
      }
  });

  wms.layer = function(source, options) {
      return new wms.Layer(source, options);
  };

  // Cache of sources for use with wms.Layer auto-source option
  var sources = {};
  wms.getSourceForUrl = function(url, options) {
      if (!sources[url]) {
          sources[url] = wms.source(url, options);
      }
      return sources[url];
  };


  // Copy tiled WMS layer from leaflet core, in case we need to subclass it later
  wms.TileLayer = L.TileLayer.WMS;
  wms.tileLayer = L.tileLayer.wms;

  /*
   * wms.Overlay:
   * "Single Tile" WMS image overlay that updates with map changes.
   * Portions of wms.Overlay are directly extracted from L.TileLayer.WMS.
   * See Leaflet license.
   */
  wms.Overlay = L.Layer.extend({
      'defaultWmsParams': {
          'service': 'WMS',
          'request': 'GetMap',
          'version': '1.1.1',
          'layers': '',
          'styles': '',
          'format': 'image/jpeg',
          'transparent': false
      },

      'options': {
          'crs': null,
          'uppercase': false,
          'attribution': '',
          'opacity': 1,
          'isBack': false,
          'minZoom': 0,
          'maxZoom': 18
      },

      'initialize': function(url, options) {
          this._url = url;

          // Move WMS parameters to params object
          var params = {};
          for (var opt in options) {
               if (!(opt in this.options)) {
                   params[opt] = options[opt];
                   delete options[opt];
               }
          }
          L.setOptions(this, options);
          this.wmsParams = L.extend({}, this.defaultWmsParams, params);
      },

      'setParams': function(params) {
          L.extend(this.wmsParams, params);
          this.update();
      },

      'getAttribution': function() {
          return this.options.attribution;
      },

      'onAdd': function() {
          this.update();
      },

      'onRemove': function(map) {
          if (this._currentOverlay) {
              map.removeLayer(this._currentOverlay);
              delete this._currentOverlay;
          }
          if (this._currentUrl) {
              delete this._currentUrl;
          }
      },

      'getEvents': function() {
          return {
              'moveend': this.update
          };
      },

      'update': function() {
          if (!this._map) {
              return;
          }
          // Determine image URL and whether it has changed since last update
          this.updateWmsParams();
          var url = this.getImageUrl();
          if (this._currentUrl == url) {
              return;
          }
          this._currentUrl = url;

          // Keep current image overlay in place until new one loads
          // (inspired by esri.leaflet)
          var bounds = this._map.getBounds();
          var overlay = L.imageOverlay(url, bounds, {'opacity': 0});
          overlay.addTo(this._map);
          overlay.once('load', _swap, this);
          function _swap() {
              if (!this._map) {
                  return;
              }
              if (overlay._url != this._currentUrl) {
                  this._map.removeLayer(overlay);
                  return;
              } else if (this._currentOverlay) {
                  this._map.removeLayer(this._currentOverlay);
              }
              this._currentOverlay = overlay;
              overlay.setOpacity(
                  this.options.opacity ? this.options.opacity : 1
              );
              if (this.options.isBack === true) {
                  overlay.bringToBack();
              }
              if (this.options.isBack === false) {
                  overlay.bringToFront();
              }
          }
          if ((this._map.getZoom() < this.options.minZoom) ||
              (this._map.getZoom() > this.options.maxZoom)){
              this._map.removeLayer(overlay);
          }
      },

      'setOpacity': function(opacity) {
           this.options.opacity = opacity;
           if (this._currentOverlay) {
               this._currentOverlay.setOpacity(opacity);
           }
      },

      'bringToBack': function() {
          this.options.isBack = true;
          if (this._currentOverlay) {
              this._currentOverlay.bringToBack();
          }
      },

      'bringToFront': function() {
          this.options.isBack = false;
          if (this._currentOverlay) {
              this._currentOverlay.bringToFront();
          }
      },

      // See L.TileLayer.WMS: onAdd() & getTileUrl()
      'updateWmsParams': function(map) {
          if (!map) {
              map = this._map;
          }
          // Compute WMS options
          var bounds = map.getBounds();
          var size = map.getSize();
          var wmsVersion = parseFloat(this.wmsParams.version);
          var crs = this.options.crs || map.options.crs;
          var projectionKey = wmsVersion >= 1.3 ? 'crs' : 'srs';
          var nw = crs.project(bounds.getNorthWest());
          var se = crs.project(bounds.getSouthEast());

          // Assemble WMS parameter string
          var params = {
              'width': size.x,
              'height': size.y
          };
          params[projectionKey] = crs.code;
          params.bbox = (
              wmsVersion >= 1.3 && crs === L.CRS.EPSG4326 ?
              [se.y, nw.x, nw.y, se.x] :
              [nw.x, se.y, se.x, nw.y]
          ).join(',');

          L.extend(this.wmsParams, params);
      },

      'getImageUrl': function() {
          var uppercase = this.options.uppercase || false;
          var pstr = L.Util.getParamString(this.wmsParams, this._url, uppercase);
          return this._url + pstr;
      }
  });

  wms.overlay = function(url, options) {
      return new wms.Overlay(url, options);
  };

  // Simple AJAX helper (since we can't assume jQuery etc. are present)
  function ajax(url, callback) {
      var context = this,
          request = new XMLHttpRequest();
      request.onreadystatechange = change;
      request.open('GET', url);
      request.send();

      function change() {
          if (request.readyState === 4) {
              if (request.status === 200) {
                  callback.call(context, request.responseText);
              } else {
                  callback.call(context, "error");
              }
          }
      }
  }

  return wms;

  }));
  });

  var ID$3 = 1;
  var ImageAdapter = (function () {
      function ImageAdapter() {
      }
      ImageAdapter.prototype.addLayer = function (options) {
          options = __assign({ transparent: true }, options);
          var updateWmsParamsFromOpt = options.updateWmsParams;
          this.name = options.id || 'image-' + ID$3++;
          this.layer = leaflet_wms.overlay(options.url, options);
          if (updateWmsParamsFromOpt) {
              var updateWmsParams_1 = this.layer.updateWmsParams;
              this.layer.updateWmsParams = function (map) {
                  updateWmsParams_1.call(this, map);
                  this.wmsParams = updateWmsParamsFromOpt(this.wmsParams);
              };
          }
          return this.layer;
      };
      return ImageAdapter;
  }());

  var LeafletMapAdapter = (function () {
      function LeafletMapAdapter() {
          this.options = { target: 'map' };
          this.layerAdapters = LeafletMapAdapter.layerAdapters;
          this.displayProjection = 'EPSG:3857';
          this.lonlatProjection = 'EPSG:4326';
          this.emitter = new EventEmitter();
          this._layers = {};
          this.DPI = 1000 / 39.37 / 0.28;
          this.IPM = 39.37;
          this._order = 0;
          this._length = 9999;
          this._baseLayers = [];
      }
      LeafletMapAdapter.prototype.create = function (options) {
          if (options === void 0) { options = { target: 'map' }; }
          this.options = Object.assign({}, options);
          this.map = new leaflet.Map(this.options.target, { zoomControl: false, attributionControl: false });
          this.emitter.emit('create', { map: this.map });
          this._addMapListeners();
      };
      LeafletMapAdapter.prototype.getContainer = function () {
          return this.map.getContainer();
      };
      LeafletMapAdapter.prototype.onMapLoad = function (cb) {
          return new Promise(function (resolve) {
              resolve(cb && cb());
          });
      };
      LeafletMapAdapter.prototype.setCenter = function (latLng) {
          this.map.setView(latLng, this.map.getZoom());
      };
      LeafletMapAdapter.prototype.setZoom = function (zoom) {
          this.map.setZoom(zoom);
      };
      LeafletMapAdapter.prototype.fit = function (e) {
          this.map.fitBounds([[e[3], e[0]], [e[1], e[2]]]);
      };
      LeafletMapAdapter.prototype.getLayerAdapter = function (name) {
          return LeafletMapAdapter.layerAdapters[name];
      };
      LeafletMapAdapter.prototype.getLayer = function (layerName) {
          return this._layers[layerName] !== undefined;
      };
      LeafletMapAdapter.prototype.getLayers = function () {
          return Object.keys(this._layers);
      };
      LeafletMapAdapter.prototype.isLayerOnTheMap = function (layerName) {
          var layerMem = this._layers[layerName];
          return layerMem.onMap;
      };
      LeafletMapAdapter.prototype.addControl = function (controlDef, position, options) {
          var control;
          if (typeof controlDef === 'string') {
              var engine = LeafletMapAdapter.controlAdapters[controlDef];
              if (engine) {
                  control = new engine(options);
              }
          }
          else {
              control = controlDef;
          }
          if (control) {
              control.options.position = position.replace('-', '');
              this.map.addControl(control);
              return control;
          }
      };
      LeafletMapAdapter.prototype.addLayer = function (adapterDef, options, baselayer) {
          var _this = this;
          var adapterEngine;
          if (typeof adapterDef === 'string') {
              adapterEngine = this.getLayerAdapter(adapterDef);
          }
          else {
              adapterEngine = adapterDef;
          }
          if (adapterEngine) {
              var adapter_1 = new adapterEngine(this.map, options);
              var layer = adapter_1.addLayer(options);
              var addlayerFun = adapter_1.addLayer(options);
              var toResolve_1 = function (l) {
                  var layerId = adapter_1.name;
                  var layerOpts = { layer: l, onMap: false };
                  if (baselayer) {
                      layerOpts.baseLayer = true;
                      _this._baseLayers.push(layerId);
                  }
                  else {
                      layerOpts.order = options.order || _this._order++;
                  }
                  _this._layers[layerId] = layerOpts;
                  return adapter_1;
              };
              return addlayerFun.then ? addlayerFun.then(function (l) { return toResolve_1(l); }) : Promise.resolve(toResolve_1(layer));
          }
          return Promise.reject('No adapter');
      };
      LeafletMapAdapter.prototype.removeLayer = function (layerName) {
      };
      LeafletMapAdapter.prototype.showLayer = function (layerName) {
          this.toggleLayer(layerName, true);
      };
      LeafletMapAdapter.prototype.hideLayer = function (layerName) {
          this.toggleLayer(layerName, false);
      };
      LeafletMapAdapter.prototype.setLayerOpacity = function (layerName, value) {
      };
      LeafletMapAdapter.prototype.getScaleForResolution = function (res, mpu) {
          return parseFloat(res) * (mpu * this.IPM * this.DPI);
      };
      LeafletMapAdapter.prototype.getResolutionForScale = function (scale, mpu) {
          return parseFloat(scale) / (mpu * this.IPM * this.DPI);
      };
      LeafletMapAdapter.prototype.toggleLayer = function (layerName, status) {
          var _this = this;
          var action = function (source, l) {
              if (status) {
                  if (source instanceof leaflet.Map) {
                      l.layer.addTo(source);
                      if (l.layer.setZIndex) {
                          var order = l.baseLayer ? 0 : _this._length - l.order;
                          l.layer.setZIndex(order);
                      }
                  }
              }
              else {
                  source.removeLayer(l.layer);
              }
              l.onMap = status;
          };
          var layer = this._layers[layerName];
          if (layer && layer.onMap !== status) {
              if (this.map) {
                  action(this.map, layer);
              }
              else {
                  this.emitter.once('create', function (data) {
                      action(data.map, layer);
                  });
              }
          }
      };
      LeafletMapAdapter.prototype.onMapClick = function (evt) {
          var coord = evt.containerPoint;
          var latLng = evt.latlng;
          this.emitter.emit('click', {
              latLng: latLng,
              pixel: { left: coord.x, top: coord.y },
              source: evt,
          });
      };
      LeafletMapAdapter.prototype._addMapListeners = function () {
          var _this = this;
          this.map.on('click', function (evt) {
              _this.onMapClick(evt);
          });
      };
      LeafletMapAdapter.layerAdapters = {
          IMAGE: ImageAdapter,
          TILE: TileAdapter,
          GEOJSON: GeoJsonAdapter,
      };
      LeafletMapAdapter.controlAdapters = {
          ZOOM: leaflet.Control.Zoom,
          ATTRIBUTION: AttributionControl,
      };
      return LeafletMapAdapter;
  }());

  exports.LeafletMapAdapter = LeafletMapAdapter;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=leaflet-map-adapter.js.map
