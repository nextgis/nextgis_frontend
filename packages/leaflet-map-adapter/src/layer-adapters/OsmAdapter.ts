import { MainLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';
import { TileLayer } from 'leaflet';

import { TileAdapter } from './TileAdapter/TileAdapter';

export class OsmAdapter extends TileAdapter implements MainLayerAdapter {
  addLayer(options: TileAdapterOptions): TileLayer | undefined {
    const url =
      options.url || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    return super.addLayer({
      name: 'OpenStreetMap',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ...options,
      url,
    });
  }
}
