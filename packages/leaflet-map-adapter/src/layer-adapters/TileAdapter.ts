import { LayerAdapter } from '@nextgis/webmap';
import { TileLayer } from 'leaflet';
import { BaseAdapter } from './BaseAdapter';

let ID = 1;

export class TileAdapter extends BaseAdapter implements LayerAdapter {

  name: string;

  addLayer(options?) {

    this.name = options.id || 'tile-' + ID++;
    const {url, ...opt} = options;
    const layer = new TileLayer(url, opt);

    // layer.addTo(this.map);

    return layer;
  }
}
