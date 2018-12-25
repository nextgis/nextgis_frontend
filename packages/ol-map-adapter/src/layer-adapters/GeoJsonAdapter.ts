import {
  LayerAdapter,
  GeoJsonAdapterOptions,
  GeoJsonAdapterLayerPaint,
  GetPaintCallback,
  GeoJsonAdapterLayerType,
  OnLayerClickOptions
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
import { click } from 'ol/events/condition';
import Select from 'ol/interaction/Select';
import { Feature } from 'geojson';
import { olx } from 'openlayers';
import { ForEachFeatureAtPixelCallback } from '../OlMapAdapter';

let ID = 1;

export class GeoJsonAdapter implements LayerAdapter {

  name: string;
  map: Map;
  layer: VectorLayer;
  options: GeoJsonAdapterOptions;
  paint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  selectedPaint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  selected: boolean = false;

  private _selectedFeatures: ol.Feature[] = [];

  constructor(map: Map, options) {
    this.map = map;
    if (options.onLayerClick) {
      this.onLayerClick = options.onLayerClick;
    }
  }

  onLayerClick?(opt: OnLayerClickOptions): Promise<any>;

  addLayer(options?: GeoJsonAdapterOptions) {
    this.options = options;
    this.paint = options.paint;

    this.selectedPaint = options.selectedPaint;
    this.name = options.id || 'geojson-' + ID++;

    const features = (new GeoJSON()).readFeatures(options.data, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });

    const vectorSource = new VectorSource({
      features
    });

    this.layer = new VectorLayer({
      source: vectorSource,
      style: (f: ol.Feature) => styleFunction(f, options.paint)
    });

    if (options.selectable) {
      this._addSelectListener();
    }

    return this.layer;
  }

  select(findFeatureFun?: (opt: { feature: Feature }) => boolean) {
    if (findFeatureFun) {
      const feature = this._selectedFeatures.filter((x) => Object.create({feature: x}));
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
      const feature = this._selectedFeatures.filter((x) => Object.create({feature: x}));
      feature.forEach((x) => {
        this._unselectFeature(x);
      });
    } else if (this.selected) {
      this.selected = false;
      this.setPaintEachLayer(this.paint);
    }
  }

  getSelected() {
    return this._selectedFeatures.map((x) => {
      return { feature: getFeature(x)};
    });
  }

  private setPaintEachLayer(paint: GetPaintCallback | GeoJsonAdapterLayerPaint) {
    const source = this.layer.getSource();
    const features = source.getFeatures();
    features.forEach((f) => {
      f.setStyle(styleFunction(f, paint));
    });
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
      if (this.options.unselectOnSecondClick) {
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
    if (!this.options.multiselect) {
      this._selectedFeatures.forEach((x) => this._unselectFeature(x));
    }
    this._selectedFeatures.push(feature);
    this.selected = true;
    if (this.options.selectedPaint) {
      feature.setStyle(styleFunction(feature, this.options.selectedPaint));
    }
  }

  private _unselectFeature(feature: ol.Feature) {
    const index = this._selectedFeatures.indexOf(feature);
    if (index !== -1) {
      this._selectedFeatures.splice(index, 1);
    }
    this.selected = this._selectedFeatures.length > 0;
    feature.setStyle(styleFunction(feature, this.options.paint));
  }
}

function getFeature(feature: ol.Feature): Feature {
  const geojson = new GeoJSON();
  // @ts-ignore writeFeatureObject return JSON type, need Feature
  return geojson.writeFeatureObject(feature);
}

const getImage = (paint) => {
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

function styleFunction(feature: ol.Feature, paint: GeoJsonAdapterLayerPaint | GetPaintCallback) {
  if (typeof paint === 'function') {
    const f: Feature = getFeature(feature);
    return styleFunction(feature, paint(f));
  } else {
    const type = feature.getGeometry().getType();
    const style: { stroke?: Stroke, fill?: Fill, image?} = {};
    if ('opacity' in paint) {
      const color = asArray(paint.color);
      const colorArray = color.slice();
      colorArray[3] = paint.opacity;
      // @ts-ignore
      paint.color = colorArray;
    }
    if (!paint.type) {
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

      style.image = new Icon({
        src: 'data:image/svg+xml,' + escape(svg),
        anchor: paint.iconAnchor,
        imgSize: paint.iconSize,
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
      });
    }
    return new Style(style);
  }

}

// const styles = {
//   'Point': (paint) => {
//     return new Style({
//       image: getImage(paint)
//     });
//   },
//   'LineString': (paint) => new Style({
//     stroke: new Stroke(paint)
//   }),
//   'MultiLineString': (paint) => new Style({
//     stroke: new Stroke(paint)
//   }),
//   'MultiPoint': (paint) => {
//     return new Style({
//       image: getImage(paint)
//     });
//   },
//   'MultiPolygon': (paint) => new Style({
//     stroke: new Stroke(paint),
//     fill: new Fill(paint)
//   }),
//   'Polygon': (paint) => new Style({
//     stroke: new Stroke(paint),
//     fill: new Fill(paint)
//   }),
//   'GeometryCollection': (paint) => new Style({
//     stroke: new Stroke(paint),
//     fill: new Fill(paint),
//     image: getImage(paint)
//   }),
//   'Circle': (paint) => new Style({
//     stroke: new Stroke(paint),
//     fill: new Fill(paint)
//   }),
// };
