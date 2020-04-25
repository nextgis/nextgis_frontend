import { NgwLayerOptions, GetClassAdapterOptions } from './interfaces';
import WebMap, { Type } from '@nextgis/webmap';
import NgwConnector from '@nextgis/ngw-connector';
import { WebMapLayerAdapter } from './WebMapLayerAdapter';
import { resourceIdFromLayerOptions } from './utils/resourceIdFromLayerOptions';

export async function createWebMapAdapter({
  layerOptions: options,
  webMap,
  connector,
}: GetClassAdapterOptions): Promise<Type<WebMapLayerAdapter>> {
  const resourceId = await resourceIdFromLayerOptions(options, connector);
  return class Adapter extends WebMapLayerAdapter {
    constructor(map: any) {
      super(map, {
        webMap,
        resourceId,
        connector,
      });
    }
  };
}
