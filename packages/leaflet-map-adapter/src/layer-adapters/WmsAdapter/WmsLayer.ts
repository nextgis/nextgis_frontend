import { TileLayer } from 'leaflet';
import { makeRemote } from '../../utils/makeRemoteTileLayer';
import type { WMSOptions } from 'leaflet';

type LayerOptions = WMSOptions & { headers: any };

class WmsLayerBase extends TileLayer.WMS {
  constructor(urlTemplate: string, options: LayerOptions) {
    super(urlTemplate, options);
  }
}

export const WmsLayer = makeRemote(WmsLayerBase);

// applyMixins(WmsLayer, [RemoteTileLayer]);
