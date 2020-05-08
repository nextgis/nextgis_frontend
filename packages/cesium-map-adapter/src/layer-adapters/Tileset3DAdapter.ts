import { TileAdapterOptions, LngLatBoundsArray } from '@nextgis/webmap';
import {
  Cesium3DTileset,
  Math as CMath,
  Matrix4,
  Cartesian3,
  Cartographic,
  Ellipsoid,
  when,
  sampleTerrainMostDetailed,
} from 'cesium';
import { BaseAdapter } from './BaseAdapter';

export class Tileset3DAdapter extends BaseAdapter<TileAdapterOptions> {
  layer?: Cesium3DTileset;
  private _extent?: LngLatBoundsArray;

  async addLayer(opt: TileAdapterOptions) {
    this.options = { ...opt };
    const tileset = await this._addLayer();
    return tileset;
  }

  beforeRemove() {
    if (this.layer) {
      this.map.scene.primitives.remove(this.layer);
    }
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

    const boundingSphere = tileset.boundingSphere;
    const carto = Ellipsoid.WGS84.cartesianToCartographic(
      boundingSphere.center
    );
    const lon = CMath.toDegrees(carto.longitude);
    const lat = CMath.toDegrees(carto.latitude);
    this._extent = [lon, lat, lon, lat];
    this.layer = tileset;
    this.map.scene.primitives.add(this.layer);
    this.watchHeight();
    return this.layer;
  }

  private watchHeight() {
    if (this.layer) {
      const boundingSphere = this.layer.boundingSphere;
      const cartographic = Cartographic.fromCartesian(boundingSphere.center);
      const heightSurface = cartographic.height;
      const terrainSamplePositions = [cartographic];
      when(
        sampleTerrainMostDetailed(
          this.map.terrainProvider,
          terrainSamplePositions
        ),
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
