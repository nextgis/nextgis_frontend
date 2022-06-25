import { defined } from '@nextgis/utils';

import { ngwApiToAdapterOptions } from '../utils/ngwApiToAdapterOptions';
import { resourceIdFromLayerOptions } from '../utils/resourceIdFromLayerOptions';

import type { Type } from '@nextgis/utils';
import type { ResourceItem, ResourceCls } from '@nextgis/ngw-connector';
import type { MainLayerAdapter, ImageAdapterOptions } from '@nextgis/webmap';
import type {
  ResourceAdapter,
  NgwLayerAdapterType,
  GetClassAdapterOptions,
} from '../interfaces';

export async function createRasterAdapter({
  layerOptions,
  webMap,
  connector,
  item,
}: GetClassAdapterOptions): Promise<Type<MainLayerAdapter> | undefined> {
  const resourceCls = item.resource.cls;
  const clsAdapterAlias: { [key in ResourceCls]?: NgwLayerAdapterType } = {
    wmsserver_service: 'WMS',
    tmsclient_layer: 'IMAGE',
  };
  let adapter =
    layerOptions.adapter ||
    (resourceCls && clsAdapterAlias[resourceCls]) ||
    'IMAGE';
  if (adapter !== undefined) {
    layerOptions.adapter = adapter;
  }
  if (adapter === 'IMAGE') {
    const layerAdapters = webMap.getLayerAdapters();
    const isImageAllowed = layerAdapters ? layerAdapters.IMAGE : true;
    if (!isImageAllowed) {
      adapter = 'TILE';
    }
  }

  const AdapterClass = webMap.mapAdapter.layerAdapters[
    adapter
  ] as Type<MainLayerAdapter>;
  if (AdapterClass) {
    const resourceId = await resourceIdFromLayerOptions(
      layerOptions,
      connector,
    );
    return class RasterAdapter extends AdapterClass implements ResourceAdapter {
      // options = {};
      item?: ResourceItem = item;
      resourceId = resourceId;

      constructor(public map: any, _options: any) {
        super(map, _options);
        const opt = ngwApiToAdapterOptions({
          options: layerOptions,
          webMap,
          baseUrl: connector.options.baseUrl || '',
        });
        if (opt) {
          const layerAdapterOptions: ImageAdapterOptions = {
            ...opt,
            ...layerOptions.adapterOptions,
            params: { resource: resourceId },
            // @deprecated
            layers: String(resourceId),
            resourceId: resourceId,
          };
          if (
            layerOptions.adapterOptions &&
            defined(layerOptions.adapterOptions.setViewDelay)
          ) {
            layerAdapterOptions.setViewDelay =
              layerOptions.adapterOptions.setViewDelay;
          }
          this.options = { ...this.options, ...layerAdapterOptions };
          // if (__DEV__) {
          //   Object.defineProperty(this.options, 'layers', {
          //     get: () => {
          //       console.warn('Do not use `layers` in ImageAdapterOptions');
          //       return String(resourceId);
          //     },
          //   });
          //   Object.defineProperty(this.options, 'resourceId', {
          //     get: () => {
          //       console.warn('Do not use `resourceId` in ImageAdapterOptions');
          //       return resourceId;
          //     },
          //   });
          // }
        }
      }
      addLayer(addOptions: any) {
        return super.addLayer({ ...this.options, ...addOptions });
      }

      async getIdentificationIds(): Promise<number[]> {
        if (this.item) {
          if (adapter === 'MVT') {
            return [this.item.resource.id];
          }
          const id = this.item.resource.parent.id;
          if (defined(id)) {
            return [id];
          }
        }
        return [];
      }
      // beforeRemove() {

      // }
    };
  } else {
    throw new Error(adapter + ' not supported yet. Only TILE');
  }
}
