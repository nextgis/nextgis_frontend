import NgwConnector, { ResourceCls } from '@nextgis/ngw-connector';
import WebMap, { LayerAdapter, Type } from '@nextgis/webmap';
import { NgwLayerOptions } from './interfaces';

import { createGeoJsonAdapter } from './createGeoJsonAdapter';
import { createRasterAdapter } from './createRasterAdapter';
import { createWebMapAdapter } from './createWebMapAdapter';

const styles: ResourceCls[] = ['mapserver_style', 'qgis_vector_style', 'raster_style'];

export async function createAsyncAdapter(
  options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string,
  connector: NgwConnector): Promise<Type<LayerAdapter> | undefined> {

  const item = await connector.get('resource.item', null, { id: options.resourceId });

  if (item.webmap) {
    return createWebMapAdapter(options, webMap, baseUrl, connector);
  } else if (styles.indexOf(item.resource.cls) !== -1) {
    if (options.adapter === 'GEOJSON') {
      const parentOptions: NgwLayerOptions = {
        ...options,
        resourceId: item.resource.parent.id,
      };
      return createGeoJsonAdapter(parentOptions, webMap, connector);
    }
    return createRasterAdapter(options, webMap, baseUrl);
  } else if (item.resource.cls === 'vector_layer') {
    if (options.adapter && options.adapter !== 'GEOJSON') {
      // TODO: get first vector layer style if it exist
      return undefined;
    }
    return createGeoJsonAdapter(options, webMap, connector);
  }

}
