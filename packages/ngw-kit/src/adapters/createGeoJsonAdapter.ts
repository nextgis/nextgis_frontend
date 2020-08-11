import { EventEmitter } from 'events';
import {
  WebMap,
  VectorLayerAdapter,
  Type,
  GeoJsonAdapterOptions,
  PropertiesFilter,
  FilterOptions,
  LayerAdapter,
} from '@nextgis/webmap';
import { debounce, degrees2meters } from '@nextgis/utils';
import CancelablePromise from '@nextgis/cancelable-promise';
import { vectorLayerGeomToPaintTypeAlias } from '../utils/utils';
import { getNgwLayerFeatures } from '../utils/featureLayerUtils';
import { createPopupContent } from '../utils/createPopupContent';
import { getLayerFilterOptions } from '../utils/getLayerFilterOptions';
import { resourceIdFromLayerOptions } from '../utils/resourceIdFromLayerOptions';
import { NgwLayerOptions, GetClassAdapterOptions } from '../interfaces';

interface FilterArgs {
  filters?: PropertiesFilter;
  options?: FilterOptions;
}

export async function createGeoJsonAdapter(
  opt: GetClassAdapterOptions
): Promise<Type<VectorLayerAdapter>> {
  const { webMap, connector, item } = opt;
  const addLayerOptionsPriority =
    opt.addLayerOptionsPriority !== undefined
      ? opt.addLayerOptionsPriority
      : true;
  const options = opt.layerOptions as NgwLayerOptions<'GEOJSON'>;
  const GeoJsonAdapter =
    (opt.Adapter as Type<VectorLayerAdapter>) ||
    (webMap.mapAdapter.layerAdapters.GEOJSON as Type<VectorLayerAdapter>);

  let _dataPromise: CancelablePromise<any> | undefined;
  const _fullDataLoad = false;
  let _lastFilterArgs: FilterArgs | undefined;

  const resourceId = await resourceIdFromLayerOptions(options, connector);

  if (
    options.adapterOptions &&
    options.adapterOptions.popupOptions &&
    options.adapterOptions.popupOptions.fromProperties
  ) {
    options.adapterOptions.popupOptions.createPopupContent = ({ feature }) => {
      return feature && createPopupContent(feature, item);
    };
  }

  const geoJsonAdapterCb = async (
    filters?: PropertiesFilter,
    opt?: FilterOptions
  ) => {
    abort();
    _lastFilterArgs = { filters, options: opt };
    _dataPromise = getNgwLayerFeatures({
      resourceId,
      filters,
      connector,
      ...opt,
      // strict restriction on loading data from large layers
      limit: opt?.limit !== undefined ? opt.limit : 3000,
    });
    return await _dataPromise;
  };
  let removed = false;
  const abort = () => {
    if (_dataPromise) {
      _dataPromise.cancel();
      _dataPromise = undefined;
    }
  };

  return class NgwGeoJsonAdapter extends GeoJsonAdapter {
    emitter = new EventEmitter();
    _count?: number;
    __onMapMove?: () => void;
    __onMapMoveStart?: () => void;
    __enableMapMoveListener?: (e: LayerAdapter) => void;
    __disableMapMoveListener?: (e: LayerAdapter) => void;

    async addLayer(opt_: GeoJsonAdapterOptions) {
      let needUpdate = !opt_.data;
      if (options.id !== undefined) {
        opt_.id = options.id;
      }
      if (item && item.vector_layer) {
        opt_.type =
          vectorLayerGeomToPaintTypeAlias[item.vector_layer.geometry_type];
      }
      if (options.adapterOptions) {
        // TODO: remove addLayerOptionsPriority options/
        // in some cases, addLayer options must be used,
        // but in others factory method options needs first
        if (addLayerOptionsPriority) {
          opt_ = {
            ...options.adapterOptions,
            ...opt_,
          };
        } else {
          opt_ = {
            ...opt_,
            ...options.adapterOptions,
          };
        }
      }
      if (opt_.data && Object.keys(opt_.data).length === 0) {
        opt_.data = undefined;
        needUpdate = false;
      }
      const layer = super.addLayer(opt_);
      this.options.strategy = opt_.strategy || undefined;

      _lastFilterArgs = {
        filters: opt_.propertiesFilter,
        options: getLayerFilterOptions(opt_),
      };
      let updatePromise: Promise<any> | undefined;
      if (needUpdate) {
        updatePromise = this.updateLayer();
      }
      if (opt_.waitFullLoad && updatePromise) {
        await updatePromise;
      }
      if (this.options.strategy === 'BBOX') {
        this._addBboxEventListener();
      }
      return layer;
    }

    beforeRemove() {
      removed = true;
      this._removeMoveEventListener();
      this._removeBboxEventListener();
      this.__disableMapMoveListener = undefined;
      this.__enableMapMoveListener = undefined;
      this.__onMapMove = undefined;
      this.__onMapMoveStart = undefined;
      abort();
    }

    getCount() {
      if (this._count !== undefined) {
        return this._count;
      }
      return connector
        .get('feature_layer.feature.count', null, {
          id: resourceId,
        })
        .then((resp) => {
          if (resp) {
            this._count = resp.total_count;
          }
        });
    }

    async updateLayer(filterArgs?: FilterArgs) {
      filterArgs = filterArgs || _lastFilterArgs || {};
      if (this.options.strategy === 'BBOX') {
        await webMap.onLoad();
        filterArgs.options = filterArgs.options || {};
        filterArgs.options.intersects = this._getMapBbox();
      }
      if (removed) {
        return;
      }
      try {
        const data = await geoJsonAdapterCb(
          filterArgs.filters,
          filterArgs.options
        );
        webMap.setLayerData(this, data);
        this.emitter.emit('updated');
      } catch (er) {
        if (er.name !== 'CancelError') {
          throw er;
        }
      }
      if (super.updateLayer) {
        super.updateLayer();
      }
    }

    async propertiesFilter(filters: PropertiesFilter, opt?: FilterOptions) {
      abort();
      if (this.filter && _fullDataLoad) {
        this.filter((e) => {
          if (e.feature && e.feature.properties) {
            return WebMap.utils.propertiesFilter(e.feature.properties, filters);
          }
          return true;
        });
      } else if (this.setData) {
        if (this.clearLayer) {
          this.clearLayer();
        }
        const data = await geoJsonAdapterCb(filters, opt);
        this.setData(data);
      }
    }

    removeFilter() {
      _lastFilterArgs = undefined;
      this.propertiesFilter([]);
      if (this.filter) {
        this.filter(() => {
          return true;
        });
      }
    }

    _addBboxEventListener() {
      this.__enableMapMoveListener = (e: LayerAdapter) => {
        if (e === this) {
          this._removeMoveEventListener();
          this.updateLayer();
          this._addMoveEventListener();
        }
      };
      this.__disableMapMoveListener = (e: LayerAdapter) => {
        if (e === this) {
          this._removeMoveEventListener();
        }
      };
      webMap.emitter.on('layer:show', this.__enableMapMoveListener);
      webMap.emitter.on('layer:hide', this.__disableMapMoveListener);
      this.__enableMapMoveListener(this);
    }

    _removeBboxEventListener() {
      if (this.__enableMapMoveListener) {
        webMap.emitter.on('layer:show', this.__enableMapMoveListener);
      }
      if (this.__disableMapMoveListener) {
        webMap.emitter.on('layer:hide', this.__disableMapMoveListener);
      }
    }

    _addMoveEventListener() {
      this.__onMapMove = debounce(() => this.updateLayer());
      this.__onMapMoveStart = abort;
      webMap.emitter.on('movestart', this.__onMapMoveStart);
      webMap.emitter.on('moveend', this.__onMapMove);
    }

    _removeMoveEventListener() {
      if (this.__onMapMove) {
        webMap.emitter.removeListener('moveend', this.__onMapMove);
      }
      if (this.__onMapMoveStart) {
        webMap.emitter.removeListener('movestart', this.__onMapMoveStart);
      }
    }

    _getMapBbox(): string | undefined {
      const bounds = webMap.getBounds();
      if (bounds) {
        const [s, w, n, e] = bounds;
        const polygon = [
          [s, w],
          [n, w],
          [n, e],
          [s, e],
          [s, w],
        ].map(([lng, lat]) => {
          const [x, y] = degrees2meters(lng, lat);
          return x + ' ' + y;
        });
        return `POLYGON((${polygon.join(', ')}))`;
      }
    }
  };
}
