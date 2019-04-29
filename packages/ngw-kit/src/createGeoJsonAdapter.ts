import { NgwLayerOptions } from './interfaces';
import WebMap, { VectorLayerAdapter, Type, GeoJsonAdapterOptions } from '@nextgis/webmap';
import NgwConnector from '@nextgis/ngw-connector';
import { GeoJsonObject } from 'geojson';
import { toWgs84 } from './utils';

export async function createGeoJsonAdapter(
  options: NgwLayerOptions,
  webMap: WebMap,
  connector: NgwConnector) {

  const adapter = webMap.mapAdapter.layerAdapters.GEOJSON as Type<VectorLayerAdapter>;

  const geoJsonAdapterCb = connector.makeQuery('/api/resource/{id}/geojson', {
    id: options.resourceId
  });

  const onLoad = (data: GeoJsonObject) => {
    data = toWgs84(data);
    const geoJsonOptions: GeoJsonAdapterOptions = {
      data,
    };
    if (options.id) {
      geoJsonOptions.id = options.id;
    }
    return webMap._updateGeojsonAdapterOptions(geoJsonOptions);
  };
  return class Adapter extends adapter {
    async addLayer(_opt: any) {
      const data = await geoJsonAdapterCb;
      const opt = onLoad(data);
      return super.addLayer({ ..._opt, ...opt });
    }
    beforeRemove() {
      geoJsonAdapterCb.cancel();
    }
  };
}
