import {Map} from 'mapbox-gl';

let ID = 1;

export abstract class BaseAdapter {

  map: Map;
  name: string;
  options;

  constructor(map, options?) {
    this.map = map;
    this.name = options.id || String(ID++);
    this.options = Object.assign({}, this.options, options);
    this.addLayer();
  }

  addLayer(options?): string {
    return '';
  }
}
