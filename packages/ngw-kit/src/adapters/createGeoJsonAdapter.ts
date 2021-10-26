import { EventEmitter } from 'events';
import { debounce, LngLatBoundsArray } from '@nextgis/utils';
import { propertiesFilter } from '@nextgis/properties-filter';

import { createPopupContent } from '../utils/createPopupContent';
import { getLayerFilterOptions } from '../utils/getLayerFilterOptions';
import { fetchNgwResourceExtent } from '../utils/fetchNgwExtent';
import { resourceIdFromLayerOptions } from '../utils/resourceIdFromLayerOptions';
import { vectorLayerGeomToPaintTypeAlias } from '../utils/utils';
import { fetchNgwLayerFeatureCollection } from '../utils/fetchNgwLayerFeatureCollection';
import { prepareNgwFieldsToPropertiesFilter } from '../utils/prepareNgwFieldsToPropertiesFilter';

import type { FeatureCollection } from 'geojson';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type CancelablePromise from '@nextgis/cancelable-promise';
import type { Type } from '@nextgis/utils';
import type {
  GeoJsonAdapterOptions,
  VectorLayerAdapter,
  FilterOptions,
  LayerAdapter,
} from '@nextgis/webmap';
import type {
  NgwLayerOptions,
  GetClassAdapterOptions,
  NgwFeatureRequestOptions,
} from '../interfaces';
import { fetchNgwLayerCount } from '../utils/fetchNgwLayerCount';

interface FilterArgs {
  filters?: PropertiesFilter;
  options?: FilterOptions;
}

export async function createGeoJsonAdapter(
  props: GetClassAdapterOptions,
): Promise<Type<VectorLayerAdapter>> {
  const {
    item,
    webMap,
    Adapter,
    connector,
    layerOptions,
    addLayerOptionsPriority: alop,
  } = props;
  const addLayerOptionsPriority = alop ?? true;
  const options = layerOptions as NgwLayerOptions<'GEOJSON'>;
  const GeoJsonAdapter: Type<VectorLayerAdapter> =
    Adapter || webMap.mapAdapter.layerAdapters.GEOJSON;

  const _loadedIds: string[] = [];
  let _fullDataLoad = false;
  let _lastFilterArgs: FilterArgs | undefined;
  let _dataPromise: CancelablePromise<FeatureCollection> | undefined;

  const resourceId = await resourceIdFromLayerOptions(options, connector);

  if (options.adapterOptions?.popupOptions?.fromProperties) {
    options.adapterOptions.popupOptions.createPopupContent = ({ feature }) => {
      return feature && createPopupContent(feature, item);
    };
  }

  const getData = async (
    filters?: PropertiesFilter,
    filterOpt?: NgwFeatureRequestOptions,
  ) => {
    abort();
    _lastFilterArgs = { filters, options: filterOpt };
    _dataPromise = fetchNgwLayerFeatureCollection({
      resourceId,
      filters,
      connector,
      cache: true,
      ...filterOpt,
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
    __onMapMove?: () => void;
    __onMapMoveStart?: () => void;
    __enableMapMoveListener?: (e: LayerAdapter) => void;
    __disableMapMoveListener?: (e: LayerAdapter) => void;

    async addLayer(opt: GeoJsonAdapterOptions) {
      let needUpdate = !opt.data;
      const waitFullLoad =
        opt.waitFullLoad !== undefined ? opt.waitFullLoad : true;
      if (options.id !== undefined) {
        opt.id = options.id;
      }
      if (item && item.vector_layer) {
        opt.type =
          vectorLayerGeomToPaintTypeAlias[item.vector_layer.geometry_type];
      }
      if (options.adapterOptions) {
        // TODO: remove addLayerOptionsPriority options/
        // in some cases, addLayer options must be used,
        // but in others factory method options needs first
        if (addLayerOptionsPriority) {
          opt = {
            ...options.adapterOptions,
            ...opt,
          };
        } else {
          opt = {
            ...opt,
            ...options.adapterOptions,
          };
        }
      }
      if (opt.data && Object.keys(opt.data).length === 0) {
        opt.data = undefined;
        needUpdate = false;
      }
      const strategy = opt.strategy || undefined;
      this.options.strategy = strategy;

      const layer = super.addLayer(opt);
      _lastFilterArgs = {
        filters: opt.propertiesFilter,
        options: getLayerFilterOptions(opt),
      };
      let updatePromise: Promise<any> | undefined;
      if (needUpdate) {
        updatePromise = this.updateLayer();
      }
      if (waitFullLoad && updatePromise) {
        await updatePromise;
      }
      if (strategy && strategy.startsWith('BBOX') && !_fullDataLoad) {
        this._addBboxEventListener();
      }
      return layer;
    }

    /** @deprecated use {@link NgwGeoJsonAdapter.getBounds} instead */
    getExtent(): Promise<LngLatBoundsArray | undefined> {
      return this.getBounds();
    }

    async getBounds(): Promise<LngLatBoundsArray | undefined> {
      const hasData = this.getLayers && this.getLayers().length;
      const strategy = this.options.strategy;
      if (strategy?.startsWith('BBOX') || hasData) {
        return fetchNgwResourceExtent(item, connector);
      } else {
        if (super.getBounds) {
          return super.getBounds();
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
      return fetchNgwLayerCount({ connector, resourceId, cache: true });
    }

    async updateLayer(filterArgs?: FilterArgs) {
      filterArgs = filterArgs || _lastFilterArgs || {};
      if (this.options.strategy?.startsWith('BBOX')) {
        await webMap.onLoad('create');
        filterArgs.options = filterArgs.options || {};
        filterArgs.options.intersects = webMap.getBounds();
        const { minZoom, maxZoom } = this.options;
        const zoom = webMap.getZoom();
        if (zoom !== undefined) {
          if (minZoom !== undefined && zoom < minZoom) {
            return;
          }
          if (maxZoom !== undefined && zoom > maxZoom) {
            return;
          }
          if (_fullDataLoad) {
            return;
          }
        }
      }
      if (removed) {
        return;
      }
      try {
        this.emitter.emit('preupdate', filterArgs);
        webMap._emitLayerEvent('layer:preupdate', options.id || '', filterArgs);

        const data = await getData(filterArgs.filters, {
          ...filterArgs.options,
          srs: this.options.srs,
        });
        let newData: FeatureCollection = data;
        const count = await this.getCount();

        if (this.options.strategy === 'BBOX+') {
          newData = {
            type: 'FeatureCollection',
            features: [],
          };
          for (const f of data.features) {
            if (_loadedIds.indexOf(String(f.id)) === -1) {
              _loadedIds.push(String(f.id));
              newData.features.push(f);
            }
          }
          _fullDataLoad = count !== undefined && _loadedIds.length >= count;
          await webMap.addLayerData(this, newData);
        } else {
          _fullDataLoad = count !== undefined && data.features.length >= count;
          await webMap.setLayerData(this, data);
        }
        this.emitter.emit('updated', data);
        webMap._emitLayerEvent('layer:updated', options.id || '', {
          data,
          newData,
          isFull: _fullDataLoad,
        });
      } catch (er) {
        if (er instanceof Error && er.name !== 'CancelError') {
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
          const props_ =
            e.feature &&
            e.feature.properties &&
            prepareNgwFieldsToPropertiesFilter({ ...e.feature.properties });
          if (props_) {
            return propertiesFilter(props_, filters);
          }
          return true;
        });
      } else if (this.setData) {
        if (this.clearLayer) {
          this.clearLayer();
        }
        const data = await getData(filters, {
          ...opt,
          srs: this.options.srs,
        });
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

    private _addBboxEventListener() {
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

    private _removeBboxEventListener() {
      if (this.__enableMapMoveListener) {
        webMap.emitter.on('layer:show', this.__enableMapMoveListener);
      }
      if (this.__disableMapMoveListener) {
        webMap.emitter.on('layer:hide', this.__disableMapMoveListener);
      }
    }

    private _addMoveEventListener() {
      this.__onMapMove = debounce(() => this.updateLayer());
      this.__onMapMoveStart = abort;
      webMap.emitter.on('movestart', this.__onMapMoveStart);
      webMap.emitter.on('moveend', this.__onMapMove);
    }

    private _removeMoveEventListener() {
      if (this.__onMapMove) {
        webMap.emitter.removeListener('moveend', this.__onMapMove);
      }
      if (this.__onMapMoveStart) {
        webMap.emitter.removeListener('movestart', this.__onMapMoveStart);
      }
    }
  }

  return NgwGeoJsonAdapter;
}
