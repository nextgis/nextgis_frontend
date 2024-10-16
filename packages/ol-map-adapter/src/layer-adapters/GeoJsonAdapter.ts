import { create } from '@nextgis/dom';
import { defined } from '@nextgis/utils';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay';
import { transform, transformExtent } from 'ol/proj';
import VectorSource from 'ol/source/Vector';

import { convertMapClickEvent } from '../utils/convertMapClickEvent';
import { createFeaturePositionOptions } from '../utils/createFeaturePositionOptions';
import { resolutionOptions } from '../utils/gerResolution';
import { getCentroid } from '../utils/getCentroid';
import { makeHtmlFromString } from '../utils/makeHtmlFromString';
import { labelStyleFunction, styleFunction } from '../utils/styleFunction';
import { getFeature } from '../utils/utils';

import { BaseAdapter } from './BaseAdapter';

import type { Paint } from '@nextgis/paint';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type { LngLatArray, LngLatBoundsArray } from '@nextgis/utils';
import type {
  DataLayerFilter,
  GeoJsonAdapterOptions,
  LayerDefinition,
  OnLayerSelectType,
  PopupOnCloseFunction,
  PopupOptions,
  VectorAdapterLayerType,
  VectorLayerAdapter,
} from '@nextgis/webmap';
import type { Feature, GeoJsonObject } from 'geojson';
import type OlFeature from 'ol/Feature';
import type { FeatureLike } from 'ol/Feature';
import type Base from 'ol/layer/Base';
import type Map from 'ol/Map';
import type MapBrowserEvent from 'ol/MapBrowserEvent';
import type { Options as OverlayOptions } from 'ol/Overlay';
import type { Pixel } from 'ol/pixel';
import type { Style } from 'ol/style';

import type {
  ForEachFeatureAtPixelCallback,
  ForEachFeatureAtPixelOrderedCallback,
  MapClickEvent,
  MouseEventType,
  UnselectCb,
} from '../OlMapAdapter';

import './Popup.css';

type MapBrowserPointerEvent = MapBrowserEvent<any>;
type Layer = Base;
type Layers = LayerDefinition<Feature, Layer>;
type OpenedPopup = [OlFeature<any>, Overlay, PopupOnCloseFunction[]];

type VectorLayerType = VectorLayer<VectorSource>;

export class GeoJsonAdapter
  extends BaseAdapter<VectorLayerType>
  implements VectorLayerAdapter<Map, Layer, GeoJsonAdapterOptions>
{
  layer?: VectorLayerType;
  paint?: Paint;
  selectedPaint?: Paint;
  selected = false;

  private displayProjection = 'EPSG:3857';
  private lonlatProjection = 'EPSG:4326';
  private vectorSource = new VectorSource();
  private _features: OlFeature<any>[] = [];
  private _selectedFeatures: OlFeature<any>[] = [];
  private _filterFun?: DataLayerFilter<Feature>;
  private _mouseOver?: boolean;
  private _openedPopup: OpenedPopup[] = [];
  private _forEachFeatureAtPixel: ForEachFeatureAtPixelOrderedCallback[] = [];
  private _mapClickEvents: MapClickEvent[] = [];
  private _styleCache: Record<string | number, Style[]> = {};
  private _labelVisibility = true;

  constructor(
    public map: Map,
    public options: GeoJsonAdapterOptions,
  ) {
    super(map, options);
    this._labelVisibility = options.labelVisibility ?? this._labelVisibility;
    this.displayProjection = map.getView().getProjection().getCode();
  }

  private get addUnselectCb() {
    return this.map.get('_addUnselectCb') as (args: UnselectCb) => void;
  }
  private get mapClickEvents() {
    return this.map.get('_mapClickEvents') as MapClickEvent[];
  }
  private get forEachFeatureAtPixel() {
    return this.map.get(
      '_forEachFeatureAtPixel',
    ) as ForEachFeatureAtPixelOrderedCallback[];
  }

  addLayer(options: GeoJsonAdapterOptions): VectorLayerType {
    Object.assign(this.options, options);
    this.paint = options.paint;

    this.selectedPaint = options.selectedPaint;

    const data = options.data;
    if (data) {
      this.addData(data);
    }
    this.layer = new VectorLayer({
      source: this.vectorSource,
      style: (f) => this._getFeatureStyle(f, options.paint || {}, options.type),
      ...resolutionOptions(this.map, options),
      ...options.nativeOptions,
    });
    const interactive = options.interactive ?? true;
    if (interactive) {
      this._addEventListener();
    }
    return this.layer;
  }

  beforeRemove(): void {
    const glob = this.forEachFeatureAtPixel;
    for (let i = glob.length; i--; ) {
      const cb = glob[i][1];
      const index = glob.findIndex((x) => x[1] === cb);
      if (index !== -1) {
        glob.splice(i, 1);
      }
    }
    this._forEachFeatureAtPixel.length = 0;

    const globSelect = this.mapClickEvents;
    for (let i = globSelect.length; i--; ) {
      const cb = globSelect[i];
      const index = globSelect.indexOf(cb);
      if (index !== -1) {
        globSelect.splice(i, 1);
      }
    }
    this._mapClickEvents.length = 0;
    this._removeAllPopup();
  }

  clearLayer(cb?: (feature: Feature) => boolean): void {
    this.unselect();
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
    const srs = this.options.srs;
    const dataProjection = 'EPSG:' + (srs ?? '4326');

    const features = new GeoJSON().readFeatures(data, {
      dataProjection,
      featureProjection: this.displayProjection,
    });
    this._features = this._features.concat(features);
    if (this._filterFun) {
      this.filter(this._filterFun);
    } else {
      this.vectorSource.addFeatures(features);
      if (this.options.popup) {
        for (const feature of this._features) {
          this._openPopup({
            feature,
            type: 'api',
            options: this.options.popupOptions,
          });
        }
      }
    }
  }

  select(findFeatureCb?: DataLayerFilter<Feature> | PropertiesFilter): void {
    this.unselect();
    if (typeof findFeatureCb === 'function') {
      const feature = this._features.filter((x) =>
        findFeatureCb(this._createLayerDefOpts(getFeature(x))),
      );
      for (const x of feature) {
        this._selectFeature(x);
      }
    } else if (!this.selected) {
      this.selected = true;
      if (this.selectedPaint) {
        this._setPaintEachLayer(this.selectedPaint);
      }
    }
  }

  unselect(findFeatureCb?: DataLayerFilter<Feature> | PropertiesFilter): void {
    let features = this._selectedFeatures;
    if (typeof findFeatureCb === 'function') {
      features = this._selectedFeatures.filter((x) =>
        findFeatureCb(this._createLayerDefOpts(getFeature(x))),
      );
    } else if (this.selected) {
      this.selected = false;
    }
    for (const f of features) {
      this._unselectFeature(f);
    }
    this._removeAllPopup();
  }

  getLayers(): Layers[] {
    return this._features.map((x) => {
      return this._createLayerDefOpts(getFeature(x));
    });
  }

  getSelected(): Layers[] {
    return this._selectedFeatures.map((x) => {
      return this._createLayerDefOpts(getFeature(x));
    });
  }

  filter(fun?: DataLayerFilter<Feature, Layer>): Layers[] {
    this._filterFun = fun;
    const features = this._features;
    const filtered = fun
      ? features.filter((feature) => {
          return fun(this._createLayerDefOpts(getFeature(feature)));
        })
      : features;
    this.vectorSource.clear();
    const length = filtered.length;
    for (let fry = 0; fry < length; fry++) {
      this.vectorSource.addFeature(filtered[fry]);
    }
    return filtered.map((x) => {
      return this._createLayerDefOpts(getFeature(x));
    });
  }

  cleanFilter(): void {
    this.filter();
  }

  /** @deprecated use {@link GeoJsonAdapter.getBounds} instead */
  getExtent(): LngLatBoundsArray | undefined {
    return this.getBounds();
  }

  getBounds(): LngLatBoundsArray | undefined {
    if (this.layer) {
      const source = this.layer.getSource();
      if (source) {
        const bounds = source.getExtent();
        const extent = transformExtent(
          bounds,
          this.displayProjection,
          this.lonlatProjection,
        );
        return extent as LngLatBoundsArray;
      }
    }
  }

  setPaint(paint?: Paint | null): void {
    if (paint) {
      this.paint = paint;
      this._setPaintEachLayer(this.paint);
    }
  }
  setSelectedPaint(paint?: Paint | null): void {
    if (paint) {
      this.selectedPaint = paint;
      this._setPaintEachLayer(this.selectedPaint);
    }
  }
  updatePaint(paint: Partial<Paint>): void {
    this.paint = { ...this.paint, ...paint } as Paint;
    this._setPaintEachLayer(this.paint);
  }
  updateSelectedPaint(paint: Partial<Paint>): void {
    this.selectedPaint = { ...this.selectedPaint, ...paint } as Paint;
    this._setPaintEachLayer(this.selectedPaint);
  }

  isLabelVisible(): boolean {
    return this._labelVisibility;
  }

  hideLabel() {
    this._toggleLabel(false);
  }
  showLabel() {
    this._toggleLabel(true);
  }

  private _toggleLabel(status: boolean) {
    this._labelVisibility = status;
    this.updatePaint({});
  }

  private _createLayerDefOpts(feature: Feature): LayerDefinition {
    return {
      target: this,
      feature,
      ...createFeaturePositionOptions({
        feature,
        dataProjection: this.lonlatProjection,
        featureProjection: this.displayProjection,
      }),
    };
  }

  private _getFeatureStyle(
    f: FeatureLike,
    paint: Paint,
    type: VectorAdapterLayerType = 'polygon',
  ) {
    const style = [];
    const id = f.getId();
    const fromCache = id !== undefined && this._styleCache[id];
    if (fromCache) {
      return fromCache;
    }
    const vectorStyle = styleFunction(f as OlFeature<any>, paint);
    if (vectorStyle) {
      style.push(vectorStyle);
    }
    if (this._labelVisibility) {
      const { labelField, label } = this.options;
      let labelStr = '';
      if (typeof labelField === 'string') {
        labelStr = f.get(labelField);
      } else if (label) {
        labelStr = label(this._createLayerDefOpts(getFeature(f)));
      }
      labelStr = String(labelStr);
      if (labelStr) {
        const text = defined(labelStr) ? labelStr : '';
        if (text) {
          const labelStyle = labelStyleFunction(type, {
            // ratio: this.options.ratio,
          });
          labelStyle.getText()?.setText(text);
          style.push(labelStyle);
        }
      }
    }
    if (id !== undefined) {
      this._styleCache[id] = style;
    }
    return style;
  }

  private _setPaintEachLayer(paint: Paint): void {
    this._styleCache = {};
    if (this.layer) {
      const source = this.layer.getSource();
      if (source && source.getFeatures) {
        const features = source.getFeatures();
        for (const f of features) {
          const style = this._getFeatureStyle(f, paint, this.options.type);
          if (style) {
            f.setStyle(style);
          }
        }
      }
    }
  }

  private _addEventListener() {
    const glob = this.forEachFeatureAtPixel;
    const cb: ForEachFeatureAtPixelCallback = (pixel, evt, type) =>
      this._onFeatureAtPixel(pixel, evt, type);
    const orderedCb: ForEachFeatureAtPixelOrderedCallback = [
      this.options.order || 0,
      cb,
    ];
    this._forEachFeatureAtPixel.push(orderedCb);
    glob.push(orderedCb);

    const unselectOnClick = this.options.unselectOnClick ?? true;
    if (unselectOnClick) {
      this._mapClickEvents.push(() => this.unselect());
      this.mapClickEvents.push(() => this.unselect());
    }
  }

  private _onFeatureAtPixel(
    pixel: Pixel,
    evt: MapBrowserPointerEvent,
    type: MouseEventType,
  ): boolean {
    const feature =
      pixel &&
      (this.map.getFeaturesAtPixel(pixel, {
        layerFilter: (l) => l === this.layer,
      })[0] as OlFeature<any>);
    const createMouseOptions = (e: MapBrowserPointerEvent) => {
      return {
        layer: this,
        event: convertMapClickEvent(e),
        source: e,
      };
    };
    const mouseOptions = createMouseOptions(evt);
    if (feature) {
      const featureMouseOptions = {
        ...mouseOptions,
        ...this._createLayerDefOpts(getFeature(feature)),
      };
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
            this._selectFeature(feature, featureMouseOptions.event.lngLat);
            isSelected = true;
          }
        }
      }

      if (type === 'click') {
        if (this.options.onClick) {
          this.options.onClick({
            selected: isSelected,
            ...featureMouseOptions,
          });
        }
      }
      if (type === 'dblclick') {
        if (this.options.onDoubleClick) {
          this.options.onDoubleClick({
            selected: isSelected,
            ...featureMouseOptions,
          });
        }
      }
      if (type === 'hover') {
        this._mouseOver = true;
        if (this.options.onMouseOver) {
          this.options.onMouseOver(featureMouseOptions);
        }
      }
      return true;
    } else {
      if (type === 'hover' && this._mouseOver) {
        this._mouseOver = false;
        if (this.options.onMouseOut) {
          this.options.onMouseOut(mouseOptions);
        }
        if (this.options.selectOnHover) {
          this.unselect();
        }
      }
    }
    return false;
  }

  private _selectFeature(feature: OlFeature<any>, coordinates?: number[]) {
    const {
      multiselect,
      selectedPaint,
      popupOptions,
      popupOnSelect,
      onSelect,
    } = this.options || {};
    const type: OnLayerSelectType = coordinates ? 'click' : 'api';
    if (!multiselect) {
      this.addUnselectCb(() => this._unselectFeature(feature));
      for (const x of this._selectedFeatures) {
        this._unselectFeature(x);
      }
    }
    this._selectedFeatures.push(feature);
    this.selected = true;
    if (selectedPaint) {
      const style = styleFunction(feature, selectedPaint);
      if (style) {
        feature.setStyle(style);
      }
    }
    if (popupOnSelect) {
      this._openPopup({
        coordinates,
        feature,
        options: popupOptions,
        type: 'click',
      });
    }
    if (onSelect) {
      const feature_ = getFeature(feature);
      onSelect({
        layer: this,
        features: [],
        type,
        ...createFeaturePositionOptions({
          feature: feature_,
          dataProjection: this.lonlatProjection,
          featureProjection: this.displayProjection,
        }),
      });
    }
  }

  private _unselectFeature(feature: OlFeature<any>) {
    const index = this._selectedFeatures.indexOf(feature);
    if (index !== -1) {
      this._selectedFeatures.splice(index, 1);
      const popup = this._openedPopup.find((x) => x[0] === feature);
      if (popup) {
        this._removePopup(popup[1]);
      }
    }
    this.selected = this._selectedFeatures.length > 0;
    if (this.options && this.options.paint) {
      const style = styleFunction(feature, this.options.paint);
      if (style) {
        feature.setStyle(style);
      }
    }
  }

  private async _openPopup({
    coordinates,
    feature: f,
    options = {},
    type,
  }: {
    coordinates?: LngLatArray;
    feature: OlFeature<any>;
    options?: PopupOptions;
    type: OnLayerSelectType;
  }): Promise<void> {
    const map = this.map;
    if (!map) return;
    let popup: Overlay;
    const _closeHandlers: PopupOnCloseFunction[] = [];
    const onClose = (handler: PopupOnCloseFunction) => {
      _closeHandlers.push(handler);
    };
    const close = () => {
      if (popup) {
        this._removePopup(popup);
      }
    };
    const { createPopupContent, popupContent } = options;
    const feature = getFeature(f);
    const content = createPopupContent
      ? await createPopupContent({
          close,
          onClose,
          type,
          ...this._createLayerDefOpts(feature),
        })
      : popupContent;
    coordinates =
      coordinates || (feature && (getCentroid(feature) as [number, number]));
    if (content && coordinates) {
      const popupContent =
        typeof content === 'string' ? makeHtmlFromString(content) : content;
      const element = this._createPopupElement({
        ...options,
        popupContent,
        close,
      });
      const popupOpt: OverlayOptions = {
        element,
      };
      popup = new Overlay(popupOpt);
      popup.setPosition(
        transform(coordinates, this.lonlatProjection, this.displayProjection),
      );
      map.addOverlay(popup);
      this._openedPopup.push([f, popup, _closeHandlers]);
    }
  }

  private _createPopupElement({
    closeButton,
    popupContent,
    maxWidth,
    minWidth,
    close,
  }: PopupOptions & { popupContent: HTMLElement; close: () => void }) {
    closeButton = closeButton ?? !this.options.selectOnHover;
    const popup = create('div', 'ol-popup');
    if (maxWidth) {
      popup.style.maxWidth = maxWidth + 'px';
    }
    if (minWidth) {
      popup.style.minWidth = minWidth + 'px';
    }
    if (closeButton) {
      const closer = create('a', 'ol-popup-closer', popup);
      closer.setAttribute('href', '#');
      closer.addEventListener('click', close);
    }
    const content = create('div', 'popup-content', popup);
    content.appendChild(popupContent);
    return popup;
  }

  private _removeAllPopup(): void {
    const _openedPopup = [...this._openedPopup];
    this._openedPopup = [];
    for (const p of _openedPopup) {
      this._removePopup(p[1]);
    }
  }

  private _removePopup(popup: Overlay) {
    const map = this.map;
    if (map) {
      map.removeOverlay(popup);
      const index = this._openedPopup.findIndex((x) => x[1] === popup);
      if (index !== -1) {
        const [feature, , closeHandlers] = this._openedPopup[index];
        const unselectOnClose =
          this.options.popupOptions?.unselectOnClose ?? true;

        for (const h of closeHandlers) {
          h(this._createLayerDefOpts(getFeature(feature)));
        }
        closeHandlers.length = 0;
        if (unselectOnClose) {
          this._unselectFeature(feature);
        }
        this._openedPopup.splice(index, 1);
      }
    }
  }
}
