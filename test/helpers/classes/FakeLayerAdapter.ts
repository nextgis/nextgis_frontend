import { BaseLayerAdapter, AdapterOptions } from '../../../packages/webmap/src';

let ID = 0;

export class FakeLayerAdapter implements BaseLayerAdapter {
  options: AdapterOptions = { id: String(ID++) };

  async addLayer(options: AdapterOptions) {
    return {};
  }
}
