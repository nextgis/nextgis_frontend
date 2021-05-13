import { TileLayer as TL, WMSOptions } from 'leaflet';
import { makeRemote } from '../RemoteTileLayer';

type LayerOptions = WMSOptions & { headers: any };

class WmsLayerBase extends TL.WMS {
  constructor(urlTemplate: string, options: LayerOptions) {
    super(urlTemplate, options);
  }
}

export const WmsLayer = makeRemote(WmsLayerBase);

// applyMixins(WmsLayer, [RemoteTileLayer]);
