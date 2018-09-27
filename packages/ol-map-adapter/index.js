(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ol/source/ImageWMS'), require('ol/layer/Image'), require('ol/source/OSM'), require('ol/layer/Tile'), require('ol/geom/Point'), require('ol/Feature'), require('ol/proj'), require('ol/layer'), require('ol/source/Vector'), require('tslib'), require('ol/Map'), require('ol/View'), require('events')) :
  typeof define === 'function' && define.amd ? define(['exports', 'ol/source/ImageWMS', 'ol/layer/Image', 'ol/source/OSM', 'ol/layer/Tile', 'ol/geom/Point', 'ol/Feature', 'ol/proj', 'ol/layer', 'ol/source/Vector', 'tslib', 'ol/Map', 'ol/View', 'events'], factory) :
  (factory((global.OlMapAdapter = {}),global.ImageWMS,global.ImageLayer,global.OSM,global.TileLayer,global.Point,global.Feature,global.proj,global.layer,global.VectorSource,global.tslib_1,global.Map,global.View,global.events));
}(this, (function (exports,ImageWMS,ImageLayer,OSM,TileLayer,Point,Feature,proj,layer,VectorSource,tslib_1,Map,View,events) { 'use strict';

  ImageWMS = ImageWMS && ImageWMS.hasOwnProperty('default') ? ImageWMS['default'] : ImageWMS;
  ImageLayer = ImageLayer && ImageLayer.hasOwnProperty('default') ? ImageLayer['default'] : ImageLayer;
  OSM = OSM && OSM.hasOwnProperty('default') ? OSM['default'] : OSM;
  TileLayer = TileLayer && TileLayer.hasOwnProperty('default') ? TileLayer['default'] : TileLayer;
  Point = Point && Point.hasOwnProperty('default') ? Point['default'] : Point;
  Feature = Feature && Feature.hasOwnProperty('default') ? Feature['default'] : Feature;
  VectorSource = VectorSource && VectorSource.hasOwnProperty('default') ? VectorSource['default'] : VectorSource;
  Map = Map && Map.hasOwnProperty('default') ? Map['default'] : Map;
  View = View && View.hasOwnProperty('default') ? View['default'] : View;

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
          var layer$$1 = new ImageLayer({ source: source });
          return layer$$1;
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

  var OsmAdapter = /** @class */ (function () {
      function OsmAdapter() {
          this.name = 'osm';
      }
      OsmAdapter.prototype.addLayer = function (options) {
          var layer$$1 = new TileLayer({
              source: new OSM(),
          });
          return layer$$1;
      };
      return OsmAdapter;
  }());

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
          var layer$$1 = new layer.Vector({
              source: source
          });
          return layer$$1;
      };
      return MarkerAdapter;
  }());

  var OlMapAdapter = /** @class */ (function () {
      function OlMapAdapter() {
          this.displayProjection = 'EPSG:3857';
          this.lonlatProjection = 'EPSG:4326';
          this.emitter = new events.EventEmitter();
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
          var mapInitOptions = tslib_1.__assign({}, defOpt, options);
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
      OlMapAdapter.prototype.fit = function (e) {
          var extent = proj.transformExtent(e, this.lonlatProjection, this.displayProjection);
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
              var layer$$1 = adapter.addLayer(options);
              var layerId = adapter.name;
              this._layers[layerId] = { layer: layer$$1, order: options.order || this._order++, onMap: false };
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
          var layer$$1 = this._layers[layerName];
          if (layer$$1 && layer$$1.onMap !== status) {
              action(this.map, layer$$1);
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
