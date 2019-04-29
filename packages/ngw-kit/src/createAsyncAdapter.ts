import NgwConnector, { ResourceCls } from '@nextgis/ngw-connector';
import WebMap, { LayerAdapter, Type, GeoJsonAdapterOptions, VectorLayerAdapter } from '@nextgis/webmap';
import { NgwLayerOptions } from './interfaces';
import { toWgs84 } from './utils';
import { GeoJsonObject } from 'geojson';
import { createRasterAdapter } from './createRasterAdapter';

const styles: ResourceCls[] = ['mapserver_style', 'qgis_vector_style', 'raster_style'];

export async function createAsyncAdapter(
  options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string,
  connector: NgwConnector): Promise<Type<LayerAdapter> | undefined> {

  const item = await connector.get('resource.item', null, { id: options.resourceId });

  if (item.webmap) {
    // TODO: add webmap adapter
    return undefined;
  } else if (styles.indexOf(item.resource.cls) !== -1) {
    if (options.adapter === 'GEOJSON') {
      // TODO: get style parent vector layer with geojson data
      return undefined;
    }
    const rasterAdapter = createRasterAdapter(options, webMap, baseUrl);
    return rasterAdapter;
  } else if (item.resource.cls === 'vector_layer') {
    if (options.adapter && options.adapter !== 'GEOJSON') {
      // TODO: get first vector layer style if it exist
      return undefined;
    }
    return createGeoJsonAdapter(options, webMap, connector);
  }

}

async function createGeoJsonAdapter(
  options: NgwLayerOptions,
  webMap: WebMap,
  connector: NgwConnector) {

  const adapter = webMap.mapAdapter.layerAdapters['GEOJSON'] as Type<VectorLayerAdapter>;

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
    async addLayer(options: any) {
      const data = await geoJsonAdapterCb;
      const opt = onLoad(data);
      return super.addLayer({ ...options, ...opt });
    }
    beforeRemove() {
      geoJsonAdapterCb.cancel();
    }
  };
}
