import { getLayerRequestOptions } from '@nextgis/webmap';

import { setupLayerTransformRequest } from '../utils/setupLayerTransformRequest';

import { VectorAdapter } from './VectorAdapter';

import type { MvtAdapterOptions } from '@nextgis/webmap';

import type { VectorLayerSpecification } from '../interfaces';
import type { TLayer } from '../MaplibreGLMapAdapter';

export class MvtAdapter extends VectorAdapter<MvtAdapterOptions> {
  static sources: string[] = [];

  source?: string;

  async addLayer(options: MvtAdapterOptions): Promise<TLayer> {
    const layer = await super.addLayer(options);
    const request = getLayerRequestOptions(options);
    if (this.map && request) {
      setupLayerTransformRequest({
        map: this.map,
        url: options.url,
        request,
      });
    }
    this._updateLayerPaint(this.options.type || 'polygon');

    return layer;
  }

  protected _getAdditionalLayerOptions(): Partial<VectorLayerSpecification> {
    const exist = MvtAdapter.sources.includes(this.options.url);
    if (!exist && this.map) {
      this.map.addSource(this.options.url, {
        type: 'vector',
        tiles: [this.options.url],
      });
      this.source = this.options.url;
      MvtAdapter.sources.push(this.options.url);
    }
    const mvtLayerOptions: Partial<VectorLayerSpecification> = {
      source: this.options.url,
      'source-layer': this.options.sourceLayer,
    };
    return mvtLayerOptions;
  }
}
