import { FakeLayerAdapter } from './FakeLayerAdapter';
import {
  VectorLayerAdapter,
  VectorAdapterOptions
} from '../../../packages/webmap/src';

export class FakeGeoJsonLayerAdapter extends FakeLayerAdapter
  implements VectorLayerAdapter {
  async addLayer(options: VectorAdapterOptions) {
    this.options = { ...this.options, ...options };
    return options.id;
  }
}
