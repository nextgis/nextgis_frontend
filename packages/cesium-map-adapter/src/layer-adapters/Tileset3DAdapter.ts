import { TileAdapterOptions, LngLatBoundsArray } from '@nextgis/webmap';
import {
  Cesium3DTileset,
  Math as CMath,
  Matrix4,
  Cartesian3,
  Cartographic,
  Ellipsoid,
} from 'cesium';
import { BaseAdapter } from './BaseAdapter';
import { whenSampleTerrainMostDetailed } from '../utils/whenSampleTerrainMostDetailed';

export class Tileset3DAdapter extends BaseAdapter<TileAdapterOptions> {
  layer?: Cesium3DTileset;
  private _extent?: LngLatBoundsArray;

  async addLayer(opt: TileAdapterOptions) {
    this.options = { ...opt };
    const tileset = await this._addLayer();
    return tileset;
  }

  onTerrainChange = () => {
    this.watchHeight();
  };

  beforeRemove() {
    if (this.layer) {
      this.map.scene.primitives.remove(this.layer);
    }
    super.beforeRemove();
  }

  getExtent() {
    return this._extent;
  }

  showLayer() {
    if (this.layer) {
      this.layer.show = true;
    }
    super.showLayer();
  }

  hideLayer() {
    if (this.layer) {
      this.layer.show = false;
    }
    super.hideLayer();
  }

  private async _addLayer() {
    const layer = new Cesium3DTileset({
      url: this.options.url,
    });
    layer.show = false;

    const tileset = await layer.readyPromise;

    this.layer = tileset;
    this._extent = this._calculateExtent();
    this.map.scene.primitives.add(this.layer);
    this.watchHeight();
    return this.layer;
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

  private watchHeight() {
    if (this.layer) {
      const boundingSphere = this.layer.boundingSphere;
      const cartographic = Cartographic.fromCartesian(boundingSphere.center);
      const heightSurface = cartographic.height;
      const terrainSamplePositions = [cartographic];
      whenSampleTerrainMostDetailed(
        this.map.terrainProvider,
        terrainSamplePositions,
        () => {
          if (this.layer) {
            const lon = cartographic.longitude;
            const lat = cartographic.latitude;
            const heightOffset = terrainSamplePositions[0].height;
            const surface = Cartesian3.fromRadians(lon, lat, 0);
            const offset = Cartesian3.fromRadians(
              lon,
              lat,
              heightOffset - heightSurface
            );
            const translation = Cartesian3.subtract(
              offset,
              surface,
              new Cartesian3()
            );
            this.layer.modelMatrix = Matrix4.fromTranslation(translation);
          }
        }
      );
    }
  }
}
