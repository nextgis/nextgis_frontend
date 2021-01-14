import { TileLayer as TL, TileLayerOptions, } from 'leaflet';

import { makeRemote } from '../RemoteTileLayer';



type TLOptions = TileLayerOptions & { headers: any };

class TileLayerBase extends TL {
  constructor(urlTemplate: string, options?: TLOptions) {
    super(urlTemplate, options);
  }
}

export const TileLayer = makeRemote(TileLayerBase);

// applyMixins(TileLayer, [RemoteTileLayer]);
