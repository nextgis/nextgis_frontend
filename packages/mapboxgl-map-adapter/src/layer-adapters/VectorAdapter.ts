import { isPaint, isIcon, PathPaint } from '@nextgis/paint';
import { isPropertyFilter, featureFilter } from '@nextgis/properties-filter';

import { getImage } from '../utils/imageIcons';
import { getCentroid } from '../utils/getCentroid';
import { makeHtmlFromString } from '../utils/makeHtmlFromString';
import { convertMapClickEvent } from '../utils/convertMapClickEvent';
import { typeAliasForFilter, allowedByType } from '../utils/geomType';
import { createFeaturePositionOptions } from '../utils/getFeaturePosition';
import { BaseAdapter } from './BaseAdapter';

import type {
  GeoJsonProperties,
  GeometryObject,
  Feature as F,
  Geometry,
} from 'geojson';
import {
  Map,
  Popup,
  Layout,
  LngLatLike,
  MapEventType,
  MapMouseEvent,
  LayerSpecification,
  SourceSpecification,
  MapLayerMouseEvent,
  FilterSpecification,
} from 'maplibre-gl';
import type { Paint, IconPaint } from '@nextgis/paint';
import type {
  VectorAdapterLayerType,
  PopupOnCloseFunction,
  VectorAdapterOptions,
  VectorLayerAdapter,
  OnLayerSelectType,
  DataLayerFilter,
  FilterOptions,
  PopupOptions,
  LayerDefinition,
} from '@nextgis/webmap';
import type { TLayer } from '../MapboxglMapAdapter';
import type {
  PropertiesFilter,
  PropertyFilter,
  Operations,
} from '@nextgis/properties-filter';
import type { VectorLayerSpecification } from '../interfaces';

type Layer = VectorLayerSpecification;

export const operationsAliases: { [key in Operations]: string } = {
  gt: '>',
  lt: '<',
  ge: '>=',
  le: '<=',
  eq: '==',
  ne: '!=',
  in: 'in',
  notin: '!in',
  // NOT SUPPORTED
  like: '==',
  // NOT SUPPORTED
  ilike: '==',
};

const reversOperations: { [key in Operations]: string } = {
  gt: operationsAliases.le,
  lt: operationsAliases.ge,
  ge: operationsAliases.lt,
  le: operationsAliases.gt,
  eq: operationsAliases.ne,
  ne: operationsAliases.eq,
  in: operationsAliases.notin,
  notin: operationsAliases.in,
  like: operationsAliases.ne,
  ilike: operationsAliases.ne,
};

export interface EventOptions {
  silent?: boolean;
}

export interface Feature<
  G extends GeometryObject | null = Geometry,
  P = GeoJsonProperties,
> extends F<G, P> {
  _featureFilterId?: string;
}

const PAINT = {
  color: 'blue',
  opacity: 1,
  radius: 10,
};

type MapboxLayerType = 'fill' | 'line' | 'symbol' | 'circle';

const mapboxTypeAlias: Record<VectorAdapterLayerType, MapboxLayerType> = {
  polygon: 'fill',
  line: 'line',
  point: 'circle',
};

export abstract class VectorAdapter<
    O extends VectorAdapterOptions = VectorAdapterOptions,
  >
  extends BaseAdapter<O>
  implements VectorLayerAdapter<Map, TLayer, O, Feature>
{
  selected = false;
  map?: Map;
  protected featureIdName = 'id';
  protected _types: VectorAdapterLayerType[] = ['polygon', 'point', 'line'];
  protected readonly _sourceId: string;
  protected readonly _selectionName: string;
  protected _selectedFeatureIds: (number | string)[] | false = [];

  protected _selectProperties?: PropertiesFilter;
  protected _filterProperties?: PropertiesFilter;
  protected _openedPopup: [Feature, Popup, PopupOnCloseFunction[]][] = [];

  private $onLayerMouseMove?: (e: MapLayerMouseEvent) => void;
  private $onLayerMouseLeave?: (e: MapLayerMouseEvent) => void;

  constructor(map: Map, public options: O) {
    super(map, options);
    this._sourceId = this.options.source
      ? (this.options.source as string)
      : `source-${this._layerId}`;

    if (this.options.featureIdName) {
      this.featureIdName = this.options.featureIdName;
    } else if (this.options.source) {
      this.featureIdName = '$id';
    } else {
      this.featureIdName = 'fid';
    }

    this._selectionName = this._layerId + '-highlighted';
    this.$onLayerMouseLeave = this._onLayerMouseLeave.bind(this);
    this.$onLayerMouseMove = this._onLayerMouseMove.bind(this);
    map._onMapClickLayers.push(this);
  }

  async addLayer(options: O): Promise<TLayer> {
    options = this.options = { ...this.options, ...(options || {}) };

    this.layer = [];
    const types = (this._types = options.type ? [options.type] : this._types);
    if (options.paint) {
      this._beforeLayerLayer(this._sourceId);
      for (const t of types) {
        const geomType = typeAliasForFilter[t];
        if (geomType) {
          let type = t;
          if (t === 'point') {
            const paintType = this._detectPaintType(options.paint);
            if (paintType === 'icon') {
              type = 'point';
            }
          }
          const layer = this._getLayerNameFromType(t);
          const geomFilter =
            types.length > 1 ? ['==', '$type', geomType] : undefined;

          await this._addGeomLayer(layer, type, [
            geomFilter,
            this._getNativeFilter(),
          ]);
          this.layer.push(layer);
          if (options.selectedPaint) {
            const selectionLayer = this._getSelectionLayerNameFromType(t);
            await this._addGeomLayer(
              selectionLayer,
              type,
              [geomFilter, ['in', this.featureIdName, '']],
              this.options.selectedLayout,
            );
            this.layer.push(selectionLayer);
          }
        }
      }
      await this._onLayerAdd(this._sourceId);
    }

    this._addEventsListeners();

    return this.layer;
  }

  propertiesFilter(filters: PropertiesFilter, options?: FilterOptions): void {
    this._filterProperties = filters;
    this._updatePropertiesFilter();
  }

  removeFilter(): void {
    this._filterProperties = undefined;
    this._updateFilter();
  }

  select(properties?: DataLayerFilter<F, TLayer> | PropertiesFilter): void {
    if (typeof properties !== 'function') {
      this._selectProperties = properties;
      this._updateFilter();
    }
    this.selected = true;
    const { onSelect, onLayerSelect } = this.options;
    const onSelect_ = onSelect || onLayerSelect;
    if (onSelect_) {
      const features: Feature[] = [];
      onSelect_({
        layer: this,
        features,
        type: 'api',
        ...createFeaturePositionOptions(features),
      });
    }
  }

  unselect(): void {
    this._selectProperties = undefined;
    this._updateFilter();
    this.selected = false;
    const { onSelect, onLayerSelect } = this.options;
    const onSelect_ = onSelect || onLayerSelect;
    if (onSelect_) {
      onSelect_({
        layer: this,
        features: undefined,
        type: 'api',
        ...createFeaturePositionOptions([]),
      });
    }
    this._removeAllPopup();
  }

  beforeRemove(): void {
    const map = this.map;
    if (map) {
      if (this.layer) {
        this.layer.forEach((layerId) => {
          map.removeLayer(layerId);
        });
      }
      const index = map._onMapClickLayers.indexOf(this);
      if (index !== -1) {
        map._onMapClickLayers.splice(index, 1);
      }
    }
    this._removeAllPopup();
    this._removeEventListeners();
    this.$onLayerMouseLeave = undefined;
    this.$onLayerMouseMove = undefined;
    super.beforeRemove();
  }

  setOpacity(val: number): void {
    this.options.opacity = Number(val);
    if (this.options.type) {
      this._updateLayerPaint(this.options.type);
    }
  }

  setPaint(paint?: Paint | null): void {
    if (paint) {
      this.options.paint = paint;
      if (this.options.type) {
        this._updateLayerPaint(this.options.type);
      }
    }
  }
  setSelectedPaint(paint?: Paint | null): void {
    if (paint) {
      this.options.selectedPaint = paint;
      if (this.options.type) {
        this._updateLayerPaint(this.options.type);
      }
    }
  }
  updatePaint(paint: Partial<Paint>): void {
    this.options.paint = { ...this.options.paint, ...paint } as Paint;
    if (this.options.type) {
      this._updateLayerPaint(this.options.type);
    }
  }
  updateSelectedPaint(paint: Partial<Paint>): void {
    this.options.selectedPaint = {
      ...this.options.selectedPaint,
      ...paint,
    } as Paint;
    if (this.options.type) {
      this._updateLayerPaint(this.options.type);
    }
  }

  _onLayerClick(
    e: MapLayerMouseEvent,
  ): Feature<Geometry, GeoJsonProperties> | undefined {
    e.preventDefault();
    let feature: Feature | undefined;
    const map = this.map;
    if (!map) {
      return;
    }
    if (this.layer) {
      feature = this._getFeatureFromPoint(e);
      if (feature) {
        const isSelected = this._featureSelect(feature, e.lngLat);
        if (this.options.onClick) {
          this.options.onClick({
            layer: this,
            selected: isSelected,
            event: convertMapClickEvent(e),
            source: e,
            ...this._createLayerOptions(feature),
          });
        }
      }
    }
    return feature;
  }

  protected _featureSelect(
    feature: Feature,
    coordinates?: LngLatLike,
  ): boolean {
    const alreadySelected = this.isFeatureSelected(feature);
    let becameSelected = alreadySelected;

    if (this.options.selectable) {
      let features: Feature[] | undefined = undefined;
      if (alreadySelected) {
        if (this.options && this.options.unselectOnSecondClick) {
          this._unselectFeature(feature, { silent: true });
          becameSelected = false;
        }
      } else {
        this.map &&
          this.map._addUnselectCb(() =>
            this._unselectFeature(feature, { silent: true }),
          );
        features = this._selectFeature(feature, { silent: true });
        becameSelected = true;
      }
      // alreadySelected = this.isFeatureSelected(feature);
      if (this.options.onSelect) {
        this.options.onSelect({
          layer: this,
          features,
          type: 'click',
          ...createFeaturePositionOptions(feature),
        });
      }
    }
    if (becameSelected && this.options.popupOnSelect) {
      this._openPopup({
        coordinates,
        feature,
        options: this.options.popupOptions,
        type: 'click',
        refresh: true,
      });
    }
    this.selected = becameSelected;
    return this.selected;
  }

  protected _updateWithNativeFilter(filter: any[]): any[] {
    const nativeFilter = this._getNativeFilter();
    if (nativeFilter.length) {
      filter.push(nativeFilter);
    }
    return filter;
  }

  protected _getNativeFilter(): PropertyFilter {
    return (
      this.options.nativeFilter ? this.options.nativeFilter : []
    ) as PropertyFilter;
  }

  protected async _addGeomLayer(
    name: string,
    type: VectorAdapterLayerType,
    filter?: any[],
    layout?: Layout<any>,
  ): Promise<void> {
    let mType: MapboxLayerType | undefined;
    if (this.options.paint) {
      if ('type' in this.options.paint && this.options.paint.type === 'icon') {
        mType = 'symbol';
      }
    }
    if (mType === undefined) {
      mType = mapboxTypeAlias[type];
    }
    layout = (layout || this.options.layout || {}) as Layout<any>;
    const layerOpt: Layer = {
      id: name,
      type: mType,
      source: this._sourceId,
      filter,
      layout: {
        visibility: 'none',
        ...layout,
      },
      ...this._getAdditionalLayerOptions(),
    };
    if (this.options.nativeOptions) {
      Object.assign(layerOpt, this.options.nativeOptions);
    }
    this._addLayer(layerOpt);
  }

  protected _addLayer(layerOpt: Layer): void {
    const { filter, ...opt } = layerOpt;
    const { minZoom, maxZoom } = this.options;
    if (minZoom) {
      opt.minzoom = minZoom - 1;
    }
    if (maxZoom) {
      opt.maxzoom = maxZoom - 1;
    }
    const map = this.map;
    if (map) {
      map.addLayer(opt as LayerSpecification);
      if (filter) {
        const filters = ['all', ...(filter || [])].filter(Boolean);
        map.setFilter(opt.id, filters as FilterSpecification);
      }
    }
  }

  protected async _beforeLayerLayer(
    sourceId: string,
    options?: SourceSpecification,
  ): Promise<void> {
    // ignore
  }
  protected async _onLayerAdd(
    sourceId: string,
    options?: SourceSpecification,
  ): Promise<void> {
    // ignore
  }

  protected async _updateLayerPaint(
    type: VectorAdapterLayerType,
  ): Promise<void> {
    const layerName = this._getLayerNameFromType(type);

    if (this.options.paint) {
      const layers: [string, Paint][] = [[layerName, this.options.paint]];
      if (this.options.selectedPaint) {
        const selName = this._getSelectionLayerNameFromType(type);
        layers.push([selName, this.options.selectedPaint]);
      }

      for (const [name, paint] of layers) {
        let _paint: any;
        if (this.options.nativePaint) {
          _paint =
            typeof this.options.nativePaint === 'boolean'
              ? paint
              : this.options.nativePaint;
        } else {
          _paint = await this._createPaintForType(paint, type, name);
        }
        if (this.map) {
          if ('icon-image' in _paint) {
            // If true, the icon will be visible even if it collides with other previously drawn symbols.
            _paint['icon-allow-overlap'] = true;
            for (const p in _paint) {
              try {
                this.map.setLayoutProperty(name, p, _paint[p]);
              } catch (er) {
                //
              }
            }
          } else {
            for (const p in _paint) {
              this.map.setPaintProperty(name, p, _paint[p]);
            }
          }
        }
      }
    }
  }

  protected _getLayerNameFromType(type: string): string {
    return type + '-' + this._layerId;
  }

  protected _getSelectionLayerNameFromType(
    type: VectorAdapterLayerType,
  ): string {
    return type + '-' + this._selectionName;
  }

  protected async _createPaintForType(
    paint: Paint,
    type: VectorAdapterLayerType,
    name?: string,
  ): Promise<any> {
    if (isPaint(paint)) {
      const mapboxPaint: any = {};
      const paint_ = { ...PAINT, ...(paint || {}) };
      if (paint.type === 'icon' && paint.html) {
        await this._registerImage(paint);
        return {
          'icon-image': paint.html,
        };
      } else {
        const pathPaint = paint_ as PathPaint;
        const mapboxType = mapboxTypeAlias[type];
        const allowed = allowedByType[type];
        if (allowed) {
          let p: keyof typeof pathPaint;
          for (p in pathPaint) {
            // Special case for strokeColor
            const polyStroke =
              type === 'polygon' && (p === 'color' || p === 'strokeColor');
            if (polyStroke && pathPaint.stroke) {
              mapboxPaint['fill-outline-color'] = pathPaint[p];
            }
            if (!polyStroke) {
              const allowedType = allowed.find((x) => {
                if (typeof x === 'string') {
                  return x === p;
                } else if (Array.isArray(x)) {
                  return x[0] === p;
                }
                return false;
              });
              if (allowedType) {
                const paramName = Array.isArray(allowedType)
                  ? allowedType[1]
                  : allowedType;
                const opacity = this.options.opacity;
                let prop = pathPaint[p];
                if (
                  opacity !== undefined &&
                  paramName.indexOf('opacity') !== -1
                ) {
                  prop = Number(prop) * opacity;
                }
                mapboxPaint[mapboxType + '-' + paramName] = prop;
              }
            }
          }
        }
        mapboxPaint[mapboxType + '-opacity-transition'] = {
          duration: 0,
        };
        return mapboxPaint;
      }
    }
  }

  protected _getFeatureFilterId(feature: Feature): string | number | undefined {
    const id = feature._featureFilterId;
    if (id !== undefined) {
      return id;
    } else if (
      feature.properties &&
      feature.properties[this.featureIdName] !== undefined
    ) {
      return feature.properties[this.featureIdName];
    }
    return feature.id;
  }

  protected async _registerImage(paint: IconPaint): Promise<void> {
    if (isIcon(paint) && paint.html && this.map) {
      const imageExist = this.map.hasImage(paint.html);
      if (!imageExist) {
        let width = 12;
        let height = 12;
        if (paint.iconSize) {
          width = paint.iconSize[0];
          height = paint.iconSize[1];
        }
        const image = await getImage(paint.html, {
          width,
          height,
        });
        if (this.map) {
          this.map.addImage(paint.html, image);
        }
      }
    }
  }

  protected _selectFeature(
    feature: Feature | Feature[],
    opt?: { silent: boolean },
  ): Feature[] {
    const features = Array.isArray(feature) ? feature : [feature];
    this.select([
      [
        this.featureIdName,
        'in',
        features.map(
          (x) => (x.properties && x.properties[this.featureIdName]) || x.id,
        ),
      ],
    ]);
    return [];
  }

  protected _unselectFeature(
    feature: Feature | Feature[],
    opt?: { silent: boolean },
  ): void {
    // ignore
  }

  protected _getAdditionalLayerOptions(): Record<string, unknown> {
    return {};
  }

  protected _updateFilter(opt?: EventOptions): void {
    this._updatePropertiesFilter();
  }

  protected _updatePropertiesFilter(): void {
    const layers = this.layer;
    if (layers) {
      this._types.forEach((t) => {
        const geomType = typeAliasForFilter[t];
        if (geomType) {
          const geomFilter = ['==', '$type', geomType];
          const layerName = this._getLayerNameFromType(t);
          const selLayerName = this._getSelectionLayerNameFromType(t);
          const selectProperties = this._selectProperties;
          const filterProperties = this._filterProperties;
          const propertyFilters =
            filterProperties && this._convertToMapboxFilter(filterProperties);
          if (this.map && layers.indexOf(selLayerName) !== -1) {
            if (this._selectionName) {
              let filters: any[] = [];
              if (selectProperties || this._selectedFeatureIds) {
                if (selectProperties) {
                  filters = this._convertToMapboxFilter(selectProperties) || [];
                } else if (this._selectedFeatureIds) {
                  filters = [
                    ['in', this.featureIdName, ...this._selectedFeatureIds],
                  ];
                }
                if (propertyFilters) {
                  propertyFilters.forEach((x) => filters.push(x));
                }
                this.map.setFilter(selLayerName, [
                  'all',
                  geomFilter,
                  ...filters,
                ]);
              } else {
                filters = ['in', '$id', ''];
                this.map.setFilter(selLayerName, filters);
              }
            }
          }
          if (this.map && layers.indexOf(layerName) !== -1) {
            const filters_: any[] = ['all', geomFilter];
            this._updateWithNativeFilter(filters_);
            if (selectProperties) {
              const selectFilters = this._convertToMapboxFilter(
                selectProperties,
                true,
              );
              selectFilters.forEach((x) => filters_.push(x));
            } else if (this._selectedFeatureIds) {
              filters_.push([
                '!in',
                this.featureIdName,
                ...this._selectedFeatureIds,
              ]);
            }
            if (propertyFilters) {
              propertyFilters.forEach((x) => filters_.push(x));
            }
            this.map.setFilter(layerName, filters_);
          }
        }
      });
    }
  }

  protected _convertToMapboxFilter(
    filters: PropertiesFilter,
    reverse = false,
  ): (any[] | 'all' | 'any' | undefined)[] {
    const _operationsAliases = reverse ? reversOperations : operationsAliases;
    const filter = filters.map((x) => {
      if (typeof x === 'string') {
        return x;
      } else if (isPropertyFilter(x)) {
        const [field, operation, value] = x;
        const operationAlias = _operationsAliases[operation];
        if (operation === 'in' || operation === 'notin') {
          return [operationAlias, field, ...value];
        }
        return [operationAlias, field, value];
      }
    });
    return filter;
  }

  protected isFeatureSelected(feature: Feature): boolean {
    if (this._selectedFeatureIds && this._selectedFeatureIds.length) {
      const filterId = this._getFeatureFilterId(feature);
      if (filterId) {
        return this._selectedFeatureIds.indexOf(filterId) !== -1;
      }
    } else if (this._selectProperties && this._selectProperties.length) {
      return featureFilter(feature, this._selectProperties);
    }
    return false;
  }

  protected _removeAllPopup(): void {
    for (const p of this._openedPopup) {
      p[1].remove();
    }
    this._openedPopup.length = 0;
  }

  protected async _openPopup({
    coordinates,
    feature,
    options = {},
    type,
    refresh,
  }: {
    coordinates?: LngLatLike;
    feature: Feature;
    options?: PopupOptions;
    type: OnLayerSelectType;
    refresh?: boolean;
  }): Promise<void> {
    if (refresh && coordinates) {
      const openedPopup = this._openedPopup.find((x) => x[0].id === feature.id);
      if (openedPopup) {
        openedPopup[1].setLngLat(coordinates);
        return;
      }
    }
    const map = this.map;
    if (!map) return;
    let popup: Popup;
    const _closeHandlers: PopupOnCloseFunction[] = [];
    const onClose = (handler: PopupOnCloseFunction) => {
      _closeHandlers.push(handler);
    };
    const close = () => {
      if (popup) {
        this._removePopup(popup);
      }
    };
    const {
      maxWidth,
      popupContent,
      createPopupContent,
      closeButton: closeBtn,
    } = options;
    const closeButton = closeBtn ?? !this.options.selectOnHover;

    const content = createPopupContent
      ? await createPopupContent({
          type,
          close,
          onClose,
          ...this._createLayerOptions(feature),
        })
      : popupContent;
    coordinates =
      coordinates || (feature && (getCentroid(feature) as [number, number]));
    if (content && coordinates) {
      const html =
        typeof content === 'string' ? makeHtmlFromString(content) : content;
      const popupOpt: maplibregl.PopupOptions = {
        closeButton,
        closeOnClick: false,
      };
      if (maxWidth) {
        popupOpt.maxWidth = typeof maxWidth === 'number' ? maxWidth + 'px' : '';
      }
      popup = new Popup(popupOpt);
      popup.setLngLat(coordinates).setDOMContent(html).addTo(map);

      const unselectOnClose =
        this.options.popupOptions?.unselectOnClose ?? true;
      if (unselectOnClose) {
        popup.once('close', () => {
          close();
        });
      }

      this._openedPopup.push([feature, popup, _closeHandlers]);
    }
  }

  protected _openLabel(f: Feature, lngLat?: [number, number]): void {
    const map = this.map;
    const { labelField } = this.options;
    if (map && labelField) {
      const popupOpt: maplibregl.PopupOptions = {
        closeButton: false,
        closeOnClick: false,
        closeOnMove: this.options.labelOnHover,
      };
      const text = f.properties && f.properties[labelField];
      if (text) {
        const isOpened = this._openedPopup.find((x) => x[0].id === f.id);
        if (!isOpened) {
          const popup = new Popup(popupOpt);
          lngLat = lngLat ?? (getCentroid(f) as [number, number]);
          popup.setLngLat(lngLat).setText(text).addTo(map);
          this._openedPopup.push([f, popup, []]);
        }
      }
    }
  }

  protected _closeLabel(): void {
    this._removeAllPopup();
  }

  protected _removeFeaturePopup(feature: Feature, doNotUnselect = false): void {
    const openedPopup = this._openedPopup.find((x) => x[0].id === feature.id);
    if (openedPopup) {
      this._removePopup(openedPopup[1], doNotUnselect);
    }
  }

  protected _createLayerOptions(feature: Feature): LayerDefinition {
    return {
      target: this,
      feature,
      ...createFeaturePositionOptions(feature),
    };
  }

  private _removePopup(popup: Popup, doNotUnselect = false) {
    const map = this.map;
    if (map) {
      popup.remove();
      const index = this._openedPopup.findIndex((x) => x[1] === popup);
      if (index !== -1) {
        const unselectOnClose =
          this.options.popupOptions?.unselectOnClose ?? true;
        const [feature, , closeHandlers] = this._openedPopup[index];
        for (const h of closeHandlers) {
          h(this._createLayerOptions(feature));
        }
        closeHandlers.length = 0;
        if (unselectOnClose && !doNotUnselect) {
          this._unselectFeature(feature);
        }
        this._openedPopup.splice(index, 1);
      }
    }
  }

  private _getFeatureFromPoint(
    evt: MapEventType['click'] & MapMouseEvent,
  ): Feature | undefined {
    // not work correct
    // const features = this.map.queryRenderedFeatures(e.point, {
    //   layers: this.layer
    // });

    const map = this.map;
    if (map) {
      if (this.options.onMouseOver && this.layer) {
        let feature: Feature | undefined;
        this.layer.find((a) => {
          const features_ = map.queryRenderedFeatures(evt.point, {
            layers: [a],
          });
          if (features_.length) {
            feature = features_[0] as Feature;
            return true;
          }
          return false;
        });
        return feature;
      }
    }
  }

  private _onLayerMouseMove(evt: MapEventType['mousemove'] & MapMouseEvent) {
    const map = this.map;
    if (map) {
      const { onMouseOver, selectOnHover, selectable, labelOnHover } =
        this.options;
      const event = convertMapClickEvent(evt);
      if (onMouseOver || selectOnHover || labelOnHover) {
        const feature = this._getFeatureFromPoint(evt);
        if (onMouseOver && this.layer) {
          onMouseOver({
            event,
            layer: this,
            source: evt,
            feature,
            ...createFeaturePositionOptions(feature || []),
          });
        }
        if (feature) {
          if (selectOnHover) {
            this._featureSelect(feature);
          }
          if (labelOnHover) {
            for (const o of this._openedPopup) {
              this._removePopup(o[1], true);
              // if (o[0].id !== feature.id) {
              // }
            }
            this._openLabel(feature, event.lngLat as [number, number]);
          }
        }
      }
      if (selectable) {
        map.getCanvas().style.cursor = 'pointer';
      }
    }
  }

  private _onLayerMouseLeave(evt: MapEventType['mousemove'] & MapMouseEvent) {
    const { onMouseOut, labelOnHover, selectOnHover } = this.options;
    if (this.map) {
      if (onMouseOut) {
        onMouseOut({
          event: convertMapClickEvent(evt),
          layer: this,
          source: evt,
        });
      }
      this.map.getCanvas().style.cursor = '';
    }
    if (selectOnHover) {
      this.unselect();
    }
    if (labelOnHover) {
      this._closeLabel();
    }
  }

  private _detectPaintType(paint: Paint): string | undefined {
    if ('type' in paint) {
      return paint.type;
    } else if (typeof paint === 'function') {
      try {
        const falsePaint = paint({
          type: 'Feature',
          properties: {},
          geometry: {} as Geometry,
        });
        return this._detectPaintType(falsePaint);
      } catch (er) {
        //
      }
    }
  }

  private _addEventsListeners() {
    if (this.layer && this.options) {
      this.layer.forEach((x) => {
        if (this.$onLayerMouseMove && this.map) {
          this.map.on('mousemove', x, this.$onLayerMouseMove);
        }
        if (this.$onLayerMouseLeave && this.map) {
          this.map.on('mouseleave', x, this.$onLayerMouseLeave);
        }
      });
    }
  }

  private _removeEventListeners() {
    if (this.$onLayerMouseMove && this.map) {
      this.map.off('mousemove', this.$onLayerMouseMove);
    }
    if (this.$onLayerMouseLeave && this.map) {
      this.map.off('mouseleave', this.$onLayerMouseLeave);
    }
  }
}
