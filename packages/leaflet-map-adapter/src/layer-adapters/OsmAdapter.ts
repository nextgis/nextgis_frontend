import { TileAdapter } from './TileAdapter/TileAdapter';

import type { MainLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';
import type { TileLayer } from 'leaflet';

export class OsmAdapter extends TileAdapter implements MainLayerAdapter {
  addLayer(options: Omit<TileAdapterOptions, 'url'>): TileLayer | undefined {
    const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    return super.addLayer({
      name: 'OpenStreetMap',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      ...options,
      url,
    });
  }
}
