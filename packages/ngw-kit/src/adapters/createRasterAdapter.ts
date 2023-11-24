import { defined } from '@nextgis/utils';

import { ngwApiToAdapterOptions } from '../utils/ngwApiToAdapterOptions';
import { resourceIdFromLayerOptions } from '../utils/resourceIdFromLayerOptions';

import type {
  GetClassAdapterOptions,
  NgwLayerAdapterType,
  ResourceAdapter,
} from '../interfaces';
import type { ResourceCls, ResourceItem } from '@nextgis/ngw-connector';
import type { Type } from '@nextgis/utils';
import type {
  GetLegendOptions,
  ImageAdapterOptions,
  LayerLegend,
  MainLayerAdapter,
} from '@nextgis/webmap';

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

      async getLegend(options?: GetLegendOptions): Promise<LayerLegend[]> {
        const ngwLegend = await connector.get('render.legend_symbols', {
          params: { id: resourceId },
          cache: true,
          ...options,
        });
        const id = this.options.id;
        if (id !== undefined) {
          const legend: LayerLegend = {
            layerId: id,
            legend: ngwLegend.map(({ display_name, icon }) => ({
              name: display_name,
              symbol: icon,
            })),
          };
          return [legend];
        }
        return [];
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
