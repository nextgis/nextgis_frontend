/**
 * @module ngw-ol
 */

import 'ol/ol.css';
import NgwMap, { NgwMapOptions } from '@nextgis/ngw-map';
import OlMapAdapter from '@nextgis/ol-map-adapter';

export class NgwOl extends NgwMap {
  constructor(options: NgwMapOptions) {
    super(new OlMapAdapter(), options);
  }

  static create = async (options: NgwMapOptions) => {
    const ngwMap = new NgwOl(options);
    return ngwMap.onLoad();
  };
}

export default NgwOl;

// @ts-ignore
if (window && !window.NgwMap) {
  // @ts-ignore
  window.NgwMap = NgwOl;
}
