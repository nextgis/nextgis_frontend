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
  isPaint,
  GeometryPaint,
  PinPaint
} from '@nextgis/paint';

import {
  GeoJsonDataSource,
  Color,
  PinBuilder,
  Cartesian3,
  VerticalOrigin,
  Property
} from 'cesium';
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

  private readonly _pinBuilder = new PinBuilder();

  private _features: Feature[] = [];
  private _source?: GeoJsonDataSource;

  addLayer(options: GeoJsonAdapterOptions) {
    this.options = { ...options };
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
        const paint = this._getFeaturePaint(x, this.options.paint);
        if (isBasePaint(paint)) {
          if (paint.type === 'pin') {
            this._addPin(x, paint);
          } else {
            this._addFromGeoJson(x, paint);
          }
        }
      });
    }
  }

  private async _addPin(obj: Feature, paint: PinPaint) {
    const source = this._source;
    if (source) {
      const colorStr = paint.fillColor || paint.color;
      const color = Color.fromCssColorString(
        typeof colorStr === 'string' ? colorStr : 'blue'
      );
      const size = typeof paint.size === 'number' ? paint.size : 42;
      const iconFont = paint.iconfont || 'maki';
      let pin: HTMLCanvasElement | Promise<HTMLCanvasElement> | undefined;
      if (typeof paint.icon === 'string' && iconFont === 'maki') {
        try {
          const icon = paint.icon.replace(/-11|-15$/, '');
          pin = await this._pinBuilder.fromMakiIconId(icon, color, size);
        } catch {
          // ignore
        }
      }
      if (!pin) {
        pin =
          typeof paint.symbol === 'string'
            ? this._pinBuilder.fromText(paint.symbol, color, size)
            : this._pinBuilder.fromColor(color, size);
      }
      if (pin && obj.type === 'Feature' && obj.geometry.type === 'Point') {
        const lonLat = obj.geometry.coordinates;
        const canvas = await pin;

        const nameField = this.options.labelField || 'name';
        let name = '';
        if (obj.properties && nameField in obj.properties) {
          name = obj.properties && obj.properties[nameField];
        }

        //@ts-ignore
        const description: Property = {
          getValue: () => {
            if (this.options.popupOptions?.createPopupContent) {
              const content = this.options.popupOptions.createPopupContent({ feature: obj });
              if (content instanceof HTMLElement) {
                return content.outerHTML;
              }
              return content;
            }
            return '';
          }
        }

        source.entities.add({
          position: Cartesian3.fromDegrees(lonLat[0], lonLat[1]),
          name: name || (obj.id !== undefined ? 'Feature#' + obj.id : ''),
          description,
          billboard: {
            // @ts-ignore
            image: canvas.toDataURL(),
            // @ts-ignore
            verticalOrigin: VerticalOrigin.BOTTOM
          }
        });
      }
    }
  }

  private _addFromGeoJson(obj: Feature, paint: GeometryPaint) {
    const source = this._source;
    if (source) {
      const options: GeoJsonDataSourceLoadOptions = {};
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

      const dataSource = new GeoJsonDataSource();
      dataSource.load(obj, options).then(x => {
        dataSource.entities.values.forEach(y => {
          source.entities.add(y);
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
