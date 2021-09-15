/**
 * UNDER DEVELOPMENT
 */
import { LngLatBoundsArray } from '@nextgis/utils';
import { Model3DOptions } from '@nextgis/webmap';
import {
  Model,
  Transforms,
  Cartesian3,
  Math as CMath,
  HeadingPitchRoll,
  Cartographic,
} from 'cesium';

import { BaseAdapter } from './BaseAdapter';
import { whenSampleTerrainMostDetailed } from '../utils/whenSampleTerrainMostDetailed';
import { makeUrl } from '../utils/makeUrl';

type Layer = Model;

export class Model3DAdapter extends BaseAdapter<Model3DOptions, Layer> {
  private _extent?: LngLatBoundsArray;
  private _layer?: Model;

  onTerrainChange = (): void => {
    this.watchHeight();
  };

  addLayer(opt: Model3DOptions): Model {
    this.options = { ...this.options, ...opt };
    const url = makeUrl(this.options.url, this.options.headers);
    this.options = { ...opt };
    this._layer = Model.fromGltf({
      url,
      show: false,
      modelMatrix: this._getModelMatrix(),
      scale: opt.scale || 1,
      allowPicking: false,
      debugShowBoundingVolume: false,
      debugWireframe: false,
    });
    this.watchHeight();
    this.map.scene.primitives.add(this._layer);
    return this._layer;
  }

  /** @deprecated use {@link GeoJsonAdapter.getBounds} instead */
  getExtent(): LngLatBoundsArray | undefined {
    return this.getBounds();
  }

  getBounds(): LngLatBoundsArray | undefined {
    return this._extent;
  }

  showLayer(layer: Layer): void {
    layer = layer || this._layer;
    layer.show = true;
    super.showLayer();
  }

  hideLayer(layer: Layer): void {
    layer = layer || this._layer;
    layer.show = false;
    super.hideLayer();
  }

  removeLayer(): void {
    if (this._layer) {
      this.map.scene.primitives.remove(this._layer);
    }
    this._layer = undefined;
  }

  private watchHeight() {
    if (this._layer) {
      const { lon, lat } = this.options;
      const terrainSamplePositions: Cartographic[] = [
        Cartographic.fromDegrees(lon, lat),
      ];

      whenSampleTerrainMostDetailed(
        this.map.terrainProvider,
        terrainSamplePositions,
        () => {
          if (this._layer) {
            const height = terrainSamplePositions[0].height;
            const modelMatrix = this._getModelMatrix({ height });
            this._layer.modelMatrix = modelMatrix;
          }
        },
      );
    }
  }

  private _getModelMatrix(opt?: Partial<Model3DOptions>) {
    const options = { ...this.options, ...opt };
    const { lat, lon, height, rotate } = options;
    const position = Cartesian3.fromDegrees(lon, lat, height);

    const heading = CMath.toRadians(rotate || 0);
    const pitch = 0;
    const roll = 0;
    const headingPitchRoll = new HeadingPitchRoll(heading, pitch, roll);

    this._extent = [lon, lat, lon, lat];

    return Transforms.headingPitchRollToFixedFrame(position, headingPitchRoll);
  }
}
