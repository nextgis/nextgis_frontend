/**
 * @module cesium-map-adapter
 * UNDER DEVELOPMENT
 */
import { TileAdapterOptions, LngLatBoundsArray, RasterAdapterOptions } from '@nextgis/webmap';
import {
  Model,
  Transforms,
  Cartesian3,
} from 'cesium';

import { BaseAdapter } from './BaseAdapter';

const LAT = 52;
const LON = 104;

type Layer = Model;


export class Model3DAdapter extends BaseAdapter<RasterAdapterOptions, Layer> {

  private _extent?: LngLatBoundsArray = [LON, LAT, LON, LAT];
  private _layer?: Model;

  addLayer(opt: TileAdapterOptions) {

    var origin = Cartesian3.fromDegrees(LON, LAT);
    var modelMatrix = Transforms.eastNorthUpToFixedFrame(origin);

    this.options = { ...opt };
    this._layer = Model.fromGltf({
      url: this.options.url,
      show: false,
      modelMatrix,
      scale: 1,
      allowPicking: false,
      debugShowBoundingVolume: false,
      debugWireframe: false
    });
    this.map.scene.primitives.add(this._layer);
    return this._layer;
  }

  getExtent() {
    return this._extent;
  }

  showLayer(layer: Layer) {
    layer.show = true
  }

  hideLayer(layer: Layer) {
    layer.show = false;
  }

  removeLayer() {
    if (this._layer) {
      this.map.scene.primitives.remove(this._layer);
    }
    this._layer = undefined;
  }
}
