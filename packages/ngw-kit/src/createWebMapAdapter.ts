import { NgwLayerOptions } from './interfaces';
import WebMap, { Type } from '@nextgis/webmap';
import NgwConnector from '@nextgis/ngw-connector';
import { WebMapLayerAdapter } from './WebMapLayerAdapter';

export async function createWebMapAdapter(
  options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string,
  connector: NgwConnector): Promise<Type<WebMapLayerAdapter>> {

  return class Adapter extends WebMapLayerAdapter {

    constructor(map: any) {
      super(map, {
        webMap,
        resourceId: options.resourceId,
        baseUrl,
        connector
      });
    }

    // async addLayer(_opt: any) {
    //   const data = await geoJsonAdapterCb;
    //   const opt = onLoad(data);
    //   return super.addLayer({ ..._opt, ...opt });
    // }
    // beforeRemove() {
    //   geoJsonAdapterCb.cancel();
    // }
  };
}
