import MapAdapter from '@nextgis/cesium-map-adapter';
import { NgwMap } from '@nextgis/ngw-map';

import type { NgwMapOptions } from '@nextgis/ngw-map';

import 'cesium/Build/Cesium/Widgets/widgets.css';

class NgwCesium extends NgwMap {
  constructor(options: NgwMapOptions) {
    options = { ...options, mapAdapter: new MapAdapter() };
    super(options);
  }
  static async create(options: NgwMapOptions): Promise<NgwCesium> {
    const ngwMap = new NgwCesium(options);
    return ngwMap.onLoad();
  }
}

export default NgwCesium;

// (window as any).CESIUM_BASE_URL = window.location.href;
(window as any).CESIUM_BASE_URL =
  (window as any).CESIUM_BASE_URL ||
  'https://cesium.com/downloads/cesiumjs/releases/1.66/Build/Cesium';

if ((window as any) && !(window as any).NgwMap) {
  (window as any).NgwMap = NgwCesium;
}
