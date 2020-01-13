import {
  GeoJsonAdapterOptions,
  VectorAdapterLayerPaint,
  GetPaintCallback,
  VectorLayerAdapter,
  DataLayerFilter,
  PropertiesFilter
} from '@nextgis/webmap';
import Map from 'ol/Map';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import { Feature, GeoJsonObject } from 'geojson';
import { ForEachFeatureAtPixelCallback } from '../OlMapAdapter';

import * as ol from 'ol';
import Base from 'ol/layer/Base';
import { styleFunction, labelStyleFunction, getFeature } from '../utils/utils';
import { getResolution } from '../utils/gerResolution';

type Layer = Base;

export class GeoJsonAdapter
  implements VectorLayerAdapter<Map, Layer, GeoJsonAdapterOptions> {
  layer?: VectorLayer;
  paint?: VectorAdapterLayerPaint | GetPaintCallback;
  selectedPaint?: VectorAdapterLayerPaint | GetPaintCallback;
  selected = false;

  private vectorSource = new VectorSource();
  private _features: ol.Feature[] = [];
  private _selectedFeatures: ol.Feature[] = [];
  private _filterFun?: DataLayerFilter<Feature>;

  constructor(public map: Map, public options: GeoJsonAdapterOptions) {}

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
      style: f => {
        const vectorStyle = styleFunction(f as ol.Feature, options.paint);
        const style = [vectorStyle];
        const labelField = this.options.labelField;
        if (labelField) {
          const text = String(f.get(labelField));
          if (text) {
            const labelStyle = labelStyleFunction(options.type || 'fill');
            labelStyle.getText().setText(text);
            style.push(labelStyle);
          }
        }
        return style;
      },
      minResolution:
        (this.options.maxScale &&
          getResolution(this.map, this.options.maxScale)) ||
        undefined,
      maxResolution:
        (this.options.minScale &&
          getResolution(this.map, this.options.minScale)) ||
        undefined
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
    const features = new GeoJSON().readFeatures(data, {
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

  select(findFeatureCb?: DataLayerFilter<Feature> | PropertiesFilter) {
    if (findFeatureCb) {
      const feature = this._selectedFeatures.filter(x =>
        Object.create({ feature: x })
      );
      feature.forEach(x => {
        this._selectFeature(x);
      });
    } else if (!this.selected) {
      this.selected = true;
      if (this.selectedPaint) {
        this.setPaintEachLayer(this.selectedPaint);
      }
    }
  }

  unselect(findFeatureCb?: DataLayerFilter<Feature> | PropertiesFilter) {
    if (findFeatureCb) {
      const feature = this._selectedFeatures.filter(x =>
        Object.create({ feature: x })
      );
      feature.forEach(x => {
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
    return this._features.map(x => {
      return { feature: getFeature(x) };
    });
  }

  getSelected() {
    return this._selectedFeatures.map(x => {
      return { feature: getFeature(x) };
    });
  }

  filter(fun?: DataLayerFilter<Feature, Layer>) {
    this._filterFun = fun;
    const features = this._features;
    const filtered = fun
      ? features.filter(feature => {
          return fun({ feature: getFeature(feature) });
        })
      : features;
    this.vectorSource.clear();
    const length = filtered.length;
    for (let fry = 0; fry < length; fry++) {
      this.vectorSource.addFeature(filtered[fry]);
    }
    return filtered.map(x => {
      return { feature: getFeature(x) };
    });
  }

  cleanFilter() {
    this.filter();
  }

  private setPaintEachLayer(paint: GetPaintCallback | VectorAdapterLayerPaint) {
    if (this.layer) {
      const source = this.layer.getSource();
      const features = source.getFeatures();
      features.forEach(f => {
        f.setStyle(styleFunction(f, paint));
      });
    }
  }

  private _addSelectListener() {
    const _forEachFeatureAtPixel = this.map.get(
      '_forEachFeatureAtPixel'
    ) as ForEachFeatureAtPixelCallback[];
    _forEachFeatureAtPixel.push((feature, layer) => {
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
      this._selectedFeatures.forEach(x => this._unselectFeature(x));
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
