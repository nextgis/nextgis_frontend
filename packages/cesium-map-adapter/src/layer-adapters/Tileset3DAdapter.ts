import { Tileset3DAdapterOptions, LngLatBoundsArray } from '@nextgis/webmap';
import {
  Cesium3DTileset,
  Math as CMath,
  Matrix4,
  Cartesian3,
  Cartographic,
  Ellipsoid,
} from 'cesium';
import { whenSampleTerrainMostDetailed } from '../utils/whenSampleTerrainMostDetailed';
import { BaseAdapter } from './BaseAdapter';

export class Tileset3DAdapter extends BaseAdapter<Tileset3DAdapterOptions> {
  layer?: Cesium3DTileset;
  private _extent?: LngLatBoundsArray;

  async addLayer(
    opt: Tileset3DAdapterOptions
  ): Promise<Cesium3DTileset | undefined> {
    this.options = { ...opt };
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
    if (this.layer) {
      this.layer.show = true;
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
    const layer = new Cesium3DTileset({
      url: this.options.url,
      skipLevelOfDetail: true,
      maximumScreenSpaceError:
        this.options.nativeOptions &&
        this.options.nativeOptions.maximumScreenSpaceError &&
        this.options.nativeOptions.maximumScreenSpaceError !== undefined
          ? this.options.nativeOptions.maximumScreenSpaceError
          : 16,
    });
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
      if (__DEV__) {
        console.warn(er);
      }
    }
  }

  private _calculateExtent() {
    const tileset = this.layer;
    if (tileset) {
      const boundingSphere = tileset.boundingSphere;
      const minBoundingSphere = boundingSphere.clone();
      const maxBoundingSphere = boundingSphere.clone();
      minBoundingSphere.center.x =
        minBoundingSphere.center.x - boundingSphere.radius;
      minBoundingSphere.center.y =
        minBoundingSphere.center.y - boundingSphere.radius;
      maxBoundingSphere.center.x =
        maxBoundingSphere.center.x + boundingSphere.radius;
      maxBoundingSphere.center.y =
        maxBoundingSphere.center.y + boundingSphere.radius;
      const cartoMin = Ellipsoid.WGS84.cartesianToCartographic(
        minBoundingSphere.center
      );
      const cartoMax = Ellipsoid.WGS84.cartesianToCartographic(
        maxBoundingSphere.center
      );
      const west = CMath.toDegrees(cartoMin.longitude);
      const south = CMath.toDegrees(cartoMin.latitude);
      const east = CMath.toDegrees(cartoMax.longitude);
      const north = CMath.toDegrees(cartoMax.latitude);
      return [west, south, east, north];
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
          new Cartesian3()
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
        }
      );
    }
  }
}
