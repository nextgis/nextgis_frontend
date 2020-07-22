import 'ol/ol.css';
import '@nextgis/control-container/lib/control-container.css';
import { NgwMap, NgwMapOptions } from '@nextgis/ngw-map';
import OlMapAdapter from '@nextgis/ol-map-adapter';

class NgwOl extends NgwMap {
  constructor(options: NgwMapOptions) {
    super(new OlMapAdapter(), options);
  }

  static async create(options: NgwMapOptions): Promise<NgwOl> {
    const ngwMap = new NgwOl(options);
    return ngwMap.onLoad();
  }
}

export default NgwOl;

// @ts-ignore
if (window && !window.NgwMap) {
  // @ts-ignore
  window.NgwMap = NgwOl;
}
