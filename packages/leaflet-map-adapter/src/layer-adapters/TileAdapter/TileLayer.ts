import { TileLayer as TL } from 'leaflet';
import { makeRemote } from '../../utils/makeRemoteTileLayer';

import type { TileLayerOptions } from 'leaflet';

export type TileLayerOptionsExtended = TileLayerOptions & {
  headers: Record<string, any>;
  setViewDelay?: number;
};

class TileLayerBase extends TL {
  constructor(urlTemplate: string, options?: TileLayerOptionsExtended) {
    super(urlTemplate, options);
    Object.assign(this.options, options);
  }
}

export const TileLayer = makeRemote(TileLayerBase);
