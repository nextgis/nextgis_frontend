(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('mapbox-gl')) :
  typeof define === 'function' && define.amd ? define(['exports', 'mapbox-gl'], factory) :
  (factory((global.MapboxglAdapter = {}),global.mapboxgl));
}(this, (function (exports,mapboxgl) { 'use strict';

  mapboxgl = mapboxgl && mapboxgl.hasOwnProperty('default') ? mapboxgl['default'] : mapboxgl;

  var MvtAdapter = /** @class */ (function () {
      function MvtAdapter() {
      }
      MvtAdapter.prototype.addLayer = function (map, name, options) {
          // read about https://blog.mapbox.com/vector-tile-specification-version-2-whats-changed-259d4cd73df6
          var idString = String(name);
          map.addLayer({
              'id': idString,
              'type': 'fill',
              'source-layer': idString,
              'source': {
                  type: 'vector',
                  tiles: [options.url]
              },
              'layout': {
                  visibility: 'none'
              },
              'paint': {
                  'fill-color': 'red',
                  'fill-opacity': 0.8,
                  'fill-opacity-transition': {
                      duration: 0
                  },
                  'fill-outline-color': '#8b0000' // darkred
              }
          });
          return name;
      };
      return MvtAdapter;
  }());

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

  var TileAdapter = /** @class */ (function () {
      function TileAdapter() {
      }
      TileAdapter.prototype.addLayer = function (map, name, options) {
          var tiles;
          if (options && options.subdomains) {
              tiles = options.subdomains.split('').map(function (x) {
                  var subUrl = options.url.replace('{s}', x);
                  return subUrl;
              });
          }
          else {
              tiles = [options.url];
          }
          map.addLayer({
              id: name,
              type: 'raster',
              layout: {
                  visibility: 'none'
              },
              source: {
                  type: 'raster',
                  // point to our third-party tiles. Note that some examples
                  // show a "url" property. This only applies to tilesets with
                  // corresponding TileJSON (such as mapbox tiles).
                  tiles: tiles,
                  tileSize: options && options.tileSize || 256
              }
          });
          return name;
      };
      return TileAdapter;
  }());

  var OsmAdapter = /** @class */ (function (_super) {
      __extends(OsmAdapter, _super);
      function OsmAdapter() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.options = {
              url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              attribution: '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
              subdomains: 'abc'
          };
          return _this;
      }
      OsmAdapter.prototype.addLayer = function (map, name, options) {
          return _super.prototype.addLayer.call(this, map, name, Object.assign({}, this.options, options));
      };
      return OsmAdapter;
  }(TileAdapter));

  var MapboxglAdapter = /** @class */ (function () {
      function MapboxglAdapter() {
          this.displayProjection = 'EPSG:3857';
          this.lonlatProjection = 'EPSG:4326';
          this._layers = {};
          this._baseLayers = [];
          this.DPI = 1000 / 39.37 / 0.28;
          this.IPM = 39.37;
          this.isLoaded = false;
      }
      // create(options: MapOptions = {target: 'map'}) {
      MapboxglAdapter.prototype.create = function (options) {
          this.options = options;
          this.map = new mapboxgl.Map({
              container: options.target,
              center: [96, 63],
              zoom: 2,
              style: {
                  version: 8,
                  name: 'Empty style',
                  sources: {},
                  layers: [],
              }
          });
      };
      MapboxglAdapter.prototype.setCenter = function (latLng) {
          // ignore
      };
      MapboxglAdapter.prototype.setZoom = function (zoom) {
          // ignore
      };
      MapboxglAdapter.prototype.fit = function (extent) {
          // ignore
      };
      MapboxglAdapter.prototype.setRotation = function (angle) {
          // ignore
      };
      MapboxglAdapter.prototype.showLayer = function (layerName) {
          var _this = this;
          this.onMapLoad(function () { return _this.toggleLayer(layerName, true); });
      };
      MapboxglAdapter.prototype.hideLayer = function (layerName) {
          var _this = this;
          this.onMapLoad(function () { return _this.toggleLayer(layerName, false); });
      };
      MapboxglAdapter.prototype.addBaseLayer = function (name, providerDef, options) {
          var _this = this;
          this.onMapLoad(function () {
              var layerId = _this.addLayer(name, providerDef, options);
              if (layerId) {
                  _this._baseLayers.push(layerId);
              }
          });
      };
      MapboxglAdapter.prototype.addLayer = function (layerName, adapterDef, options) {
          var adapterEngine;
          if (typeof adapterDef === 'string') {
              adapterEngine = MapboxglAdapter.layerAdapter[adapterDef];
          }
          if (adapterEngine) {
              var adapter = new adapterEngine(options);
              var layerId = adapter.addLayer(this.map, layerName, options);
              this._layers[layerId] = false;
              return layerId;
          }
          return false;
      };
      MapboxglAdapter.prototype.removeLayer = function (layerName) {
          // this._toggleLayer(false, layerName);
      };
      MapboxglAdapter.prototype.getScaleForResolution = function (res, mpu) {
          return parseFloat(res) * (mpu * this.IPM * this.DPI);
      };
      MapboxglAdapter.prototype.getResolutionForScale = function (scale, mpu) {
          return parseFloat(scale) / (mpu * this.IPM * this.DPI);
      };
      MapboxglAdapter.prototype.onMapLoad = function (cb, context) {
          if (this.isLoaded) { // map.loaded()
              cb.call(context);
          }
          else {
              this.map.once('load', function () {
                  cb.call(context);
              });
          }
      };
      MapboxglAdapter.prototype.toggleLayer = function (layerId, status) {
          var exist = this._layers[layerId];
          if (exist !== undefined && exist !== status) {
              this.map.setLayoutProperty(layerId, 'visibility', status ? 'visible' : 'none');
              this._layers[layerId] = status;
          }
      };
      MapboxglAdapter.layerAdapter = {
          TILE: TileAdapter,
          MVT: MvtAdapter,
          OSM: OsmAdapter
      };
      return MapboxglAdapter;
  }());

  exports.MapboxglAdapter = MapboxglAdapter;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
