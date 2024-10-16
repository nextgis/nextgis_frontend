import { createQmsAdapter } from './utils/createQmsAdapter';

import type { Type } from '@nextgis/utils';
import type {
  LayerAdapterCreators,
  MainLayerAdapter,
  StarterKit,
  WebMap,
} from '@nextgis/webmap';

import type { QmsOptions } from './interfaces';

export class QmsKit implements StarterKit {
  static utils = {
    createQmsAdapter,
  };

  options: QmsOptions = {
    url: 'https://qms.nextgis.com',
  };

  url: string;

  constructor(options?: QmsOptions) {
    this.options = { ...this.options, ...options };
    this.url = this.options.url;
  }

  getLayerAdapters(): Promise<LayerAdapterCreators[]> {
    return Promise.resolve([
      {
        name: 'QMS',
        createAdapter: (webmap: WebMap) =>
          Promise.resolve(this._createAdapter(webmap)),
      },
    ]);
  }

  private _createAdapter(webMap: WebMap): Type<MainLayerAdapter> {
    return createQmsAdapter({ webMap, url: this.url });
  }
}
