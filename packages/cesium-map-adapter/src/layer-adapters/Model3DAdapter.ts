/**
 * @module cesium-map-adapter
 * UNDER DEVELOPMENT
 */
import { LngLatBoundsArray, Model3DOptions } from '@nextgis/webmap';
import {
  Model,
  Transforms,
  Cartesian3,
  Math as CMath,
  HeadingPitchRoll,
} from 'cesium';

import { BaseAdapter } from './BaseAdapter';

const LAT = 52;
const LON = 104;

type Layer = Model;

export class Model3DAdapter extends BaseAdapter<Model3DOptions, Layer> {
  private _extent?: LngLatBoundsArray = [LON, LAT, LON, LAT];
  private _layer?: Model;

  addLayer(opt: Model3DOptions) {
    const { lat, lon, height, rotate } = opt;
    const position = Cartesian3.fromDegrees(lon, lat, height);

    const heading = CMath.toRadians(rotate || 0);
    const pitch = 0;
    const roll = 0;
    const headingPitchRoll = new HeadingPitchRoll(heading, pitch, roll);

    const modelMatrix = Transforms.headingPitchRollToFixedFrame(
      position,
      headingPitchRoll
    );

    // const modelMatrix = Transforms.eastNorthUpToFixedFrame(position);

    this.options = { ...opt };
    this._layer = Model.fromGltf({
      url: this.options.url,
      show: false,
      modelMatrix,
      scale: opt.scale || 1,
      allowPicking: false,
      debugShowBoundingVolume: false,
      debugWireframe: false,
    });

    this.map.scene.primitives.add(this._layer);
    return this._layer;
  }

  getExtent() {
    return this._extent;
  }

  showLayer(layer: Layer) {
    layer = layer || this._layer;
    layer.show = true;
  }

  hideLayer(layer: Layer) {
    layer = layer || this._layer;
    layer.show = false;
  }

  removeLayer() {
    if (this._layer) {
      this.map.scene.primitives.remove(this._layer);
    }
    this._layer = undefined;
  }
}
