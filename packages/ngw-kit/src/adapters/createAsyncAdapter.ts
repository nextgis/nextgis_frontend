import NgwConnector, {
  ResourceCls,
  ResourceItem,
} from '@nextgis/ngw-connector';
import { WebMap } from '@nextgis/webmap';
import { Type, applyMixins } from '@nextgis/utils';

import { createGeoJsonAdapter } from './createGeoJsonAdapter';
import { createRasterAdapter } from './createRasterAdapter';
import { createWebMapAdapter } from './createNgwWebmapAdapter';
import { NgwResource } from '../NgwResource';
import { resourceIdFromLayerOptions } from '../utils/resourceIdFromLayerOptions';
import { createBasemapLayerAdapter } from './createBasemapLayerAdapter';

import type {
  GetClassAdapterCallback,
  GetClassAdapterOptions,
  GetClassAdapterByType,
  ResourceAdapter,
  NgwLayerOptions,
  GetClassAdapter,
  ClassAdapter,
} from '../interfaces';

export const classAdapters: Record<string, GetClassAdapter> = {};

const supportCls: ResourceCls[] = [
  'mapserver_style',
  'qgis_vector_style',
  'qgis_raster_style',
  'wmsserver_service',
  'raster_style',
  'basemap_layer',
  'vector_layer',
  'raster_layer',
  'webmap',
  // in tms branch
  'tmsclient_layer',
];

async function createAdapterFromFirstStyle({
  layerOptions,
  webMap,
  connector,
  item,
}: GetClassAdapterOptions) {
  const parent = item.resource.id;
  const childrenStyles = await connector.getResourceChildren(parent);
  const firstStyle = childrenStyles && childrenStyles[0];
  if (firstStyle) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return createAsyncAdapter(
      { ...layerOptions, resource: firstStyle.resource.id },
      webMap,
      connector,
    );
  }
}

export async function createAsyncAdapter(
  options: NgwLayerOptions,
  webMap: WebMap,
  connector: NgwConnector,
): Promise<Type<ResourceAdapter> | undefined> {
  let adapter: ClassAdapter | undefined;
  let item: ResourceItem | undefined;
  const adapterType = options.adapter;
  const resourceId = await resourceIdFromLayerOptions(options, connector);
  if (resourceId) {
    const resourceOptions = options as NgwLayerOptions;
    const itemFromResOpt = resourceOptions.resource as ResourceItem;
    if (
      itemFromResOpt &&
      itemFromResOpt.resource &&
      itemFromResOpt.resource.id !== undefined
    ) {
      item = itemFromResOpt;
    } else {
      item = await connector.getResource(resourceId);
    }
    if (item) {
      const cls = item.resource.cls;
      const layerOptions: NgwLayerOptions = {
        ...options,
        resource: resourceId,
      };

      const adapterOptions: GetClassAdapterOptions = {
        layerOptions,
        webMap,
        connector,
        item,
      };

      if (supportCls.indexOf(cls) !== -1) {
        if (cls === 'webmap') {
          adapter = createWebMapAdapter(adapterOptions);
        } else if (cls === 'vector_layer') {
          if (adapterType !== undefined && adapterType !== 'GEOJSON') {
            if (adapterType === 'MVT') {
              adapter = createRasterAdapter(adapterOptions);
            } else {
              return createAdapterFromFirstStyle(adapterOptions);
            }
          } else {
            adapter = createGeoJsonAdapter(adapterOptions);
          }
        } else if (cls === 'raster_layer') {
          return createAdapterFromFirstStyle(adapterOptions);
        } else if (cls === 'basemap_layer') {
          adapter = createBasemapLayerAdapter(adapterOptions);
        } else {
          if (adapterType === 'GEOJSON') {
            const parentItem = await connector.getResource(
              item.resource.parent.id,
            );
            if (parentItem) {
              const parentOptions: NgwLayerOptions = {
                ...options,
                resource: item.resource.parent.id,
              };
              adapter = createGeoJsonAdapter({
                ...adapterOptions,
                item: parentItem,
                layerOptions: parentOptions,
              });
            }
          } else {
            adapter = createRasterAdapter(adapterOptions);
          }
        }
      } else if (classAdapters[cls]) {
        const getClassAdapter = classAdapters[cls];
        let classAdapter: GetClassAdapterCallback | undefined;
        if (adapterType && typeof classAdapter !== 'function') {
          classAdapter = (getClassAdapter as GetClassAdapterByType)[
            adapterType
          ];
        } else {
          classAdapter = getClassAdapter as GetClassAdapterCallback;
        }
        if (classAdapter) {
          adapter = classAdapter(adapterOptions);
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
        if (item) {
          resourceAdapter.prototype.item = item;
          resourceAdapter.prototype.resourceId = item.resource.id;
          resourceAdapter.prototype.connector = connector;
        }

        applyMixins(resourceAdapter, [NgwResource], { replace: false });
        return resourceAdapter;
      }
    });
  }
}
