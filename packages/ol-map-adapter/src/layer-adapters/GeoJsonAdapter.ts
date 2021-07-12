import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import { Paint } from '@nextgis/paint';
import { defined, LngLatBoundsArray } from '@nextgis/utils';
import { PropertiesFilter } from '@nextgis/properties-filter';

import { resolutionOptions } from '../utils/gerResolution';
import { styleFunction, labelStyleFunction, getFeature } from '../utils/utils';

import { transformExtent } from 'ol/proj';

import type { Feature, GeoJsonObject } from 'geojson';
import type MapBrowserPointerEvent from 'ol/MapBrowserEvent';
import type { Pixel } from 'ol/pixel';
import type Base from 'ol/layer/Base';
import type Map from 'ol/Map';
import type OlFeature from 'ol/Feature';
import type {
  DataLayerFilter,
  VectorLayerAdapter,
  GeoJsonAdapterOptions,
  LayerDefinition,
  OnLayerSelectType,
} from '@nextgis/webmap';
import type {
  ForEachFeatureAtPixelCallback,
  MouseEventType,
} from '../OlMapAdapter';
import { convertMapClickEvent } from '../utils/convertMapClickEvent';

type Layer = Base;
type Layers = LayerDefinition<Feature, Layer>;

export class GeoJsonAdapter
  implements VectorLayerAdapter<Map, Layer, GeoJsonAdapterOptions>
{
  layer?: VectorLayer;
  paint?: Paint;
  selectedPaint?: Paint;
  selected = false;

  private vectorSource = new VectorSource();
  private _features: OlFeature<any>[] = [];
  private _selectedFeatures: OlFeature<any>[] = [];
  private _filterFun?: DataLayerFilter<Feature>;
  private _mouseOver?: boolean;

  // TODO: get from OlMapAdapter
  private displayProjection = 'EPSG:3857';
  private lonlatProjection = 'EPSG:4326';

  private _forEachFeatureAtPixel: ForEachFeatureAtPixelCallback[] = [];

  constructor(public map: Map, public options: GeoJsonAdapterOptions) {}

  addLayer(options: GeoJsonAdapterOptions): VectorLayer {
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
        const style = [];
        const vectorStyle = styleFunction(f as OlFeature<any>, options.paint);
        if (vectorStyle) {
          style.push(vectorStyle);
        }
        const labelField = this.options.labelField;
        if (labelField) {
          const label = f.get(labelField);
          const text = defined(label) ? String(label) : '';
          if (text) {
            const labelStyle = labelStyleFunction(options.type || 'polygon', {
              // ratio: this.options.ratio,
            });
            labelStyle.getText().setText(text);
            style.push(labelStyle);
          }
        }
        return style;
      },
      ...resolutionOptions(this.map, options),
    });
    const interactive = defined(options.interactive)
      ? options.interactive
      : true;
    if (interactive) {
      this._addEventListener();
    }
    return this.layer;
  }

  beforeRemove(): void {
    const _forEachFeatureAtPixel = this.map.get(
      '_forEachFeatureAtPixel',
    ) as ForEachFeatureAtPixelCallback[];
    for (let i = _forEachFeatureAtPixel.length; i--; ) {
      const cb = _forEachFeatureAtPixel[i];
      const index = this._forEachFeatureAtPixel.indexOf(cb);
      console.log(index);
      if (index !== -1) {
        _forEachFeatureAtPixel.splice(i, 1);
      }
    }
    this._forEachFeatureAtPixel.length = 0;
  }

  clearLayer(cb?: (feature: Feature) => boolean): void {
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

  setData(data: GeoJsonObject): void {
    this.clearLayer();
    this.addData(data);
  }

  addData(data: GeoJsonObject): void {
    const features = new GeoJSON().readFeatures(data, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857',
    });
    this._features = this._features.concat(features);
    if (this._filterFun) {
      this.filter(this._filterFun);
    } else {
      this.vectorSource.addFeatures(features);
    }
  }

  select(findFeatureCb?: DataLayerFilter<Feature> | PropertiesFilter): void {
    if (typeof findFeatureCb === 'function') {
      const feature = this._features.filter((x) =>
        findFeatureCb({ feature: getFeature(x) }),
      );
      feature.forEach((x) => {
        this._selectFeature(x, 'api');
      });
    } else if (!this.selected) {
      this.selected = true;
      if (this.selectedPaint) {
        this.setPaintEachLayer(this.selectedPaint);
      }
    }
  }

  unselect(findFeatureCb?: DataLayerFilter<Feature> | PropertiesFilter): void {
    if (typeof findFeatureCb === 'function') {
      const feature = this._selectedFeatures.filter((x) =>
        findFeatureCb({ feature: getFeature(x) }),
      );
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

  getLayers(): Layers[] {
    return this._features.map((x) => {
      return { feature: getFeature(x) };
    });
  }

  getSelected(): Layers[] {
    return this._selectedFeatures.map((x) => {
      return { feature: getFeature(x) };
    });
  }

  filter(fun?: DataLayerFilter<Feature, Layer>): Layers[] {
    this._filterFun = fun;
    const features = this._features;
    const filtered = fun
      ? features.filter((feature) => {
          return fun({ feature: getFeature(feature) });
        })
      : features;
    this.vectorSource.clear();
    const length = filtered.length;
    for (let fry = 0; fry < length; fry++) {
      this.vectorSource.addFeature(filtered[fry]);
    }
    return filtered.map((x) => {
      return { feature: getFeature(x) };
    });
  }

  cleanFilter(): void {
    this.filter();
  }

  getExtent(): LngLatBoundsArray | undefined {
    if (this.layer) {
      const source = this.layer.getSource();
      const bounds = source.getExtent();
      const extent = transformExtent(
        bounds,
        this.displayProjection,
        this.lonlatProjection,
      );
      return extent as LngLatBoundsArray;
    }
  }

  private setPaintEachLayer(paint: Paint) {
    if (this.layer) {
      const source = this.layer.getSource();
      const features = source.getFeatures();
      features.forEach((f) => {
        const style = styleFunction(f, paint);
        if (style) {
          f.setStyle(style);
        }
      });
    }
  }

  private _addEventListener() {
    const _forEachFeatureAtPixel = this.map.get(
      '_forEachFeatureAtPixel',
    ) as ForEachFeatureAtPixelCallback[];
    const cb: ForEachFeatureAtPixelCallback = (pixel, evt, type) => {
      this._onFeatureAtPixel(pixel, evt, type);
    };
    this._forEachFeatureAtPixel.push(cb);
    _forEachFeatureAtPixel.push(cb);
  }

  private _onFeatureAtPixel(
    pixel: Pixel,
    evt: MapBrowserPointerEvent,
    type: MouseEventType,
  ) {
    const feature = this.map.getFeaturesAtPixel(pixel, {
      layerFilter: (l) => l === this.layer,
    })[0] as OlFeature<any>;
    const createMouseOptions = (e: MapBrowserPointerEvent) => {
      return {
        layer: this,
        feature: feature && getFeature(feature),
        event: convertMapClickEvent(e),
        source: e,
      };
    };
    if (feature) {
      let isSelected = this._selectedFeatures.indexOf(feature) !== -1;

      if (this.options.selectable) {
        if (
          (type === 'hover' && this.options.selectOnHover) ||
          type === 'click'
        ) {
          if (isSelected) {
            if (this.options && this.options.unselectOnSecondClick) {
              this._unselectFeature(feature);
              isSelected = false;
            }
          } else {
            this._selectFeature(feature, type);
            isSelected = true;
          }
        }
      }

      if (type === 'click') {
        if (this.options.onClick) {
          this.options.onClick({
            selected: isSelected,
            ...createMouseOptions(evt),
          });
        }
      }
      if (type === 'hover') {
        this._mouseOver = true;
        if (this.options.onMouseOver) {
          this.options.onMouseOver(createMouseOptions(evt));
        }
      }
    } else {
      if (type === 'hover' && this._mouseOver) {
        this._mouseOver = false;
        if (this.options.onMouseOut) {
          this.options.onMouseOut(createMouseOptions(evt));
        }
        if (this.options.selectOnHover) {
          this.unselect();
        }
      }
    }
  }

  private _selectFeature(feature: OlFeature<any>, type: OnLayerSelectType) {
    const options = this.options;
    if (options && !options.multiselect) {
      this._selectedFeatures.forEach((x) => this._unselectFeature(x));
    }
    this._selectedFeatures.push(feature);
    this.selected = true;
    if (options && options.selectedPaint) {
      const style = styleFunction(feature, options.selectedPaint);
      if (style) {
        feature.setStyle(style);
      }
    }
    if (this.options.onSelect) {
      this.options.onSelect({
        layer: this,
        features: [getFeature(feature)],
        type,
      });
    }
  }

  private _unselectFeature(feature: OlFeature<any>) {
    const index = this._selectedFeatures.indexOf(feature);
    if (index !== -1) {
      this._selectedFeatures.splice(index, 1);
    }
    this.selected = this._selectedFeatures.length > 0;
    if (this.options && this.options.paint) {
      const style = styleFunction(feature, this.options.paint);
      if (style) {
        feature.setStyle(style);
      }
    }
  }
}
