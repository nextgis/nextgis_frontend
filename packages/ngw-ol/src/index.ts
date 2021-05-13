/**
 * Single-file bundle for rapid deployment of {@link https://openlayers.org/ | OpenLayers }-based web-gis applications with NextGIS services
 *
 * @remarks
 * Styles images and other assets are already in bundle, you don't need to include anything except one JS file!
 *
 * @packageDocumentation
 */
import 'ol/ol.css';
import '@nextgis/control-container/lib/control-container.css';
import { NgwMap, NgwMapOptions } from '@nextgis/ngw-map';
import OlMapAdapter from '@nextgis/ol-map-adapter';

class NgwOl extends NgwMap {
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
