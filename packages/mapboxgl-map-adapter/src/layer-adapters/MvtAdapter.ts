import { BaseLayerAdapter } from '@nextgis/webmap';
import { BaseAdapter } from './BaseAdapter';
import { Layer } from 'mapbox-gl';

export class MvtAdapter extends BaseAdapter implements BaseLayerAdapter {

  addLayer(options: any): string[] {
    options = this.options = { ...this.options, ...(options || {}) };
    // read about https://blog.mapbox.com/vector-tile-specification-version-2-whats-changed-259d4cd73df6
    const idString = String(options.id);

    const layerOptions: Layer = {
      'id': idString,
      'type': options.type || 'fill',
      'source-layer': options['source-layer'] || idString,
      'source': {
        type: 'vector',
        tiles: [options.url],
      },
      'layout': {
        visibility: 'none',
      },
      // paint: {'fill-color': 'red'}
    };

    if (options.paint) {
      layerOptions.paint = options.paint;
    }

    this.map.addLayer(layerOptions);
    this.layer = [idString];
    return this.layer;
  }
}
