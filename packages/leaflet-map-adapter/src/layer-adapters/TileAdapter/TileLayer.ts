import { TileLayer as TL, TileLayerOptions } from 'leaflet';

import { makeRemote } from '../RemoteTileLayer';

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
