/**
 * @module webmap
 */
import {
  LayerAdapter,
  LayerAdapters,
  AdapterConstructor,
  LayerAdaptersOptions,
  AdapterOptions,
  GeoJsonAdapterOptions,
  VectorLayerAdapter,
  DataLayerFilter,
  OnLayerClickOptions,
  PropertiesFilter,
  FilterOptions,
  LayerDefinition
} from './interfaces/LayerAdapter';
import { LayerDef, Type } from './interfaces/BaseTypes';

import { Feature, GeoJsonObject } from 'geojson';
import { preparePaint } from './util/preparePaint';
import { updateGeoJsonAdapterOptions } from './util/updateGeoJsonAdapterOptions';
import {
  GetAttributionsOptions,
  ToggleLayerOptions
} from './interfaces/WebMapApp';
import { propertiesFilter } from './util/propertiesFilter';
import { BaseWebMap } from './BaseWebMap';
import { WebMapEvents } from './interfaces/Events';

export class WebMapLayers<
  M = any,
  L = any,
  C = any,
  E extends WebMapEvents = WebMapEvents
> extends BaseWebMap<M, L, C, E> {
  private _layersIdCounter = 1;
  private _layersOrderCounter = 1;
  private readonly _baseLayers: string[] = [];
  private readonly _layers: { [id: string]: LayerAdapter } = {};
  private readonly _layersOrderList: number[] = [];
  private readonly _selectedLayers: string[] = [];

  /**
   * Try to fit map view by given layer bounds.
   * But not all layers have borders
   * @param layerDef
   */
  async fitLayer(layerDef: LayerDef) {
    const layer = this.getLayer(layerDef);
    if (layer && layer.getExtent) {
      const extent = await layer.getExtent();
      if (extent) {
        this.fitBounds(extent);
      }
    }
  }

  /**
   * Check if given layer is baselayer
   * @param layerName Check
   */
  isBaseLayer(layerDef: LayerDef): boolean | undefined {
    const layer = this.getLayer(layerDef);
    if (layer && layer.id) {
      return this._baseLayers.indexOf(layer.id) !== -1;
    }
    return undefined;
  }

  getBaseLayers() {
    return this._baseLayers;
  }

  /**
   * Helper method to return added layer object by any definition type.
   */
  getLayer<LA extends LayerAdapter = LayerAdapter>(
    layerDef: LayerDef
  ): LA | undefined {
    if (typeof layerDef === 'string') {
      return this._layers[layerDef] as LA;
    }
    return layerDef as LA;
  }

  /**
   * Helper method to return added layer identificator by any definition type.
   */
  getLayerId(layerDef: LayerDef): string | undefined {
    const layer = this.getLayer(layerDef);
    if (layer && layer.options) {
      return layer.options.id;
    } else {
      throw new Error('No id for layer');
    }
  }

  /**
   * Return array of all added layer identifications.
   */
  getLayers(): string[] {
    return Object.keys(this._layers);
  }

  // TODO: rename to getLayers, getLayers rename to getLayersIds
  allLayers() {
    return this._layers;
  }

  findLayer<T extends LayerAdapter = LayerAdapter>(
    filter: (adapter: T) => boolean
  ): T | undefined {
    for (const l in this._layers) {
      const layerAdapter = this._layers[l] as T;
      const isFit = filter(layerAdapter);
      if (isFit) {
        return layerAdapter;
      }
    }
  }

  /**
   * Check if the given layer on the map
   */
  isLayerVisible(layerDef: LayerDef): boolean {
    const layer = this.getLayer(layerDef);
    return layer && layer.options.visibility !== undefined
      ? layer.options.visibility
      : false;
  }

  /**
   * Shortcut method to create base layer
   * @param adapter
   * @param options
   */
  async addBaseLayer<
    K extends keyof LayerAdapters,
    O extends AdapterOptions = AdapterOptions
  >(
    adapter: K | Type<LayerAdapters[K]>,
    options: O | LayerAdaptersOptions[K]
  ): Promise<LayerAdapter> {
    const layer = await this.addLayer(adapter, {
      ...options,
      baseLayer: true
    });

    return layer;
  }

  /**
   * Registration of map layer.
   *
   * @param adapter The name of layer adapter from [MapAdapter.layerAdapters](webmap#MapAdapter.layerAdapters).
   *                May be custom object or class implemented by [BaseLayerAdapter](webmap#BaseLayerAdapter).
   * @param options Specific options for given adapter
   *
   * @example
   * ```javascript
   * webMap.addLayer('TILE', options).then((layer) => webMap.showLayer(layer));
   *
   * webMap.addLayer(CustomLayerAdapter, options);
   * ```
   */
  async addLayer<
    K extends keyof LayerAdapters,
    O extends AdapterOptions = AdapterOptions
  >(
    adapter:
      | K
      | Type<LayerAdapters[K]>
      | Promise<Type<LayerAdapters[K]> | undefined>,
    options: O | LayerAdaptersOptions[K],
    order?: number
  ): Promise<LayerAdapter> {
    const id = this._layersIdCounter++;
    const _order =
      order !== undefined
        ? order
        : options.order !== undefined
        ? options.order
        : this._layersOrderCounter++;
    let adapterEngine: Type<LayerAdapter> | undefined;
    if (typeof adapter === 'string') {
      adapterEngine = this.getLayerAdapter(adapter);
    } else if (typeof adapter === 'function') {
      adapterEngine = adapter as Type<LayerAdapter>;
    } else if (
      'then' in (adapter as Promise<Type<LayerAdapters[K]> | undefined>)
    ) {
      adapterEngine = (await adapter) as Type<LayerAdapters[K]>;
    }

    const geoJsonOptions = options as GeoJsonAdapterOptions;

    this._updateGeoJsonOptions(geoJsonOptions);

    const { maxZoom, minZoom } = this.options;

    options = {
      id: String(id),
      order: _order,
      maxZoom,
      minZoom,
      ...options
    };
    // options.visibility is a layer global state, but each layer on init is not visible
    const visibility = options.visibility;
    options.visibility = false;

    // TODO: check usage in adapter constructor and safe remove
    if (options.baseLayer) {
      options.order = 0;
    }
    if (this.options.onBeforeAddLayer) {
      const modified = this.options.onBeforeAddLayer({
        options,
        adapter: adapterEngine
      });
      if (modified) {
        if (modified.options) {
          options = modified.options;
        }
        if (modified.adapter) {
          adapterEngine = modified.adapter;
        }
      }
    }
    if (adapterEngine !== undefined) {
      const _adapter = new adapterEngine(this.mapAdapter.map, options);
      if (_adapter.options.baseLayer) {
        options.baseLayer = true;
        options.order = 0;
      }

      let layerId = _adapter.options.id;
      if (layerId) {
        this._layers[layerId] = _adapter;
      }
      this.emitter.emit('layer:preadd', _adapter);
      await this.onMapLoad();
      const layer = await _adapter.addLayer(options);
      // checking that the original layer was inserted into the adapter anyway
      _adapter.layer = layer;
      // think about how to move `id` to the adapter's constructor,
      // but that it is not required in the options
      _adapter.id = _adapter.options.id || String(id);
      _adapter.order = _adapter.options.order || _order;

      layerId = _adapter.options.id;
      if (layerId) {
        if (geoJsonOptions.filter) {
          this.filterLayer(_adapter, geoJsonOptions.filter);
        }
        if (options.baseLayer) {
          this._baseLayers.push(layerId);
        }
        this._layers[layerId] = _adapter;

        if (visibility) {
          this.showLayer(layerId);
        }
      }
      const opacity = options.opacity;
      if (opacity !== undefined && opacity <= 1) {
        this.setLayerOpacity(_adapter, opacity);
      }
      if (options.fit && _adapter.getExtent) {
        const extent = await _adapter.getExtent();
        if (extent) {
          await this.fitBounds(extent);
        }
      }
      this.emitter.emit('layer:add', _adapter);
      return _adapter;
    }
    return Promise.reject('No adapter');
  }

  async addLayerFromAsyncAdapter<
    K extends keyof LayerAdapters,
    O extends AdapterOptions = AdapterOptions
  >(
    adapter: AdapterConstructor,
    options: O | LayerAdaptersOptions[K],
    order?: number
  ): Promise<LayerAdapter> {
    const _order =
      order || options.order !== undefined
        ? options.order
        : 0 || this._layersOrderCounter++;
    const adapterConstructor = adapter as AdapterConstructor;
    const adapterConstructorPromise = adapterConstructor();
    const adapterEngine = await adapterConstructorPromise;
    if (adapterEngine) {
      return this.addLayer(adapterEngine, options, _order);
    }
    return Promise.reject('No adapter');
  }

  /**
   * Remove all layer from map and memory.
   */
  removeLayers(allowCb?: (layer: string, adapter: LayerAdapter) => boolean) {
    for (const l in this._layers) {
      let allow = true;
      if (allowCb) {
        allow = allowCb(l, this._layers[l]);
      }
      if (allow) {
        this.removeLayer(l);
        delete this._layers[l];
      }
    }
  }

  /**
   * Remove all layers but not remove basemap.
   */
  removeOverlays() {
    this.removeLayers((layerId, layer) => !layer.options.baseLayer);
  }

  /**
   * Remove specific layer from map and memory by its definition.
   * @param layerDef
   */
  removeLayer(layerDef: LayerDef) {
    const layer = this.getLayer(layerDef);
    const layerId = layer && this.getLayerId(layer);
    if (layer && layerId) {
      this.emitter.emit('layer:preremove', layer);
      if (layer.beforeRemove) {
        layer.beforeRemove();
      }
      if (layer.removeLayer) {
        layer.removeLayer();
      } else {
        this.mapAdapter.removeLayer(layer.layer);
      }
      if (layer.options && layer.options.baseLayer) {
        const index = this._baseLayers.indexOf(layerId);
        if (index) {
          this._baseLayers.splice(index, 1);
        }
      }
      delete this._layers[layerId];
      this.emitter.emit('layer:remove', layer);
    }
  }

  /**
   * Create layer from GeoJson data. Set style and behavior for selection.
   *
   * @example
   * ```javascript
   * // Add simple layer
   * webMap.addGeoJsonLayer({ data: geojson, paint: { color: 'red' } });
   *
   * // Add styled by feature property layer with selection behavior
   * webMap.addGeoJsonLayer({
   *   data: geojson,
   *   paint: function (feature) {
   *     return { color: feature.properties.color, opacity: 0.5 }
   *   },
   *  selectedPaint: function (feature) {
   *    return { color: feature.properties.selcolor, opacity: 1 }
   *  },
   *  selectable: true,
   *  multiselect: true
   * });
   *
   * // Add marker layer styled with use [Icons](icons)
   * webMap.addGeoJsonLayer({ data: geojson, paint: webMap.getIcon({ color: 'orange' })});
   *
   * // work with added layer
   * const layer = webMap.addGeoJsonLayer({ data: geojson, id: 'my_layer_name'});
   * // access layer by id
   * webMap.showLayer('my_layer_name');
   * // or access layer by instance
   * webMap.showLayer(layer);
   * ```
   */
  // @onMapLoad()
  async addGeoJsonLayer<K extends keyof LayerAdaptersOptions>(
    opt: GeoJsonAdapterOptions,
    adapter?: K | Type<LayerAdapter>
  ) {
    opt = opt || {};
    opt.multiselect = opt.multiselect !== undefined ? opt.multiselect : false;
    opt.unselectOnSecondClick =
      opt.unselectOnSecondClick !== undefined
        ? opt.unselectOnSecondClick
        : true;
    if (!adapter) {
      opt = updateGeoJsonAdapterOptions(opt);
    }
    opt.paint = opt.paint || {};
    const layer = await this.addLayer(adapter || 'GEOJSON', opt);
    this.showLayer(layer);
    return layer;
  }

  /**
   * Show added layer on the map by it definition.
   */
  showLayer(layerDef: LayerDef, options: ToggleLayerOptions = {}) {
    this.toggleLayer(layerDef, true, options);
  }

  /**
   * Hide added layer on the map by it definition.
   */
  hideLayer(layerDef: LayerDef, options: ToggleLayerOptions = {}) {
    this.toggleLayer(layerDef, false, options);
  }

  /**
   * Change added layer visibility on the map by given status or inverse current status.
   *
   * @example
   * ```javascript
   * webMap.addLayer('TILE', {id: 'my_layer', url: ''}).then((layer) => {
   *   webMap.toggleLayer(layer, true);
   *   webMap.toggleLayer('my_layer', false);
   *   webMap.toggleLayer('my_layer');
   *   webMap.isLayerVisible(layer); // true
   * });
   * ```
   */
  toggleLayer(
    layerDef: LayerDef,
    status?: boolean,
    options: ToggleLayerOptions = {}
  ) {
    const layer = this.getLayer(layerDef);
    const onMap = layer && layer.options.visibility;
    const toStatus = status !== undefined ? status : !onMap;
    const silent = options.silent !== undefined ? options.silent : false;
    const action = (source: any, l: LayerAdapter) => {
      l.options.visibility = toStatus;

      const preEventName = toStatus ? 'layer:preshow' : 'layer:prehide';
      const eventName = toStatus ? 'layer:show' : 'layer:hide';
      if (!silent) {
        this.emitter.emit(preEventName, l);
      }
      if (toStatus && source) {
        const order = l.options.baseLayer ? 0 : l.options.order;

        // do not show baselayer if another on the map
        if (order === 0 && this._baseLayers.length) {
          const anotherVisibleLayerBaseLayer = this._baseLayers.find(x => {
            return x !== l.id && this.isLayerVisible(x);
          });
          if (anotherVisibleLayerBaseLayer) {
            this.hideLayer(anotherVisibleLayerBaseLayer);
          }
        }

        if (l.showLayer) {
          l.showLayer.call(l, l.layer);
        } else {
          this.mapAdapter.showLayer(l.layer);
        }
        if (order !== undefined) {
          this.mapAdapter.setLayerOrder(l.layer, order, this._layers);
        }
      } else {
        if (l.hideLayer) {
          l.hideLayer.call(l, l.layer);
        } else {
          this.mapAdapter.hideLayer(l.layer);
        }
      }
      if (!silent) {
        this.emitter.emit(eventName, l);
      }
    };
    if (layer && layer.options.visibility !== toStatus) {
      if (this.mapAdapter.map) {
        action(this.mapAdapter, layer);
      } else {
        this.mapAdapter.emitter.once('create', adapter => {
          action(adapter.map, layer);
        });
      }
    }
  }

  updateLayer(layerDef: LayerDef) {
    const layer = this.getLayer(layerDef);
    if (layer) {
      if (layer.updateLayer) {
        layer.updateLayer();
      } else if (this.isLayerVisible(layer)) {
        this.hideLayer(layer, { silent: true });
        this.showLayer(layer, { silent: true });
      }
    }
  }

  /**
   * Set transparency for a given layer by number from 0 to 1
   */
  setLayerOpacity(layerDef: LayerDef, value: number) {
    const layer = this.getLayer(layerDef);
    if (layer) {
      if (this.mapAdapter.setLayerOpacity) {
        if (layer) {
          this.mapAdapter.setLayerOpacity(layer.layer, value);
        }
      }
    }
  }

  // requestGeomString(pixel: Pixel, pixelRadius: number) {
  //   if (this.mapAdapter.requestGeomString) {
  //     return this.mapAdapter.requestGeomString(pixel, pixelRadius);
  //   }
  // }

  /**
   * Mark the layer as selected.
   * If the adapter is a vector layer and supports data selection,
   * you can pass a callback function to specify which data will be selected.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {data: geojson}).then((layer) => {
   *   webMap.selectLayer(layer, ({feature}) => feature.id === '42');
   * });
   * ```
   * @param layerDef
   * @param findFeatureFun
   */
  selectLayer(layerDef: LayerDef, findFeatureFun?: DataLayerFilter) {
    const layer = this.getLayer(layerDef);
    if (layer) {
      const adapter = layer as VectorLayerAdapter;
      if (adapter && adapter.select) {
        adapter.select(findFeatureFun);
      }
      const layerId = this.getLayerId(layer);
      if (layerId) {
        this._selectedLayers.push(layerId);
      }
    }
  }

  /**
   * Unselect the given layer.
   * If the adapter is a vector layer and supports data selection,
   * you can pass a callback function to specify which data will be unselected.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {data: geojson}).then((layer) => {
   *   webMap.unSelectLayer(layer, ({feature}) => feature.id === '42');
   * });
   * ```
   *
   * @param layerDef
   * @param findFeatureFun
   */
  unSelectLayer(layerDef: LayerDef, findFeatureFun?: DataLayerFilter) {
    const layer = this.getLayer(layerDef);
    if (layer) {
      const adapter = layer && (layer as VectorLayerAdapter);
      if (adapter.unselect) {
        adapter.unselect(findFeatureFun);
      }
      const layerId = this.getLayerId(layer);
      if (layerId) {
        const index = this._selectedLayers.indexOf(layerId);
        if (index !== -1) {
          this._selectedLayers.splice(index, 1);
        }
      }
    }
  }

  /**
   * Hide features from a vector layer using a callback function.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {data: geojson}).then((layer) => {
   *   webMap.filterLayer(layer, ({feature}) => feature.id === '42');
   * });
   * ```
   *
   * @param layerDef
   * @param filter
   */
  filterLayer(
    layerDef: LayerDef,
    filter: DataLayerFilter<Feature, L>
  ): LayerDefinition<Feature, L>[] {
    const layer = this.getLayer(layerDef);
    const adapter = layer as VectorLayerAdapter;
    if (adapter.filter) {
      return adapter.filter(filter);
    }
    return [];
  }

  propertiesFilter(
    layerDef: LayerDef,
    filters: PropertiesFilter,
    options?: FilterOptions
  ) {
    const layer = this.getLayer(layerDef);
    const adapter = layer as VectorLayerAdapter;
    if (adapter.propertiesFilter) {
      adapter.propertiesFilter(filters, options);
    } else if (adapter.filter) {
      this.filterLayer(adapter, e => {
        if (e.feature && e.feature.properties) {
          return propertiesFilter(e.feature.properties, filters);
        }
        return true;
      });
    }
  }

  removeLayerFilter(layerDef: LayerDef) {
    const layer = this.getLayer(layerDef);
    const adapter = layer as VectorLayerAdapter;
    if (adapter.removeFilter) {
      adapter.removeFilter();
    } else if (adapter.filter) {
      adapter.filter(() => {
        return true;
      });
    }
  }

  /**
   * Sets the GeoJSON data for given vector layer.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON').then((layer) => {
   *   webMap.setLayerData(layer, geojson);
   * });
   * ```
   */
  setLayerData(layerDef: LayerDef, data: GeoJsonObject) {
    const vectorAdapter = this.getLayer(layerDef);
    const adapter = vectorAdapter as VectorLayerAdapter;
    if (adapter) {
      if (adapter.setData) {
        adapter.setData(data);
      } else if (adapter.clearLayer && adapter.addData) {
        adapter.clearLayer();
        adapter.addData(data);
      }
    }
  }

  /**
   * Push new the GeoJSON features into given vector layer.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {data: geojson_features_5}).then((layer) => {
   *   console.log(layer.getLayers().length) // > 5;
   *   webMap.addLayerData(layer, geojson_features_3);
   *   console.log(layer.getLayers().length) // > 8;
   * });
   * ```
   */
  addLayerData(layerDef: LayerDef, data: GeoJsonObject) {
    const layerMem = this.getLayer(layerDef);
    const adapter = layerMem as VectorLayerAdapter;
    if (adapter.addData) {
      adapter.addData(data);
    }
  }

  /**
   * Remove from vector layer all features.
   * it is possible to remove only some objects if you specify a callback function.
   *
   * @example
   * ```javascript
   * const layer = webMap.addLayer('GEOJSON', {data: geojson}).then((layer) => {
   *   webMap.clearLayerData(layer, (feture) => feture.id === 42);
   *   webMap.clearLayerData(layer);
   * });
   * ```
   */
  clearLayerData(layerDef: LayerDef, cb?: (feature: Feature) => boolean) {
    const layerMem = this.getLayer(layerDef);
    const adapter = layerMem as VectorLayerAdapter;
    if (adapter && adapter.clearLayer) {
      adapter.clearLayer(cb);
    }
  }

  getAttributions(options: GetAttributionsOptions): string[] {
    const attributions: string[] = [];
    for (const l in this._layers) {
      const layerMem = this._layers[l];
      const onlyVisible =
        options.onlyVisible !== undefined ? options.onlyVisible : true;
      const useLayerAttr = onlyVisible ? layerMem.options.visibility : true;
      if (useLayerAttr) {
        const attr = layerMem.options && layerMem.options.attribution;
        if (attr) {
          attributions.push(attr);
        }
      }
    }

    return attributions;
  }

  getActiveBaseLayer() {
    const visibleLayerBaseLayer = this.getBaseLayers().find(x => {
      return this.isLayerVisible(x);
    });
    if (visibleLayerBaseLayer) {
      return this.getLayer(visibleLayerBaseLayer);
    }
  }

  private async _onLayerClick(options: OnLayerClickOptions) {
    this.emitter.emit('layer:click', options);
    return Promise.resolve(options);
  }

  private _updateGeoJsonOptions(options: GeoJsonAdapterOptions) {
    const onLayerClickFromOpt = options.onLayerClick;
    options.onLayerClick = e => {
      if (onLayerClickFromOpt) {
        onLayerClickFromOpt(e);
      }
      return this._onLayerClick(e);
    };
    if (!options.nativePaint) {
      if (this.options.paint) {
        options.paint = preparePaint(
          options.paint || {},
          this.options.paint,
          this.getPaintFunctions
        );
      }
      if (options.selectedPaint && this.options.selectedPaint) {
        options.selectedPaint = preparePaint(
          options.selectedPaint,
          this.options.selectedPaint,
          this.getPaintFunctions
        );
      }
    }
  }
}
