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

}

export default NgwOl;

// @ts-ignore
if (window && !window.NgwMap) { window.NgwMap = NgwOl; }
