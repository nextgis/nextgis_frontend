import mapboxgl from 'mapbox-gl';

export abstract class BaseAdapter {

  map: mapboxgl.Map;
  name: string;
  options;

  constructor(map, layerName, options?) {
    this.map = map;
    this.name = layerName;
    this.options = Object.assign({}, this.options, options);
    this.addLayer();
  }

  addLayer(options?): string {
    return '';
  }
}
