import {
  GeoJsonAdapterOptions,
  GeoJsonAdapterLayerPaint,
  GetPaintCallback,
  GeoJsonAdapterLayerType,
  OnLayerClickOptions,
  VectorLayerAdapter
} from '@nextgis/webmap';
import Map from 'ol/Map';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
// @ts-ignore
import { asArray } from 'ol/color';
// @ts-ignore
import { Feature } from 'geojson';
import { ForEachFeatureAtPixelCallback } from '../OlMapAdapter';

type Layer = ol.layer.Base;
type OlStyle = ol.style.Style | ol.style.Style[] | null;

export class GeoJsonAdapter implements VectorLayerAdapter<Map, Layer, GeoJsonAdapterOptions> {

  layer?: VectorLayer;
  paint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  selectedPaint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  selected: boolean = false;

  private _selectedFeatures: ol.Feature[] = [];

  constructor(public map: Map, public options: GeoJsonAdapterOptions) {}

  onLayerClick?(opt: OnLayerClickOptions): Promise<any>;

  addLayer(options: GeoJsonAdapterOptions) {
    this.options = options;
    this.paint = options.paint;

    this.selectedPaint = options.selectedPaint;

    const vectorSource = new VectorSource();
    const data = options.data;
    if (data) {
      const features = (new GeoJSON()).readFeatures(data, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });
      vectorSource.addFeatures(features);
    }

    this.layer = new VectorLayer({
      source: vectorSource,
      style: (f) => {
        if (options.paint) {
          return styleFunction(f as ol.Feature, options.paint);
        }
        return null;
      }
    });

    if (options.selectable) {
      this._addSelectListener();
    }

    return this.layer;
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

  getSelected() {
    return this._selectedFeatures.map((x) => {
      return { feature: getFeature(x) };
    });
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

    if (this.onLayerClick) {
      this.onLayerClick({
        adapter: this,
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

const getImage = (paint: any) => {
  return new CircleStyle({ radius: 6, ...paint, stroke: new Stroke(paint), fill: new Fill(paint), });
};

const typeAlias: { [x: string]: GeoJsonAdapterLayerType } = {
  'Point': 'circle',
  'MultiPoint': 'circle',
  'LineString': 'line',
  'MultiLineString': 'line',
  'Polygon': 'fill',
  'MultiPolygon': 'fill',
  'Circle': 'circle'
};

function styleFunction(feature: ol.Feature, paint: GeoJsonAdapterLayerPaint | GetPaintCallback): OlStyle {
  if (typeof paint === 'function') {
    const f: Feature = getFeature(feature);
    return styleFunction(feature, paint(f));
  } else {
    const type = feature.getGeometry().getType();
    const style: { stroke?: Stroke, fill?: Fill, image?: any} = {};
    if ('opacity' in paint) {
      const color = asArray(paint.color);
      const colorArray = color.slice();
      colorArray[3] = paint.opacity;
      // @ts-ignore
      paint.color = colorArray;
    }
    const _type = paint.type;
    if (!_type) {
      const ta = typeAlias[type];
      paint.type = (ta === 'fill' || ta === 'line') ? 'path' :
        ('html' in paint || 'className' in paint) ? 'icon' : ta;
    }
    if (paint.type === 'path') {
      style.fill = new Fill(paint);
      if (paint.stroke || ['MultiLineString', 'LineString'].indexOf(type) !== -1) {
        style.stroke = new Stroke({
          width: paint.weight,
          color: paint.color,
        });
      }
    } else if (paint.type === 'circle') {
      style.image = getImage(paint);
    } else if (paint.type === 'icon') {

      const svg = paint.html;
      if (svg) {
        style.image = new Icon({
          src: 'data:image/svg+xml,' + escape(svg),
          anchor: paint.iconAnchor,
          imgSize: paint.iconSize,
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
        });
      }
    }
    return new Style(style);
  }
}
