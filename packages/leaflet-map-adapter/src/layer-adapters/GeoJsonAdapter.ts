import { LayerAdapter } from '@nextgis/webmap';
import { GeoJSON } from 'leaflet';
import { BaseAdapter } from './BaseAdapter';

let ID = 1;

export class GeoJsonAdapter extends BaseAdapter implements LayerAdapter {

  name: string;

  addLayer(options?) {

    this.name = options.id || 'geojson-' + ID++;

    const layer = new GeoJSON(options.data, options);

    // layer.addTo(this.map);

    return layer;
  }
}
