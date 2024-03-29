import { NgwWebmapLayerAdapter as NWLayerAdapter } from '../NgwWebmapLayerAdapter';
import { resourceIdFromLayerOptions } from '../utils/resourceIdFromLayerOptions';

import type { GetClassAdapterOptions } from '../interfaces';
import type { Type } from '@nextgis/utils';

export async function createWebMapAdapter({
  layerOptions: options,
  webMap,
  connector,
}: GetClassAdapterOptions): Promise<Type<NWLayerAdapter>> {
  const resourceId = await resourceIdFromLayerOptions(options, connector);
  return class NgwWebmapLayerAdapter extends NWLayerAdapter {
    constructor(map: any) {
      super(map, {
        url: '',
        webMap,
        resourceId,
        connector,
      });
    }
  };
}
