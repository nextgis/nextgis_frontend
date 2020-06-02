import {
  ResourceAdapter,
  NgwLayerAdapterType,
  GetClassAdapterOptions,
} from './interfaces';
import {
  BaseLayerAdapter,
  Type,
  ImageAdapterOptions,
  TileAdapterOptions,
} from '@nextgis/webmap';
import { getLayerAdapterOptions } from './utils/getLayerAdapterOptions';
import { ResourceItem, ResourceCls } from '@nextgis/ngw-connector';
import { resourceIdFromLayerOptions } from './utils/resourceIdFromLayerOptions';

export async function createRasterAdapter({
  layerOptions,
  webMap,
  connector,
  item,
}: GetClassAdapterOptions): Promise<Type<BaseLayerAdapter> | undefined> {
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

  const adapterClass = webMap.mapAdapter.layerAdapters[adapter] as Type<
    BaseLayerAdapter
  >;
  if (adapterClass) {
    const resourceId = await resourceIdFromLayerOptions(
      layerOptions,
      connector
    );
    return class Adapter extends adapterClass implements ResourceAdapter {
      // options = {};
      item?: ResourceItem;
      resourceId = resourceId;

      constructor(public map: any, _options: any) {
        super(map, _options);
        const opt = getLayerAdapterOptions(
          layerOptions,
          webMap,
          connector.options.baseUrl || ''
        );
        if (opt) {
          if (opt.resourceId) {
            const layerAdapterOptions: ImageAdapterOptions = {
              ...opt,
              layers: String(opt.resourceId),
              resourceId: opt.resourceId,
            };
            this.options = { ...this.options, ...layerAdapterOptions };
          } else {
            const tileAdapterOptions: TileAdapterOptions = opt;
            this.options = { ...this.options, ...tileAdapterOptions };
          }
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
