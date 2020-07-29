import { Type } from '@nextgis/webmap';
import { GetClassAdapterOptions } from './interfaces';
import { NgwWebmapLayerAdapter as NWLayerAdapter } from './NgwWebmapLayerAdapter';
import { resourceIdFromLayerOptions } from './utils/resourceIdFromLayerOptions';

export async function createWebMapAdapter({
  layerOptions: options,
  webMap,
  connector,
}: GetClassAdapterOptions): Promise<Type<NWLayerAdapter>> {
  const resourceId = await resourceIdFromLayerOptions(options, connector);
  return class NgwWebmapLayerAdapter extends NWLayerAdapter {
    constructor(map: any) {
      super(map, {
        webMap,
        resourceId,
        connector,
      });
    }
  };
}
