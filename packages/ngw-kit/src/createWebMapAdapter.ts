import { Type } from '@nextgis/webmap';
import { GetClassAdapterOptions } from './interfaces';
import { WebMapLayerAdapter } from './WebMapLayerAdapter';
import { resourceIdFromLayerOptions } from './utils/resourceIdFromLayerOptions';

export async function createWebMapAdapter({
  layerOptions: options,
  webMap,
  connector,
}: GetClassAdapterOptions): Promise<Type<WebMapLayerAdapter>> {
  const resourceId = await resourceIdFromLayerOptions(options, connector);
  return class WebMapAdapter extends WebMapLayerAdapter {
    constructor(map: any) {
      super(map, {
        webMap,
        resourceId,
        connector,
      });
    }
  };
}
