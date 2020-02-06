/**
 * @module ngw-cesium
 */
// import 'cesium/Build/Cesium/Widgets/widgets.css';
import 'cesium/Widgets/widgets.css';
import NgwMap, { NgwMapOptions } from '@nextgis/ngw-map';
import MapAdapter from '@nextgis/cesium-map-adapter';

export class NgwCesium extends NgwMap {
  constructor(options: NgwMapOptions) {
    super(new MapAdapter(), options);
  }

  static create = async (options: NgwMapOptions) => {
    const ngwMap = new NgwCesium(options);
    return ngwMap.onLoad();
  };
}

export default NgwCesium;

// @ts-ignore
if (window && !window.NgwMap) {
  // @ts-ignore
  window.NgwMap = NgwCesium;
}
