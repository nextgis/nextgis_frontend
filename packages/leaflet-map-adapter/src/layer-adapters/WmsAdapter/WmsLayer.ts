import { TileLayer as TL, WMSOptions } from 'leaflet';
import { applyMixins } from '@nextgis/utils';
import { RemoteTileLayer } from '../RemoteTileLayer';

type LayerOptions = WMSOptions & { headers: any };

export class WmsLayer extends TL.WMS {
  constructor(urlTemplate: string, options: LayerOptions) {
    super(urlTemplate, options);
  }
}

applyMixins(WmsLayer, [RemoteTileLayer]);
