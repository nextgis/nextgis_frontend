"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Tile_1 = __importDefault(require("ol/layer/Tile"));
var Image_1 = __importDefault(require("ol/layer/Image"));
var ImageWMS_1 = __importDefault(require("ol/source/ImageWMS"));
var Map_1 = __importDefault(require("ol/Map"));
var proj_1 = require("ol/proj");
var OSM_1 = __importDefault(require("ol/source/OSM"));
var View_1 = __importDefault(require("ol/View"));
var ORDER = 0;
var LENGTH = 9999; // TODO: get real layers length count, after all registered
var OlMapAdapter = /** @class */ (function () {
    function OlMapAdapter() {
        this.displayProjection = 'EPSG:3857';
        this.lonlatProjection = 'EPSG:4326';
        this.DPI = 1000 / 39.37 / 0.28;
        this.IPM = 39.37;
        this._layers = {};
    }
    // create(options: MapOptions = {target: 'map'}) {
    OlMapAdapter.prototype.create = function (options) {
        if (options === void 0) { options = { target: 'map' }; }
        var view = new View_1.default({
            center: [-9101767, 2822912],
            zoom: 14,
            projection: this.displayProjection,
        });
        var defOpt = {
            logo: false,
            controls: [],
            view: view,
            layers: [
                new Tile_1.default({
                    source: new OSM_1.default(),
                }),
            ],
        };
        var mapInitOptions = __assign({}, defOpt, options);
        this._olMap = new Map_1.default(mapInitOptions);
        // this._olMap.addLayer(new TileLayer({ source: new OSM()}));
        this._olView = this._olMap.getView();
        // olView.on('change:resolution', (evt) => {
        //   this.set('resolution', olView.getResolution());
        // });
        // olView.on('change:center', (evt) => {
        //   this.set('center', olView.getCenter());
        // });
    };
    OlMapAdapter.prototype.setCenter = function (latLng) {
        this._olView.setCenter(proj_1.fromLonLat(latLng));
    };
    OlMapAdapter.prototype.setZoom = function (zoom) {
        this._olView.setZoom(zoom);
    };
    OlMapAdapter.prototype.fit = function (extent) {
        extent = proj_1.transformExtent(extent, this.lonlatProjection, this.displayProjection);
        this._olView.fit(extent);
    };
    OlMapAdapter.prototype.setRotation = function (angle) {
        this._olView.setRotation(angle);
    };
    OlMapAdapter.prototype.addLayer = function (layerName) {
        this._toggleLayer(true, layerName);
    };
    OlMapAdapter.prototype.removeLayer = function (layerName) {
        this._toggleLayer(false, layerName);
    };
    OlMapAdapter.prototype.registrateWmsLayer = function (layerName, options) {
        if (!layerName) {
            throw new Error('layerName is required parameter');
        }
        var layer = this._layers[layerName];
        if (!layer) {
            layer = this._imageAdapter(options);
            this._layers[layerName] = { layer: layer, order: options.order || ORDER++ };
            // LENGTH++;
        }
        return layer;
    };
    OlMapAdapter.prototype.getScaleForResolution = function (res, mpu) {
        return parseFloat(res) * (mpu * this.IPM * this.DPI);
    };
    OlMapAdapter.prototype.getResolutionForScale = function (scale, mpu) {
        return parseFloat(scale) / (mpu * this.IPM * this.DPI);
    };
    OlMapAdapter.prototype._toggleLayer = function (status, layerName) {
        var action = function (source, l) {
            if (status) {
                if (source instanceof Map_1.default) {
                    source.addLayer(l.layer);
                    l.layer.setZIndex(LENGTH - l.order);
                }
            }
            else {
                source.removeLayer(l.layer);
            }
        };
        var layer = this._layers[layerName];
        if (layer) {
            action(this._olMap, layer);
        }
    };
    OlMapAdapter.prototype._imageAdapter = function (item) {
        // const options = {
        //   maxResolution: item.maxResolution ? item.maxResolution : undefined,
        //   minResolution: item.minResolution ? item.minResolution : undefined,
        //   visible: item.visibility,
        //   opacity: item.transparency ? (1 - item.transparency / 100) : 1.0,
        // };
        var source = new ImageWMS_1.default({
            url: item.url,
            params: {
                resource: item.styleId,
            },
            ratio: 1,
            imageLoadFunction: function (image, src) {
                // const url = src.split('?')[0];
                // const query = src.split('?')[1];
                // const queryObject = queryToObject(query);
                // image.getImage().src = url
                //   + '?resource=' + queryObject.resource
                //   + '&extent=' + queryObject.BBOX
                //   + '&size=' + queryObject.WIDTH + ',' + queryObject.HEIGHT
                //   + '#' + Date.now(); // in-memory cache busting
            },
        });
        var layer = new Image_1.default({ source: source });
        return layer;
    };
    return OlMapAdapter;
}());
exports.OlMapAdapter = OlMapAdapter;
