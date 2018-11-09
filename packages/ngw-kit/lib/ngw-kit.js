(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@nextgis/ngw-connector')) :
    typeof define === 'function' && define.amd ? define(['exports', '@nextgis/ngw-connector'], factory) :
    (factory((global.NgwKit = {}),global.NgwConnector));
}(this, (function (exports,NgwConnector) { 'use strict';

    NgwConnector = NgwConnector && NgwConnector.hasOwnProperty('default') ? NgwConnector['default'] : NgwConnector;

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

    var NgwKit = (function () {
        function NgwKit(options) {
            this.options = {};
            this.pixelRadius = 10;
            this.options = __assign({}, this.options, options);
            if (this.options.pixelRadius) {
                this.pixelRadius = options.pixelRadius;
            }
            this.url = this.options.baseUrl;
            this.resourceId = options.resourceId;
            this.connector = new NgwConnector({ baseUrl: this.url, auth: this.options.auth });
        }
        NgwKit.addNgwLayer = function (options, webMap, baseUrl) {
            var adapter = options.adapter || 'IMAGE';
            if (adapter === 'IMAGE' || adapter === 'TILE') {
                var url = baseUrl;
                var addLayerPromise = void 0;
                var isImageAllowed = webMap.map.layerAdapters ? webMap.map.layerAdapters.IMAGE : true;
                if (adapter === 'IMAGE' && isImageAllowed) {
                    url += '/api/component/render/image';
                    addLayerPromise = webMap.map.addLayer(adapter, {
                        url: url,
                        id: String(options.id),
                        resourceId: options.id,
                        updateWmsParams: function (params) { return NgwKit.updateWmsParams(params, options.id); }
                    });
                }
                else if (adapter === 'TILE') {
                    url += '/api/component/render/tile?z={z}&x={x}&y={y}&resource=' + options.id;
                    addLayerPromise = webMap.map.addLayer(adapter, { url: url, id: String(options.id) });
                }
                return addLayerPromise;
            }
            else {
                throw new Error(adapter + ' not supported yet. Only TILE');
            }
        };
        NgwKit.prototype.getSettings = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.connector.request('resource.item', { id: _this.resourceId }).then(function (data) {
                    var webmap = data.webmap;
                    if (webmap) {
                        _this._updateItemsParams(webmap.root_item);
                        resolve(data.webmap);
                    }
                });
            });
        };
        NgwKit.prototype.onMapClick = function (ev, webMap) {
        };
        NgwKit.prototype.sendIdentifyRequest = function (ev, webMap, options) {
            if (options === void 0) { options = {}; }
            if (webMap.map.requestGeomString) {
                webMap.emitter.emit('start-identify', { ev: ev });
                var geom = webMap.map.requestGeomString(ev.pixel, this.pixelRadius);
                var layers = options.layers;
                if (!layers) {
                    layers = webMap.layers.tree.getDescendants().filter(function (x) {
                        return x.item.item_type === 'layer' && x.properties.get('visibility');
                    }).map(function (x) { return String(Number(x.item.layer_style_id) - 1); });
                }
                var data = {
                    geom: geom,
                    srs: 3857,
                    layers: layers,
                };
                return this.connector.post('feature_layer.identify', { data: data }).then(function (resp) {
                    webMap.emitter.emit('identify', { ev: ev, data: resp });
                    return resp;
                });
            }
        };
        NgwKit.prototype._updateItemsParams = function (item) {
            var _this = this;
            if (item) {
                if (item.children) {
                    item.children.forEach(function (x) { return _this._updateItemsParams(x); });
                }
                else if (item.item_type === 'layer' && item.layer_adapter === 'image') {
                    var url = fixUrlStr(this.url + '/api/component/render/image');
                    item.url = url;
                    item.resourceId = item.layer_style_id;
                    item.updateWmsParams = function (params) { return NgwKit.updateWmsParams(params, item.resourceId); };
                }
            }
        };
        NgwKit.updateWmsParams = function (params, resourceId) {
            var bbox = params.bbox, width = params.width, height = params.height;
            return {
                resource: resourceId,
                extent: bbox,
                size: width + ',' + height,
                timestamp: Date.now(),
            };
        };
        return NgwKit;
    }());
    function fixUrlStr(url) {
        return url.replace(/([^:]\/)\/+/g, '$1');
    }

    exports.NgwKit = NgwKit;
    exports.fixUrlStr = fixUrlStr;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngw-kit.js.map
