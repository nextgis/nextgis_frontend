import { NgwMap } from '@nextgis/ngw-map';
import OlMapAdapter from '@nextgis/ol-map-adapter';

import type { NgwMapOptions } from '@nextgis/ngw-map';
import type Map from 'ol/Map';

import 'ol/ol.css';
import '@nextgis/ol-map-adapter/lib/ol-map-adapter.css';

class NgwOl extends NgwMap<Map> {
  constructor(options: NgwMapOptions) {
    super({ ...options, mapAdapter: new OlMapAdapter() });
  }

  static async create(options: NgwMapOptions): Promise<NgwOl> {
    const ngwMap = new NgwOl(options);
    return ngwMap.onLoad();
  }
}

export default NgwOl;

if ((window as any) && !(window as any).NgwMap) {
  (window as any).NgwMap = NgwOl;
}
