import NgwConnector, {
  ResourceCls,
  ResourceItem
} from '@nextgis/ngw-connector';
import WebMap, { LayerAdapter, Type } from '@nextgis/webmap';
import QmsKit from '@nextgis/qms-kit';
import { ResourceAdapter, NgwLayerOptions } from './interfaces';

import { createGeoJsonAdapter } from './createGeoJsonAdapter';
import { createRasterAdapter } from './createRasterAdapter';
import { createWebMapAdapter } from './createWebMapAdapter';
import { applyMixins } from './utils/utils';
import { NgwResource } from './NgwResource';
import { resourceIdFromLayerOptions } from './utils/resourceIdFromLayerOptions';

const styles: ResourceCls[] = [
  'mapserver_style',
  'qgis_vector_style',
  'qgis_raster_style',
  'raster_style'
];

async function createAdapterFromFirstStyle(
  parent: number,
  options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string,
  connector: NgwConnector
) {
  const childrenStyles = await connector.get('resource.collection', null, {
    parent
  });
  const firstStyle = childrenStyles && childrenStyles[0];
  if (firstStyle) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return createAsyncAdapter(
      { ...options, resourceId: firstStyle.resource.id },
      webMap,
      baseUrl,
      connector
    );
  }
}

export async function createAsyncAdapter(
  options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string,
  connector: NgwConnector
): Promise<Type<ResourceAdapter> | undefined> {
  let adapter: Promise<Type<LayerAdapter> | undefined> | undefined;
  let item: ResourceItem | undefined;
  try {
    const adapterType = options.adapter;
    const resourceId = await resourceIdFromLayerOptions(options, connector);
    if (resourceId) {
      item = await connector.get('resource.item', null, { id: resourceId });

      if (item) {
        const _options: NgwLayerOptions = { ...options, resourceId };
        if (item.webmap) {
          adapter = createWebMapAdapter(_options, webMap, baseUrl, connector);
        } else if (styles.indexOf(item.resource.cls) !== -1) {
          if (adapterType === 'GEOJSON') {
            const parentOptions: NgwLayerOptions = {
              ...options,
              resourceId: item.resource.parent.id
            };
            adapter = createGeoJsonAdapter(parentOptions, webMap, connector);
          } else {
            adapter = createRasterAdapter(_options, webMap, baseUrl, connector);
          }
        } else if (item.resource.cls === 'vector_layer') {
          if (adapterType !== undefined && adapterType !== 'GEOJSON') {
            if (adapterType === 'MVT') {
              adapter = createRasterAdapter(
                _options,
                webMap,
                baseUrl,
                connector
              );
            } else {
              return createAdapterFromFirstStyle(
                item.resource.id,
                _options,
                webMap,
                baseUrl,
                connector
              );
            }
          } else {
            adapter = createGeoJsonAdapter(_options, webMap, connector);
          }
        } else if (item.resource.cls === 'raster_layer') {
          return createAdapterFromFirstStyle(
            item.resource.id,
            _options,
            webMap,
            baseUrl,
            connector
          );
        } else if (item.basemap_layer && item.basemap_layer.qms) {
          adapter = Promise.resolve(QmsKit.utils.createQmsAdapter(webMap));
          adapter.then(x => {
            if (x && item && item.basemap_layer && item.basemap_layer.qms) {
              const qms = JSON.parse(item.basemap_layer.qms);
              x.prototype.qms = qms;
              x.prototype.baseLayer = true;
            }
          });
        }
      } else {
        throw new Error(
          "Can't add NGW layer because Resource item is not found"
        );
      }
    }
  } catch (er) {
    // if (options.adapter === 'GEOJSON') {
    //   adapter = createGeoJsonAdapter(options, webMap, connector);
    // } else {
    //   adapter = createRasterAdapter(options, webMap, baseUrl);
    // }
  }
  if (adapter) {
    return adapter.then(x => {
      if (x) {
        const resourceAdapter = x as Type<ResourceAdapter>;
        resourceAdapter.prototype.item = item;
        resourceAdapter.prototype.connector = connector;

        applyMixins(resourceAdapter, [NgwResource]);

        return resourceAdapter;
      }
    });
  }
}
