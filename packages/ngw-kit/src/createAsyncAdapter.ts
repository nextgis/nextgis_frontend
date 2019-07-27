import NgwConnector, { ResourceCls, ResourceItem } from '@nextgis/ngw-connector';
import WebMap, { LayerAdapter, Type } from '@nextgis/webmap';
import QmsKit from '@nextgis/qms-kit';
import { NgwLayerOptions, ResourceAdapter } from './interfaces';

import { createGeoJsonAdapter } from './createGeoJsonAdapter';
import { createRasterAdapter } from './createRasterAdapter';
import { createWebMapAdapter } from './createWebMapAdapter';
import { applyMixins } from './utils/utils';
import { NgwResource } from './NgwResource';

const styles: ResourceCls[] = ['mapserver_style', 'qgis_vector_style', 'raster_style'];

async function createAdapterFromFirstStyle(
  parent: number,
  options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string,
  connector: NgwConnector) {
  const childrenStyles = await connector.get('resource.collection', null, { parent });
  const firstStyle = childrenStyles && childrenStyles[0];
  if (firstStyle) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return createAsyncAdapter(
      { ...options, resourceId: firstStyle.resource.id },
      webMap, baseUrl, connector
    );
  }
}

export async function createAsyncAdapter(
  options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string,
  connector: NgwConnector): Promise<Type<ResourceAdapter> | undefined> {

  let adapter: Promise<Type<LayerAdapter> | undefined> | undefined;
  let item: ResourceItem;
  try {
    item = await connector.get('resource.item', null, { id: options.resourceId });
    if (item.webmap) {
      adapter = createWebMapAdapter(options, webMap, baseUrl, connector);
    } else if (styles.indexOf(item.resource.cls) !== -1) {
      if (options.adapter === 'GEOJSON') {
        const parentOptions: NgwLayerOptions = {
          ...options,
          resourceId: item.resource.parent.id,
        };
        adapter = createGeoJsonAdapter(parentOptions, webMap, connector);
      } else {
        adapter = createRasterAdapter(options, webMap, baseUrl);
      }
    } else if (item.resource.cls === 'vector_layer') {
      if (options.adapter && options.adapter !== 'GEOJSON') {
        if (options.adapter === 'MVT') {
          adapter = createRasterAdapter(options, webMap, baseUrl);
          // adapter = Promise.resolve(webMap.mapAdapter.layerAdapters.MVT);
        } else {
          return createAdapterFromFirstStyle(item.resource.id, options, webMap, baseUrl, connector);
        }
      } else {
        adapter = createGeoJsonAdapter(options, webMap, connector);
      }
    } else if (item.resource.cls === 'raster_layer') {
      return createAdapterFromFirstStyle(item.resource.id, options, webMap, baseUrl, connector);
    } else if (item.basemap_layer && item.basemap_layer.qms) {
      adapter = Promise.resolve(QmsKit.utils.createQmsAdapter(webMap));
      adapter.then((x) => {
        if (x && item.basemap_layer && item.basemap_layer.qms) {
          const qms = JSON.parse(item.basemap_layer.qms);
          x.prototype.qms = qms;
          x.prototype.baseLayer = true;
        }
      });
    }
  } catch (er) {
    if (options.adapter === 'GEOJSON') {
      adapter = createGeoJsonAdapter(options, webMap, connector);
    } else {
      adapter = createRasterAdapter(options, webMap, baseUrl);
    }
  }
  if (adapter) {
    return adapter.then((x) => {
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
