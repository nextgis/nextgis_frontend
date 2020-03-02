/**
 * @module cesium-map-adapter
 */
import {
  VectorLayerAdapter,
  DataLayerFilter,
  PropertiesFilter,
  TileAdapterOptions
} from '@nextgis/webmap';
import Cesium, { Viewer as TViewer } from 'cesium';

import { Feature, GeoJsonObject } from 'geojson';
// const Cesium = require('cesium');

type Layer = any;
type Map = TViewer;

export class Tile3dAdapter
  implements VectorLayerAdapter<Map, Layer, TileAdapterOptions> {
  selected = false;

  constructor(public map: Map, public options: TileAdapterOptions) {}

  addLayer(options: TileAdapterOptions) {
    const layer = this.map.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: options.url
      })
    );
    return layer;
  }

  clearLayer(cb?: (feature: Feature) => boolean) {
    //
  }

  setData(data: GeoJsonObject) {
    this.clearLayer();
    this.addData(data);
  }

  addData(data: GeoJsonObject) {
    //
  }

  select(findFeatureCb?: DataLayerFilter<Feature> | PropertiesFilter) {
    //
  }

  unselect(findFeatureCb?: DataLayerFilter<Feature> | PropertiesFilter) {
    //
  }

  getLayers() {
    return [];
  }

  getSelected() {
    return [];
  }

  filter(fun?: DataLayerFilter<Feature, Layer>) {
    return [];
  }

  cleanFilter() {
    //
  }
}
