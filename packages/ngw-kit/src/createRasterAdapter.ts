import { NgwLayerOptions } from './interfaces';
import WebMap, { BaseLayerAdapter, Type, ImageAdapterOptions, TileAdapterOptions } from '@nextgis/webmap';
import { getLayerAdapterOptions } from './utils';

export async function createRasterAdapter(
  options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string): Promise<Type<BaseLayerAdapter> | undefined> {

  let adapter = options.adapter || 'IMAGE';
  const layerAdapters = webMap.getLayerAdapters();
  const isImageAllowed = layerAdapters ? layerAdapters.IMAGE : true;
  if (!isImageAllowed) {
    adapter = 'TILE';
  }
  if (adapter === 'IMAGE' || adapter === 'TILE') {

    const adapterClass = webMap.mapAdapter.layerAdapters[adapter] as Type<BaseLayerAdapter>;

    return class Adapter extends adapterClass {

      // options = {};

      constructor(public map: any, _options: any) {
        super(map, _options);
        const opt = getLayerAdapterOptions(options, webMap, baseUrl);
        if (opt) {
          if (opt.resourceId) {
            const layerAdapterOptions: ImageAdapterOptions = { ...opt, resourceId: opt.resourceId };
            this.options = {...this.options, ...layerAdapterOptions};
          } else {
            const tileAdapterOptions: TileAdapterOptions = opt;
            this.options = {...this.options, ...tileAdapterOptions};
          }
        }
      }
      addLayer(addOptions: any) {
        return super.addLayer({...this.options, ...addOptions});
      }
      // beforeRemove() {

      // }

    };
  } else {
    throw new Error(adapter + ' not supported yet. Only TILE');
  }
}
