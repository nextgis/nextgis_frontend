import { BaseAdapter } from './BaseAdapter';
import { Layer } from 'mapbox-gl';

export class MvtAdapter extends BaseAdapter {

  addLayer(options?): string {
    options = Object.assign({}, this.options, options || {});
    // read about https://blog.mapbox.com/vector-tile-specification-version-2-whats-changed-259d4cd73df6
    const idString = String(this.name);


    const layerOptions: Layer = {
      'id': idString,
      'type': 'fill',
      'source-layer': idString,
      'source': {
        type: 'vector',
        tiles: [options.url]
      },
      'layout': {
        visibility: 'none'
      }
    };

    if (options.paint) {
      layerOptions.paint = options.paint;
    }

    this.map.addLayer(layerOptions);
    return this.name;
  }
}
