import { MainLayerAdapter, TileAdapterOptions } from '@nextgis/webmap';
import { TileAdapter } from './TileAdapter';

const OPTIONS = {
  url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
  subdomains: 'abc',
};

export class OsmAdapter extends TileAdapter implements MainLayerAdapter {
  addLayer(options: TileAdapterOptions): string[] | undefined {
    return super.addLayer(Object.assign({}, OPTIONS, options));
  }
}
