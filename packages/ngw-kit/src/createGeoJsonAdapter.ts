import { NgwLayerOptions } from './interfaces';
import WebMap, {
  VectorLayerAdapter,
  Type,
  GeoJsonAdapterOptions,
  PropertiesFilter
} from '@nextgis/webmap';
import NgwConnector, { CancelablePromise, FeatureItem } from '@nextgis/ngw-connector';
import NgwKit from '@nextgis/ngw-kit';
import { GeoJsonObject, FeatureCollection, Point, Feature } from 'geojson';
import { toWgs84 } from './utils';

export async function createGeoJsonAdapter(
  options: NgwLayerOptions,
  webMap: WebMap,
  connector: NgwConnector) {

  const adapter = webMap.mapAdapter.layerAdapters.GEOJSON as Type<VectorLayerAdapter>;

  let _fullDataLoad = false;

  const geoJsonAdapterCb = (filters?: PropertiesFilter) => {
    // TODO: rewrite all to feature api after NGW cloud update
    // need geojson and 4326 params
    if (filters) {
      const url = '/api/resource/{id}/feature/';
      const params: string[] = [];
      filters.forEach(([field, operation, value]) => {
        params.push(`fld_${field}__${operation}=${value}`);
      });
      return connector.makeQuery(url + '?' + params.join('&') , {
        id: options.resourceId,
      }).then((x: FeatureItem[]) => {
        const features: Array<Feature<Point>> = x.map((y) => {
          const geometry = NgwKit.utils.wktToGeoJson(y.geom);
          return {
            type: 'Feature',
            properties: y.fields,
            geometry
          };
        });

        const geojson: FeatureCollection<Point> = {
          type: 'FeatureCollection',
          features
        };
        return geojson;
      });
    } else {
      return connector.makeQuery('/api/resource/{id}/geojson', {
        id: options.resourceId
      }).then((resp) => {
        _fullDataLoad = true;
        return toWgs84(resp);
      });
    }
  };

  const onLoad = (data: GeoJsonObject) => {
    const geoJsonOptions: GeoJsonAdapterOptions = {
      data,
    };
    if (options.id) {
      geoJsonOptions.id = options.id;
    }
    return WebMap.utils.updateGeoJsonAdapterOptions(geoJsonOptions);
  };
  return class Adapter extends adapter {

    _dataPromise?: CancelablePromise<any>;

    async addLayer(_opt: GeoJsonAdapterOptions) {
      const data = this._dataPromise = await geoJsonAdapterCb(_opt.propertiesFilter);

      this._dataPromise = undefined;
      const opt = onLoad(data);
      return super.addLayer({ ..._opt, ...opt });
    }
    beforeRemove() {
      if (this._dataPromise) {
        this._dataPromise.cancel();
      }
    }

    async propertiesFilter(filters: PropertiesFilter) {
      if (this.filter && _fullDataLoad) {
        this.filter((e) => {
          if (e.feature && e.feature.properties) {
            return WebMap.utils.propertiesFilter(e.feature.properties, filters);
          }
          return true;
        });
      } else if (this.setData) {
        const data = this._dataPromise = await geoJsonAdapterCb(filters);
        this._dataPromise = undefined;
        this.setData(data);
      }
    }

    removeFilter() {
      this.propertiesFilter([]);
      if (this.filter) {
        this.filter(function () { return true; });
      }
    }
  };
}
