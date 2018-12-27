import { LayerAdapter, WebMap } from '@nextgis/webmap';

let ID = 1;

export abstract class WebmapLayerAdapter implements LayerAdapter {

  map: WebMap;
  name: string;
  options;

  constructor(map: WebMap, options?) {
    this.map = map;
    this.name = options.id || String(ID++);
    this.options = {...this.options, ...options};

  }

  addLayer(options?) {
    return null;
  }
}
