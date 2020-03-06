import { NgwLayerOptions } from './interfaces';
import WebMap, {
  VectorLayerAdapter,
  Type,
  GeoJsonAdapterOptions,
  PropertiesFilter,
  FilterOptions
} from '@nextgis/webmap';
import { CancelablePromise } from '@nextgis/utils';
import NgwConnector, { ResourceItem } from '@nextgis/ngw-connector';
import { getNgwLayerFeatures } from './utils/featureLayerUtils';
import { resourceIdFromLayerOptions } from './utils/resourceIdFromLayerOptions';
import { degrees2meters, vectorLayerGeomToPaintTypeAlias } from './utils/utils';

interface FilterArgs {
  filters?: PropertiesFilter;
  options?: FilterOptions;
}

export async function createGeoJsonAdapter(
  options: NgwLayerOptions,
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

  const geoJsonAdapterCb = async (
    filters?: PropertiesFilter,
    opt?: FilterOptions
  ) => {
    _lastFilterArgs = { filters, options: opt };
    _dataPromise = getNgwLayerFeatures({
      resourceId,
      filters,
      connector,
      ...opt
    });
    return await _dataPromise;
  };

  const abort = () => {
    if (_dataPromise) {
      _dataPromise.cancel();
      _dataPromise = undefined;
    }
  };

  return class Adapter extends adapter {
    async addLayer(opt_: GeoJsonAdapterOptions) {
      if (options.id !== undefined) {
        opt_.id = options.id;
      }
      if (item && item.vector_layer) {
        opt_.type =
          vectorLayerGeomToPaintTypeAlias[item.vector_layer.geometry_type];
      }

      if (opt_.data && Object.keys(opt_.data).length === 0) {
        opt_.data = undefined;
      }
      opt_.strategy = opt_.strategy || undefined;
      // if (opt_.strategy === 'BBOX') {
      //   opt_.intersects = this._getMapBbox();
      // }
      const layer = super.addLayer(opt_);

      if (!opt_.data) {
        this.updateLayer({ filters: opt_.propertiesFilter, options: opt_ });
      }
      return layer;
    }

    beforeRemove() {
      abort();
    }

    async updateLayer(filterArgs?: FilterArgs) {
      const { filters, options } = filterArgs || _lastFilterArgs || {};
      const data = await geoJsonAdapterCb(filters, options);
      if (this.setData) {
        this.setData(data);
      }
    }

    async propertiesFilter(filters: PropertiesFilter, opt?: FilterOptions) {
      abort();
      if (this.filter && _fullDataLoad) {
        this.filter(e => {
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
        this.filter(function() {
          return true;
        });
      }
    }

    _getMapBbox(): string | undefined {
      const bounds = webMap.getBounds();
      if (bounds) {
        const [s, w, n, e] = bounds;
        const polygon = [
          [s, w],
          [n, e]
        ].map(([lng, lat]) => {
          const [x, y] = degrees2meters(lng, lat);
          return x + ' ' + y;
        });

        return `POLYGON((${polygon.join(', ')}))`;
      }
    }
  };
}
