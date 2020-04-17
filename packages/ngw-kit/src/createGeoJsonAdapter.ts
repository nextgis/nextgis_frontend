import { EventEmitter } from 'events';
import WebMap, {
  VectorLayerAdapter,
  Type,
  GeoJsonAdapterOptions,
  PropertiesFilter,
  FilterOptions,
} from '@nextgis/webmap';
import CancelablePromise from '@nextgis/cancelable-promise';
import { debounce } from '@nextgis/utils';
import NgwConnector, { ResourceItem } from '@nextgis/ngw-connector';
import { NgwLayerOptions } from './interfaces';
import { getNgwLayerFeatures } from './utils/featureLayerUtils';
import { resourceIdFromLayerOptions } from './utils/resourceIdFromLayerOptions';
import { degrees2meters, vectorLayerGeomToPaintTypeAlias } from './utils/utils';
import { createPopupContent } from './utils/createPopupContent';
import { getLayerFilterOptions } from './utils/getLayerFilterOptions';

interface FilterArgs {
  filters?: PropertiesFilter;
  options?: FilterOptions;
}

export async function createGeoJsonAdapter(
  options: NgwLayerOptions<'GEOJSON'>,
  webMap: WebMap,
  connector: NgwConnector,
  item?: ResourceItem
) {
  const adapter = webMap.mapAdapter.layerAdapters.GEOJSON as Type<
    VectorLayerAdapter
  >;

  let _dataPromise: CancelablePromise<any> | undefined;
  const _fullDataLoad = false;
  let _lastFilterArgs: FilterArgs | undefined;

  const resourceId = await resourceIdFromLayerOptions(options, connector);

  if (options.adapterOptions?.popupOptions?.fromProperties) {
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

  return class Adapter extends adapter {
    emitter = new EventEmitter();
    __onMapMove?: () => void;
    __enableMapMoveListener?: () => void;
    __disableMapMoveListener?: () => void;

    async addLayer(opt_: GeoJsonAdapterOptions) {
      let needUpdate = !opt_.data;
      if (options.id !== undefined) {
        opt_.id = options.id;
      }
      if (item && item.vector_layer) {
        opt_.type =
          vectorLayerGeomToPaintTypeAlias[item.vector_layer.geometry_type];
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
      if (needUpdate) {
        this.updateLayer();
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
      abort();
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
      const data = await geoJsonAdapterCb(
        filterArgs.filters,
        filterArgs.options
      );
      webMap.setLayerData(this, data);
      this.emitter.emit('updated');
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
      this.__enableMapMoveListener = () => {
        this._removeMoveEventListener();
        if (webMap.isLayerVisible(this)) {
          this.updateLayer();
          this._addMoveEventListener();
        }
      };
      this.__disableMapMoveListener = () => {
        if (!webMap.isLayerVisible(this)) {
          this._removeMoveEventListener();
        }
      };
      webMap.emitter.on('layer:show', this.__enableMapMoveListener);
      webMap.emitter.on('layer:hide', this.__disableMapMoveListener);
      this.__enableMapMoveListener();
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
      webMap.emitter.on('moveend', this.__onMapMove);
    }

    _removeMoveEventListener() {
      if (this.__onMapMove) {
        webMap.emitter.off('moveend', this.__onMapMove);
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
