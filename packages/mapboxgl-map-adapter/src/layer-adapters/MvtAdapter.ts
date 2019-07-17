import { MvtAdapterOptions } from '@nextgis/webmap';
import { VectorAdapter } from './VectorAdapter';
import { TLayer } from '../MapboxglMapAdapter';

import { Map } from 'mapbox-gl';

export class MvtAdapter extends VectorAdapter<MvtAdapterOptions> {

  async addLayer(options: MvtAdapterOptions): Promise<TLayer> {
    const layer = super.addLayer(options);
    this._updateLayerPaint(this.options.type || 'fill');
    return layer;
  }

  protected _getAdditionalLayerOptions() {
    return {
      'source': {
        type: 'vector',
        tiles: [this.options.url],
      },
      'source-layer': this.options['source-layer']
    };
  }
}
