/**
 * @module qms-kit
 */

import WebMap, { StarterKit, Type, BaseLayerAdapter } from '@nextgis/webmap';
import { QmsOptions } from './interfaces';
import { createQmsAdapter } from './utility';

export class QmsKit implements StarterKit {
  static utils = {
    createQmsAdapter
  };

  options: QmsOptions = {
    url: 'https://qms.nextgis.com'
  };

  url: string;

  constructor(options?: QmsOptions) {
    this.options = { ...this.options, ...options };
    this.url = this.options.url;
  }

  getLayerAdapters() {
    return Promise.resolve([
      {
        name: 'QMS',
        createAdapter: (webmap: WebMap) =>
          Promise.resolve(this._createAdapter(webmap))
      }
    ]);
  }

  private _createAdapter(webMap: WebMap): Type<BaseLayerAdapter> {
    return createQmsAdapter(webMap, this.url);
  }
}
