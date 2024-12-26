import { defined } from '@nextgis/utils';

import { ngwApiToAdapterOptions } from '../utils/ngwApiToAdapterOptions';
import { resourceIdFromLayerOptions } from '../utils/resourceIdFromLayerOptions';

import type { Type } from '@nextgis/utils';
import type {
  GetLegendOptions,
  ImageAdapterOptions,
  MainLayerAdapter,
} from '@nextgis/webmap';

import type { CompositeRead, ResourceCls } from '@nextgisweb/resource/type/api';

import type {
  GetClassAdapterOptions,
  NgwLayerAdapterType,
  ResourceAdapter,
} from '../interfaces';
import { Legend } from '../Legend';

export type LegendSymbols = {
  [symbolIndex: number]: boolean | null;
};

export async function createRasterAdapter({
  layerOptions,
  connector,
  webMap,
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
      item?: CompositeRead = item;
      resourceId = resourceId;

      blocked = false;
      layerVisibility?: boolean;

      constructor(
        public map: any,
        _options: any,
      ) {
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
            layers: opt.layers || String(resourceId),
            resourceId,
          };
          if (
            layerOptions.adapterOptions &&
            defined(layerOptions.adapterOptions.setViewDelay)
          ) {
            layerAdapterOptions.setViewDelay =
              layerOptions.adapterOptions.setViewDelay;
          }
          this.options = { ...this.options, ...layerAdapterOptions };
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
          if (this.item.resource.parent) {
            const id = this.item.resource.parent.id;
            if (defined(id)) {
              return [id];
            }
          }
        }
        return [];
      }

      async getLegend(options?: GetLegendOptions): Promise<Legend[]> {
        const id = this.options.id;
        if (id !== undefined) {
          const ngwLegend = await connector
            .route('render.legend_symbols', { id: resourceId })
            .get({
              cache: true,
              ...options,
            });
          const legend = new Legend({
            layerId: id,
            layer: this,
            resourceId,
            webMap,
            legend: ngwLegend,
          });
          return [legend];
        }
        return [];
      }
    };
  } else {
    throw new Error(adapter + ' not supported yet. Only TILE');
  }
}
