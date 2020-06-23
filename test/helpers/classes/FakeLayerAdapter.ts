import { MainLayerAdapter, AdapterOptions } from '../../../packages/webmap/src';
import sleep from '../utils/asyncTimeout';

let ID = 0;

export class FakeLayerAdapter implements MainLayerAdapter {
  options: AdapterOptions = { id: String(ID++) };

  async addLayer(options: AdapterOptions): Promise<any> {
    this.options = { ...this.options, ...options };
    await sleep(100);
    return options.id;
  }

  showLayer(): void {
    //
  }

  removeLayer(): void {
    //
  }
}
