import { createQmsAdapter } from './utils/createQmsAdapter';

import type { Type } from '@nextgis/utils';
import type {
  LayerAdapterCreators,
  MainLayerAdapter,
  StarterKit,
  WebMap,
} from '@nextgis/webmap';

export class QmsKit implements StarterKit {
  static utils = {
    createQmsAdapter,
  };

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
    return createQmsAdapter({ webMap });
  }
}
