import { LayerAdapter } from '@nextgis/webmap';
import { BaseAdapter } from './BaseAdapter';

let ID = 1;

export class GeoJSONAdapter extends BaseAdapter implements LayerAdapter {

  addLayer(options?): string {
    this.name = options.id || 'geojson-' + ID++;
    const opt = { ...this.options, ...(options || {}) };

    // this.map.addLayer({
    //   id: String(this.name),
    //   type: options.type || 'fill',
    //   layout: {
    //     visibility: 'none',
    //   },
    //   source: {
    //     type: 'geojson',
    //     data: opt.data,
    //   },
    // }, options.before);
    console.log(options.data);
    this.map.addLayer({
      'id': String(this.name),
      'type': options.type || 'fill',
      'source': {
        'type': 'geojson',
        'data': options.data
      },
      'layout': {},
      'paint': {
        'fill-color': 'red',
        'fill-opacity': 0.8
      }
    });
    return this.name;
  }
}
