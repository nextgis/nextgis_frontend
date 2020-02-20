/**
 * @module cesium-map-adapter
 */
import {
  VectorLayerAdapter,
  GeoJsonAdapterOptions,
  DataLayerFilter,
  PropertiesFilter
} from '@nextgis/webmap';

import { GeoJsonDataSource } from 'cesium';
import { GeoJsonObject, Feature } from 'geojson';
import { BaseAdapter, Map } from './BaseAdapter';
const Cesium = require('cesium');

type Layer = any;

export class GeoJsonAdapter extends BaseAdapter<GeoJsonAdapterOptions>
  implements VectorLayerAdapter<Map> {
  selected = false;

  private _source?: GeoJsonDataSource;

  addLayer(options: GeoJsonAdapterOptions) {
    const source = new Cesium.GeoJsonDataSource(options.id);
    this._source = source;
    this.map.dataSources.add(source).then(x => {
      if (options.data) {
        this.addData(options.data);
      }
    });

    return source;
  }

  clearLayer(cb?: (feature: Feature) => boolean) {
    this._source?.entities.removeAll();
  }

  setData(data: GeoJsonObject) {
    this.clearLayer();
    this.addData(data);
  }

  addData(data: GeoJsonObject) {
    if (this._source) {
      this._source?.load(data);
    }
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
