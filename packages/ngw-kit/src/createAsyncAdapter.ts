import NgwConnector, {
  ResourceCls,
  ResourceItem,
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

const supportCls: ResourceCls[] = [
  'mapserver_style',
  'qgis_vector_style',
  'qgis_raster_style',
  'wmsserver_service',
  'raster_style',
  'basemap_layer',
  // 3D
  'model_3d',
  'terrain_provider',
];

async function createAdapterFromFirstStyle(
  parent: number,
  options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string,
  connector: NgwConnector
) {
  const childrenStyles = await connector.get('resource.collection', null, {
    parent,
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

  const adapterType = options.adapter;
  const resourceId = await resourceIdFromLayerOptions(options, connector);
  if (resourceId) {
    item = await connector.get('resource.item', null, { id: resourceId });
    const cls = item.resource.cls;
    if (item) {
      if (supportCls.indexOf(cls) !== -1) {
        const _options: NgwLayerOptions = { ...options, resourceId };
        if (cls === 'webmap') {
          adapter = createWebMapAdapter(_options, webMap, baseUrl, connector);
        } else if (cls === 'vector_layer') {
          if (adapterType !== undefined && adapterType !== 'GEOJSON') {
            if (adapterType === 'MVT') {
              adapter = createRasterAdapter(
                _options,
                webMap,
                baseUrl,
                connector,
                cls
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
            adapter = createGeoJsonAdapter(
              _options as NgwLayerOptions<'GEOJSON'>,
              webMap,
              connector,
              item
            );
          }
        } else if (cls === 'raster_layer') {
          return createAdapterFromFirstStyle(
            item.resource.id,
            _options,
            webMap,
            baseUrl,
            connector
          );
        } else if (cls === 'basemap_layer' && item.basemap_layer && item.basemap_layer.qms) {
          adapter = Promise.resolve(QmsKit.utils.createQmsAdapter(webMap));
          adapter.then((x) => {
            if (x && item && item.basemap_layer && item.basemap_layer.qms) {
              const qms = JSON.parse(item.basemap_layer.qms);
              x.prototype.qms = qms;
              x.prototype.baseLayer = true;
            }
          });
        }
        else {
          if (adapterType === 'GEOJSON') {
            const parentOptions: NgwLayerOptions = {
              ...options,
              resourceId: item.resource.parent.id,
            };
            adapter = createGeoJsonAdapter(
              parentOptions as NgwLayerOptions<'GEOJSON'>,
              webMap,
              connector,
              item
            );
          } else {
            adapter = createRasterAdapter(
              _options,
              webMap,
              baseUrl,
              connector,
              cls
            );
          }
        }
      } else {
        throw `Resource class '${cls}' not yet supported.`;
      }
    } else {
      throw 'Resource item is not found';
    }
  }

  if (adapter) {
    return adapter.then((x) => {
      if (x) {
        const resourceAdapter = x as Type<ResourceAdapter>;
        resourceAdapter.prototype.item = item;
        resourceAdapter.prototype.resourceId = item?.resource.id;
        resourceAdapter.prototype.connector = connector;

        applyMixins(resourceAdapter, [NgwResource]);

        return resourceAdapter;
      }
    });
  }
}
