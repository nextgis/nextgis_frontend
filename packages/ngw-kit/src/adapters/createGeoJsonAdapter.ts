import { EventEmitter } from 'events';
import { debounce } from '@nextgis/utils';
import { propertiesFilter } from '@nextgis/properties-filter';
import { createPopupContent } from '../utils/createPopupContent';
import { getLayerFilterOptions } from '../utils/getLayerFilterOptions';
import { fetchNgwResourceExtent } from '../utils/fetchNgwExtent';
import { resourceIdFromLayerOptions } from '../utils/resourceIdFromLayerOptions';
import { fetchNgwLayerFeatureCollection } from '../utils/fetchNgwLayerFeatureCollection';
import { vectorLayerGeomToPaintTypeAlias } from '../utils/utils';
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
    _count?: number;
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
      const layer = super.addLayer(opt);
      this.options.strategy = opt.strategy || undefined;

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
        filterArgs.options.intersects = webMap.getBounds();
      }
      if (removed) {
        return;
      }
      try {
        const data = await getData(filterArgs.filters, {
          ...filterArgs.options,
          srs: this.options.srs,
        });
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
  }

  return NgwGeoJsonAdapter;
}
