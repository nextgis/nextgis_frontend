import { MvtAdapterOptions } from '@nextgis/webmap';
import { Layer } from 'maplibre-gl';
import { VectorAdapter } from './VectorAdapter';
import { TLayer } from '../MapboxglMapAdapter';

export class MvtAdapter extends VectorAdapter<MvtAdapterOptions> {
  static sources: string[] = [];

  source?: string;

  async addLayer(options: MvtAdapterOptions): Promise<TLayer> {
    const layer = await super.addLayer(options);
    this._updateLayerPaint(this.options.type || 'polygon');

    return layer;
  }

  protected _getAdditionalLayerOptions(): Partial<Layer> {
    const exist = MvtAdapter.sources.includes(this.options.url);
    if (!exist && this.map) {
      this.map.addSource(this.options.url, {
        type: 'vector',
        tiles: [this.options.url],
      });
      this.source = this.options.url;
      MvtAdapter.sources.push(this.options.url);
    }
    const mvtLayerOptions: Partial<Layer> = {
      source: this.options.url,
      'source-layer': this.options.sourceLayer,
    };
    return mvtLayerOptions;
  }
}
