import {
  ResourceAdapter,
  NgwLayerAdapterType,
  GetClassAdapterOptions,
} from '../interfaces';
import { MainLayerAdapter, Type, ImageAdapterOptions } from '@nextgis/webmap';
import { defined } from '@nextgis/utils';
import { ResourceItem, ResourceCls } from '@nextgis/ngw-connector';

import { getLayerAdapterOptions } from '../utils/getLayerAdapterOptions';
import { resourceIdFromLayerOptions } from '../utils/resourceIdFromLayerOptions';

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

  const adapterClass = webMap.mapAdapter.layerAdapters[
    adapter
  ] as Type<MainLayerAdapter>;
  if (adapterClass) {
    const resourceId = await resourceIdFromLayerOptions(
      layerOptions,
      connector
    );
    return class Adapter extends adapterClass implements ResourceAdapter {
      // options = {};
      item?: ResourceItem = item;
      resourceId = resourceId;

      constructor(public map: any, _options: any) {
        super(map, _options);
        const opt = getLayerAdapterOptions(
          layerOptions,
          webMap,
          connector.options.baseUrl || ''
        );
        if (opt) {
          const layerAdapterOptions: ImageAdapterOptions = {
            ...opt,
            setViewDelay: layerOptions.adapterOptions?.setViewDelay,
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

      async getIdentificationIds() {
        const id = this.item && this.item.resource.parent.id;
        if (id) {
          return [id];
        }
      }
      // beforeRemove() {

      // }
    };
  } else {
    throw new Error(adapter + ' not supported yet. Only TILE');
  }
}
