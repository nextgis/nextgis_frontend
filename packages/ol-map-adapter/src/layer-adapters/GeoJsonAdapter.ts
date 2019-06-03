import {
  GeoJsonAdapterOptions,
  GeoJsonAdapterLayerPaint,
  GetPaintCallback,
  GeoJsonAdapterLayerType,
  VectorLayerAdapter,
  DataLayerFilter,
  GeometryPaint
} from '@nextgis/webmap';
import Map from 'ol/Map';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Icon, { Options as IconOptions} from 'ol/style/Icon';
import IconAnchorUnits from 'ol/style/IconAnchorUnits';

import { asArray, Color } from 'ol/color';
import { Feature, GeoJsonObject } from 'geojson';
import { ForEachFeatureAtPixelCallback } from '../OlMapAdapter';

import * as ol from 'ol';
import Base from 'ol/layer/Base';

type Layer = Base;

type OlStyle = Style | Style[];

const typeAlias: { [x: string]: GeoJsonAdapterLayerType } = {
  'Point': 'circle',
  'MultiPoint': 'circle',
  'LineString': 'line',
  'MultiLineString': 'line',
  'Polygon': 'fill',
  'MultiPolygon': 'fill',
  'Circle': 'circle'
};

export class GeoJsonAdapter implements VectorLayerAdapter<Map, Layer, GeoJsonAdapterOptions> {

  layer?: VectorLayer;
  paint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  selectedPaint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  selected: boolean = false;

  private vectorSource = new VectorSource();
  private _features: ol.Feature[] = [];
  private _selectedFeatures: ol.Feature[] = [];
  private _filterFun?: DataLayerFilter<Feature>;

  constructor(public map: Map, public options: GeoJsonAdapterOptions) { }

  addLayer(options: GeoJsonAdapterOptions) {
    this.options = options;
    this.paint = options.paint;

    this.selectedPaint = options.selectedPaint;

    const data = options.data;
    if (data) {
      this.addData(data);
    }

    this.layer = new VectorLayer({
      source: this.vectorSource,
      style: (f) => {
        const style =  styleFunction(f as ol.Feature, options.paint);
        return style;
      }
    });

    if (options.selectable) {
      this._addSelectListener();
    }

    return this.layer;
  }

  clearLayer(cb?: (feature: Feature) => boolean) {
    if (cb) {
      const features = this.vectorSource.getFeatures().values();
      let entry;
      while (!(entry = features.next()).done) {
        const feature = getFeature(entry.value);
        if (cb(feature)) {
          this.vectorSource.removeFeature(entry.value);
        }
      }
    } else {
      this.vectorSource.clear();
    }
  }

  setData(data: GeoJsonObject) {
    this.clearLayer();
    this.addData(data);
  }

  addData(data: GeoJsonObject) {
    const features = (new GeoJSON()).readFeatures(data, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
    this._features = this._features.concat(features);
    if (this._filterFun) {
      this.filter(this._filterFun);
    } else {
      this.vectorSource.addFeatures(features);
    }
  }

  select(findFeatureFun?: (opt: { feature: Feature }) => boolean) {
    if (findFeatureFun) {
      const feature = this._selectedFeatures.filter((x) => Object.create({ feature: x }));
      feature.forEach((x) => {
        this._selectFeature(x);
      });
    } else if (!this.selected) {
      this.selected = true;
      if (this.selectedPaint) {
        this.setPaintEachLayer(this.selectedPaint);
      }
    }
  }

  unselect(findFeatureFun?: (opt: { feature: Feature }) => boolean) {
    if (findFeatureFun) {
      const feature = this._selectedFeatures.filter((x) => Object.create({ feature: x }));
      feature.forEach((x) => {
        this._unselectFeature(x);
      });
    } else if (this.selected) {
      this.selected = false;
      if (this.paint) {
        this.setPaintEachLayer(this.paint);
      }
    }
  }

  getLayers() {
    return this._features.map((x) => {
      return { feature: getFeature(x) };
    });
  }

  getSelected() {
    return this._selectedFeatures.map((x) => {
      return { feature: getFeature(x) };
    });
  }

  filter(fun?: DataLayerFilter<Feature, Layer>) {
    this._filterFun = fun;
    const features = this._features;
    const filtered = fun ? features.filter((feature) => {
      return fun({ feature: getFeature(feature) });
    }) : features;
    this.vectorSource.clear();
    const length = filtered.length;
    for (let fry = 0; fry < length; fry++) {
      this.vectorSource.addFeature(filtered[fry]);
    }
  }

  cleanFilter() {
    this.filter();
  }

  private setPaintEachLayer(paint: GetPaintCallback | GeoJsonAdapterLayerPaint) {
    if (this.layer) {
      const source = this.layer.getSource();
      const features = source.getFeatures();
      features.forEach((f) => {
        f.setStyle(styleFunction(f, paint));
      });
    }
  }

  private _addSelectListener() {

    const _forEachFeatureAtPixel = this.map.get('_forEachFeatureAtPixel') as ForEachFeatureAtPixelCallback[];
    _forEachFeatureAtPixel.push((feature, layer, evt) => {
      if (layer === this.layer) {
        this._onFeatureClick(feature);
      }
    });
  }

  private _onFeatureClick(feature: ol.Feature) {

    let isSelected = this._selectedFeatures.indexOf(feature) !== -1;
    if (isSelected) {
      if (this.options && this.options.unselectOnSecondClick) {
        this._unselectFeature(feature);
        isSelected = false;
      }
    } else {
      this._selectFeature(feature);
      isSelected = true;
    }

    if (this.options.onLayerClick) {
      this.options.onLayerClick({
        layer: this,
        feature: getFeature(feature),
        selected: isSelected
      });
    }
  }

  private _selectFeature(feature: ol.Feature) {
    const options = this.options;
    if (options && !options.multiselect) {
      this._selectedFeatures.forEach((x) => this._unselectFeature(x));
    }
    this._selectedFeatures.push(feature);
    this.selected = true;
    if (options && options.selectedPaint) {
      feature.setStyle(styleFunction(feature, options.selectedPaint));
    }
  }

  private _unselectFeature(feature: ol.Feature) {
    const index = this._selectedFeatures.indexOf(feature);
    if (index !== -1) {
      this._selectedFeatures.splice(index, 1);
    }
    this.selected = this._selectedFeatures.length > 0;
    if (this.options && this.options.paint) {
      feature.setStyle(styleFunction(feature, this.options.paint));
    }
  }
}

function getFeature(feature: ol.Feature): Feature {
  const geojson = new GeoJSON();
  // @ts-ignore writeFeatureObject return JSON type, need Feature
  return geojson.writeFeatureObject(feature);
}

function styleFunction(feature: ol.Feature, paint: GeoJsonAdapterLayerPaint | GetPaintCallback = {}): OlStyle {
  if (typeof paint === 'function') {
    const f: Feature = getFeature(feature);
    return styleFunction(feature, paint(f));
  } else {

    const type = feature.getGeometry().getType();
    const style: { stroke?: Stroke, fill?: Fill, image?: any } = {};
    const _type = paint.type;
    if (!_type) {
      const ta = typeAlias[type];
      paint.type = (ta === 'fill' || ta === 'line') ? 'path' :
        ('html' in paint || 'className' in paint) ? 'icon' : ta;
    }
    if (paint.type === 'path' || paint.type === 'circle') {
      const geomPaint = { ...paint } as GeometryPaint;
      if (geomPaint.fill) {
        style.fill = new Fill({
          color: getColor(geomPaint.fillColor!, geomPaint.fillOpacity)
        });
      }
      if (geomPaint.stroke || ['MultiLineString', 'LineString'].indexOf(type) !== -1) {
        style.stroke = new Stroke({
          width: geomPaint.weight,
          color: getColor(geomPaint.strokeColor!, geomPaint.strokeOpacity)
        });
      }

      if (paint.type === 'circle') {
        style.image = new CircleStyle({ radius: geomPaint.radius!, ...style });
      }
    } else if (paint.type === 'icon') {

      const svg = paint.html;
      if (svg) {
        const iconOptions: IconOptions = {
          src: 'data:image/svg+xml,' + escape(svg),
          anchorXUnits: IconAnchorUnits.PIXELS,
          anchorYUnits: IconAnchorUnits.PIXELS,
          anchor: paint.iconAnchor,
          imgSize: paint.iconSize
        };
        style.image = new Icon(iconOptions);
      }
    }
    return new Style(style);
  }
}

function getColor(colorStr: string, opacity?: number): Color {
  const color = asArray(colorStr);
  const colorArray = color.slice() as [number, number, number, number];
  colorArray[3] = opacity !== undefined ? opacity : 1;
  return colorArray;
}
