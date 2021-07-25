import { EventEmitter } from 'events';
import {
  VectorLayerAdapter,
  Type,
  GeoJsonAdapterOptions,
  FilterOptions,
  LayerAdapter,
} from '@nextgis/webmap';
import { debounce, degrees2meters } from '@nextgis/utils';
import { PropertiesFilter, propertiesFilter } from '@nextgis/properties-filter';
import CancelablePromise from '@nextgis/cancelable-promise';
import { vectorLayerGeomToPaintTypeAlias } from '../utils/utils';
import { createPopupContent } from '../utils/createPopupContent';
import { getLayerFilterOptions } from '../utils/getLayerFilterOptions';
import { resourceIdFromLayerOptions } from '../utils/resourceIdFromLayerOptions';
import { NgwLayerOptions, GetClassAdapterOptions } from '../interfaces';
import { fetchNgwLayerFeatureCollection } from '../utils/fetchNgwLayerFeatureCollection';
import { fetchNgwResourceExtent } from '../utils/fetchNgwExtent';

import type { FeatureCollection } from 'geojson';
import { prepareNgwFieldsToPropertiesFilter } from '../utils/prepareNgwFieldsToPropertiesFilter';

interface FilterArgs {
  filters?: PropertiesFilter;
  options?: FilterOptions;
}

export async function createGeoJsonAdapter(
  opt: GetClassAdapterOptions,
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

  let _dataPromise: CancelablePromise<FeatureCollection> | undefined;
  let _fullDataLoad = false;
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
    opt?: FilterOptions,
  ) => {
    abort();
    _lastFilterArgs = { filters, options: opt };
    _dataPromise = fetchNgwLayerFeatureCollection({
      resourceId,
      filters,
      connector,
      cache: true,
      ...opt,
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

  class NgwGeoJsonAdapter extends GeoJsonAdapter {
    emitter = new EventEmitter();
    _count?: number;
    __onMapMove?: () => void;
    __onMapMoveStart?: () => void;
    __enableMapMoveListener?: (e: LayerAdapter) => void;
    __disableMapMoveListener?: (e: LayerAdapter) => void;

    async addLayer(opt_: GeoJsonAdapterOptions) {
      let needUpdate = !opt_.data;
      const waitFullLoad =
        opt_.waitFullLoad !== undefined ? opt_.waitFullLoad : true;
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
      if (waitFullLoad && updatePromise) {
        await updatePromise;
      }
      if (this.options.strategy === 'BBOX' && !_fullDataLoad) {
        this._addBboxEventListener();
      }
      return layer;
    }

    getExtent() {
      const hasData = this.getLayers && this.getLayers().length;
      if (this.options.strategy === 'BBOX' || hasData) {
        return fetchNgwResourceExtent(item, connector);
      } else {
        if (super.getExtent) {
          return super.getExtent();
        }
      }
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
        .get(
          'feature_layer.feature.count',
          { cache: true },
          {
            id: resourceId,
          },
        )
        .then((resp) => {
          if (resp) {
            this._count = resp.total_count;
            return this._count;
          }
        });
    }

    async updateLayer(filterArgs?: FilterArgs) {
      filterArgs = filterArgs || _lastFilterArgs || {};
      if (this.options.strategy === 'BBOX') {
        await webMap.onLoad('create');
        filterArgs.options = filterArgs.options || {};
        filterArgs.options.intersects = this._getMapBbox();
      }
      if (removed) {
        return;
      }
      try {
        const data = await geoJsonAdapterCb(
          filterArgs.filters,
          filterArgs.options,
        );
        const count = await this.getCount();
        _fullDataLoad = count === data.features.length;
        await webMap.setLayerData(this, data);
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
          const props =
            e.feature &&
            e.feature.properties &&
            prepareNgwFieldsToPropertiesFilter({ ...e.feature.properties });
          if (props) {
            return propertiesFilter(props, filters);
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
  }

  return NgwGeoJsonAdapter;
}
