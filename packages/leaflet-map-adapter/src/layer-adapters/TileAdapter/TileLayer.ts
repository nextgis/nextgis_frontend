import { TileLayer as TL, TileLayerOptions } from 'leaflet';
import { applyMixins } from '@nextgis/utils';
import { RemoteTileLayer } from '../RemoteTileLayer';

type TLOptions = TileLayerOptions & { headers: any };

export class TileLayer extends TL {
  constructor(urlTemplate: string, options?: TLOptions) {
    super(urlTemplate, options);
  }
}

applyMixins(TileLayer, [RemoteTileLayer]);
