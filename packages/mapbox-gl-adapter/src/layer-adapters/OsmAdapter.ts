import { TileAdapter } from './TileAdapter';
import mapboxgl from 'mapbox-gl';

export class OsmAdapter extends TileAdapter {

  options = {
    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    subdomains: 'abc'
  };

  addLayer(map: mapboxgl.Map, name: string, options): string {
    return super.addLayer(map, name, Object.assign({}, this.options, options));
  }
}
