import {
  Cesium3DTileset,
  Matrix4,
  Cartesian3,
  Cartographic,
  Cesium3DTileStyle,
  Color,
} from 'cesium';
import { debugLog } from '@nextgis/utils';
import { getExtentFromBoundingSphere } from '../utils/getExtentFromBoundingSphere';
import { makeUrl } from '../utils/makeUrl';
import { whenSampleTerrainMostDetailed } from '../utils/whenSampleTerrainMostDetailed';
import { BaseAdapter } from './BaseAdapter';

import type Resource from 'cesium/Source/Core/Resource';
import type { LngLatBoundsArray } from '@nextgis/utils';
import type { Tileset3DAdapterOptions } from '@nextgis/webmap';

export class Tileset3DAdapter extends BaseAdapter<Tileset3DAdapterOptions> {
  layer?: Cesium3DTileset;
  private _extent?: LngLatBoundsArray;

  async addLayer(
    opt: Tileset3DAdapterOptions,
  ): Promise<Cesium3DTileset | undefined> {
    this.options = { ...this.options, ...opt };
    const tileset = await this._addLayer();
    return tileset;
  }

  onTerrainChange = (): void => {
    this.watchHeight();
  };

  beforeRemove(): void {
    if (this.layer) {
      this.map.scene.primitives.remove(this.layer);
    }
    super.beforeRemove();
  }

  getExtent(): LngLatBoundsArray | undefined {
    return this._extent;
  }

  showLayer(): void {
    const tileset = this.layer;
    if (tileset) {
      tileset.show = true;
      if (
        this.options.paint &&
        'color' in this.options.paint &&
        this.options.paint.color &&
        typeof this.options.paint.color === 'string'
      ) {
        const colorFromCss = Color.fromCssColorString(this.options.paint.color);
        if (colorFromCss) {
          // use lead toCssColorString to format color as rbg(,,,) or rgba(,,,,) stringCssColorString();
          const color = colorFromCss.toCssColorString();
          tileset.style = new Cesium3DTileStyle({
            color,
          });
        }
      }
    }
    super.showLayer();
  }

  hideLayer(): void {
    if (this.layer) {
      this.layer.show = false;
    }
    super.hideLayer();
  }

  private async _addLayer() {
    const url = makeUrl(this.options.url, this.options.headers);
    const options: Partial<Cesium3DTileset> & { url: string | Resource } = {
      url,
      skipLevelOfDetail: true,
    };
    const maximumScreenSpaceError =
      this.options.nativeOptions &&
      this.options.nativeOptions.maximumScreenSpaceError;
    // if (defined(maximumScreenSpaceError)) {
    //   options.maximumScreenSpaceError = maximumScreenSpaceError;
    // }
    options.maximumScreenSpaceError = maximumScreenSpaceError || 1;

    const layer = new Cesium3DTileset(options);
    layer.show = false;

    try {
      const tileset = await layer.readyPromise;
      this.layer = tileset;

      this._extent = this._calculateExtent();
      this.map.scene.primitives.add(this.layer);
      this.watchHeight();
      if (this.options.heightOffset !== undefined) {
        this._setHeight();
      }
      return this.layer;
    } catch (er) {
      debugLog(er);
    }
  }

  private _calculateExtent() {
    const tileset = this.layer;
    if (tileset) {
      return getExtentFromBoundingSphere(tileset.boundingSphere);
    }
  }

  private _setHeight(height?: number) {
    if (this.layer) {
      const boundingSphere = this.layer.boundingSphere;
      const cartographic = Cartographic.fromCartesian(boundingSphere.center);
      if (height === undefined) {
        height = 0;
      }
      if (this.options.heightOffset) {
        height += this.options.heightOffset;
      }
      if (height !== undefined) {
        const lon = cartographic.longitude;
        const lat = cartographic.latitude;
        const surface = Cartesian3.fromRadians(lon, lat, 0);
        const offset = Cartesian3.fromRadians(lon, lat, height);
        const translation = Cartesian3.subtract(
          offset,
          surface,
          new Cartesian3(),
        );
        this.layer.modelMatrix = Matrix4.fromTranslation(translation);
      }
    }
  }

  private watchHeight() {
    if (this.layer && this.options.useTerrainHeight) {
      const boundingSphere = this.layer.boundingSphere;
      const cartographic = Cartographic.fromCartesian(boundingSphere.center);

      const terrainSamplePositions = [cartographic];
      whenSampleTerrainMostDetailed(
        this.map.terrainProvider,
        terrainSamplePositions,
        () => {
          const heightOffset = terrainSamplePositions[0].height;
          this._setHeight(heightOffset);
        },
      );
    }
  }
}
