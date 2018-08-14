import { TileAdapter } from './TileAdapter';

export class OsmAdapter extends TileAdapter {

  options = {
    url: '',
    attribution: '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    subdomains: 'abc'
  };

  name: 'osm';

  addLayer(name, options) {

    super.addLayer(this.name, Object.assign({}, this.options, options));
  }
}
