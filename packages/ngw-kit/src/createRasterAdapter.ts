import { NgwLayerOptions, ResourceAdapter } from './interfaces';
import WebMap, {
  BaseLayerAdapter,
  Type,
  ImageAdapterOptions,
  TileAdapterOptions
} from '@nextgis/webmap';
import { getLayerAdapterOptions } from './utils/utils';
import NgwConnector, { ResourceItem } from '@nextgis/ngw-connector';
import { resourceIdFromLayerOptions } from './utils/resourceIdFromLayerOptions';

export async function createRasterAdapter(
  options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string,
  connector: NgwConnector
): Promise<Type<BaseLayerAdapter> | undefined> {
  let adapter = options.adapter || 'IMAGE';

  if (adapter === 'IMAGE') {
    const layerAdapters = webMap.getLayerAdapters();
    const isImageAllowed = layerAdapters ? layerAdapters.IMAGE : true;
    if (!isImageAllowed) {
      adapter = 'TILE';
    }
  }
  if (adapter === 'IMAGE' || adapter === 'TILE' || adapter === 'MVT') {
    const adapterClass = webMap.mapAdapter.layerAdapters[adapter] as Type<
      BaseLayerAdapter
    >;
    const resourceId = await resourceIdFromLayerOptions(options, connector);
    return class Adapter extends adapterClass implements ResourceAdapter {
      // options = {};
      item?: ResourceItem;
      resourceId = resourceId;

      constructor(public map: any, _options: any) {
        super(map, _options);
        const opt = getLayerAdapterOptions(options, webMap, baseUrl);
        if (opt) {
          if (opt.resourceId) {
            const layerAdapterOptions: ImageAdapterOptions = {
              ...opt,
              resourceId: opt.resourceId
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
