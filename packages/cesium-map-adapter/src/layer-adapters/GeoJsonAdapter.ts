/**
 * @module cesium-map-adapter
 */
import {
  VectorLayerAdapter,
  GeoJsonAdapterOptions,
  DataLayerFilter,
  PropertiesFilter
} from '@nextgis/webmap';
import {
  VectorAdapterLayerPaint,
  isPaintCallback,
  Paint,
  isBasePaint,
  isPaint
} from '@nextgis/paint';

import { GeoJsonDataSource, Color } from 'cesium';
import { GeoJsonObject, Feature, FeatureCollection } from 'geojson';
import { BaseAdapter, Map } from './BaseAdapter';

type Layer = GeoJsonDataSource;

interface GeoJsonDataSourceLoadOptions {
  sourceUri?: string;
  markerSize?: number;
  markerSymbol?: string;
  markerColor?: Color;
  stroke?: Color;
  strokeWidth?: number;
  fill?: Color;
  clampToGround?: boolean;
}

export class GeoJsonAdapter extends BaseAdapter<GeoJsonAdapterOptions>
  implements VectorLayerAdapter<Map> {
  selected = false;

  private _features: Feature[] = [];
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
      this._features = [];
    }
  }

  setData(data: GeoJsonObject) {
    this.clearLayer();
    this.addData(data);
  }

  addData(data: GeoJsonObject) {
    if (this._source) {
      if (data.type === 'Feature') {
        this._features.push(data as Feature);
      } else if (data.type === 'FeatureCollection') {
        const featureCollection = data as FeatureCollection;
        featureCollection.features.forEach(x => this._features.push(x));
      }
      this._updateSource();
      // this._source.load(data);
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

  private _updateSource() {
    const source = this._source;
    if (source) {
      source.entities.removeAll();
      this._features.forEach(x => {
        const options: GeoJsonDataSourceLoadOptions = {};
        const paint = this._getFeaturePaint(x, this.options.paint);
        if (isBasePaint(paint)) {
          const color = paint.color || 'blue';
          const fillColor = paint.fillColor || color;

          const fill = paint.fill ?? true;
          if (fill && color && typeof fillColor === 'string') {
            options.fill = Color.fromCssColorString(fillColor);
            options.markerColor = Color.fromCssColorString(fillColor);
          }
          if (options.stroke) {
            const strokeColor = paint.strokeColor || color;
            if (typeof strokeColor === 'string') {
              options.stroke = Color.fromCssColorString(strokeColor);
            }
            if (typeof paint.weight === 'number') {
              options.strokeWidth = paint.weight;
            }
          }
          if (typeof paint.radius === 'number') {
            // magic 4
            options.markerSize = paint.radius * 4;
          }
        }

        const dataSource = new GeoJsonDataSource();
        dataSource.load(x, options).then(x => {
          dataSource.entities.values.forEach(y => {
            source.entities.add(y);
          });
        });
      });
    }
  }

  private _getFeaturePaint(
    feature: Feature,
    paint?: Paint
  ): VectorAdapterLayerPaint {
    if (paint) {
      if (isPaintCallback(paint)) {
        return this._getFeaturePaint(feature, paint(feature));
      } else if (isPaint(paint)) {
        return paint;
      }
    }
    return {};
  }
}
