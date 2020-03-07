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

type Layer = GeoJsonDataSource;

export class GeoJsonAdapter extends BaseAdapter<GeoJsonAdapterOptions>
  implements VectorLayerAdapter<Map> {
  selected = false;

  private _source?: GeoJsonDataSource;

  addLayer(options: GeoJsonAdapterOptions) {
    const source = new GeoJsonDataSource(options.id);
    this._source = source;
    if (options.data) {
      this.addData(options.data);
    }
    return source;
  }

  showLayer() {
    if (this._source) {
      this.map.dataSources.add(this._source);
    }
  }

  hideLayer() {
    if (this._source) {
      this.map.dataSources.remove(this._source);
    }
  }

  clearLayer(cb?: (feature: Feature) => boolean) {
    if (this._source) {
      this._source.entities.removeAll();
    }
  }

  setData(data: GeoJsonObject) {
    this.clearLayer();
    this.addData(data);
  }

  addData(data: GeoJsonObject) {
    if (this._source) {
      this._source.load(data);
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
