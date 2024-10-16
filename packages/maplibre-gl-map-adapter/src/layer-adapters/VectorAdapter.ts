import { isIcon, isPaint, isPaintCallback } from '@nextgis/paint';
import { featureFilter, isPropertyFilter } from '@nextgis/properties-filter';
import { Popup } from 'maplibre-gl';

import { convertMapClickEvent } from '../utils/convertMapClickEvent';
import { convertZoomLevel } from '../utils/convertZoomLevel';
import { allowedByType, typeAliasForFilter } from '../utils/geomType';
import { getCentroid } from '../utils/getCentroid';
import { createFeaturePositionOptions } from '../utils/getFeaturePosition';
import { getImage } from '../utils/imageIcons';
import { makeHtmlFromString } from '../utils/makeHtmlFromString';

import { BaseAdapter } from './BaseAdapter';

import type { IconPaint, Paint, PathPaint } from '@nextgis/paint';
import type {
  Operation,
  PropertiesFilter,
  PropertyFilter,
} from '@nextgis/properties-filter';
import type {
  DataLayerFilter,
  FilterOptions,
  LayerDefinition,
  OnLayerSelectType,
  PopupOnCloseFunction,
  PopupOptions,
  VectorAdapterLayerType,
  VectorAdapterOptions,
  VectorLayerAdapter,
} from '@nextgis/webmap';
import type {
  Feature as F,
  GeoJsonProperties,
  Geometry,
  GeometryObject,
} from 'geojson';
import type {
  FillLayerSpecification,
  FilterSpecification,
  LayerSpecification,
  LegacyFilterSpecification,
  LngLatLike,
  Map,
  MapEventType,
  MapLayerMouseEvent,
  MapMouseEvent,
  SourceSpecification,
} from 'maplibre-gl';

import type {
  SelectedFeaturesIds,
  VectorLayerSpecification,
} from '../interfaces';
import type { TLayer } from '../MaplibreGLMapAdapter';

type Layer = VectorLayerSpecification;
type Layout = FillLayerSpecification['layout'];

export const operationsAliases: { [key in Operation]: string } = {
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

const reversOperations: { [key in Operation]: string } = {
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

type MaplibreGLLayerType = 'fill' | 'line' | 'symbol' | 'circle';

const maplibreGLTypeAlias: Record<VectorAdapterLayerType, MaplibreGLLayerType> =
  {
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
  protected featureIdName = '$id';
  protected _types: VectorAdapterLayerType[] = ['polygon', 'point', 'line'];
  protected readonly _sourceId: string;
  protected readonly _selectionName: string;
  protected _selectedFeatureIds: SelectedFeaturesIds | false = [];

  protected _selectProperties?: PropertiesFilter;
  protected _filterProperties?: PropertiesFilter;
  protected _openedPopup: [Feature, Popup, PopupOnCloseFunction[]][] = [];

  private $onLayerMouseMove?: (e: MapLayerMouseEvent) => void;
  private $onLayerMouseLeave?: (e: MapLayerMouseEvent) => void;

  constructor(
    map: Map,
    public options: O,
  ) {
    super(map, options);
    this._sourceId = this.options.source
      ? (this.options.source as string)
      : `source-${this._layerId}`;

    this._selectionName = this._layerId + '-highlighted';
    this.$onLayerMouseLeave = this._onLayerMouseLeave.bind(this);
    this.$onLayerMouseMove = this._onLayerMouseMove.bind(this);
    map._onMapClickLayers.push(this);
  }

  async addLayer(options: O): Promise<TLayer> {
    options = this.options = { ...this.options, ...(options || {}) };
    if (options.featureIdName) {
      this.featureIdName = options.featureIdName;
    }

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

  async propertiesFilter(
    filters: PropertiesFilter,
    options?: FilterOptions,
  ): Promise<void> {
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
    this._selectedFeatureIds = [];
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
        if (this.options.onClick) {
          this.options.onClick(this._createLayerClickOptions(e, feature));
        }
      }
    }
    return feature;
  }
  _onLayerDoubleClick(
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
        if (this.options.onDoubleClick) {
          this.options.onDoubleClick(this._createLayerClickOptions(e, feature));
        }
      }
    }
    return feature;
  }

  protected _createLayerClickOptions(e: MapLayerMouseEvent, f: Feature) {
    const isSelected = this._featureSelect(f, e.lngLat);
    return {
      layer: this,
      selected: isSelected,
      event: convertMapClickEvent(e),
      source: e,
      ...this._createLayerOptions(f),
    };
  }

  protected _featureSelect(
    feature: Feature,
    coordinates?: LngLatLike,
  ): boolean {
    const { selectable, multiselect, unselectOnSecondClick } = this.options;
    const alreadySelected = this.isFeatureSelected(feature);
    let becameSelected = alreadySelected;
    if (selectable || multiselect) {
      let features: Feature[] | undefined = undefined;
      if (alreadySelected) {
        if (unselectOnSecondClick && !this.options.selectOnHover) {
          this._unselectFeature(feature, { silent: true });
          becameSelected = false;
        }
      } else {
        if (!multiselect && this.map) {
          this.map._addUnselectCb(() =>
            this._unselectFeature(feature, { silent: true }),
          );
        }
        features = this._selectFeature(feature, { silent: true });
        becameSelected = true;
      }
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
    layout?: Layout,
  ): Promise<void> {
    let mType: MaplibreGLLayerType | undefined;
    if (this.options.paint) {
      if ('type' in this.options.paint && this.options.paint.type === 'icon') {
        mType = 'symbol';
      }
    }
    if (mType === undefined) {
      mType = maplibreGLTypeAlias[type];
    }
    layout = (layout || this.options.layout || {}) as Layout;
    const layerOpt: Layer = {
      id: name,
      type: mType,
      source: this._sourceId,
      filter: filter as FilterSpecification,
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
      opt.minzoom = convertZoomLevel(minZoom);
    }
    if (maxZoom) {
      opt.maxzoom = convertZoomLevel(maxZoom);
    }
    const map = this.map;
    if (map) {
      map.addLayer(opt as LayerSpecification);
      if (filter) {
        const filter_ = (filter || []) as FilterSpecification[];
        const filters = ['all', ...filter_].filter(Boolean);
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

      const maplibreGLType = maplibreGLTypeAlias[type];
      for (const [name, paint] of layers) {
        let _paint: any = null;
        let nativePaint: Record<string, any> | null = null;
        let typePaint = null;
        if (this.options.nativePaint) {
          nativePaint =
            typeof this.options.nativePaint === 'boolean'
              ? paint
              : this.options.nativePaint;
          const opacity = this.options.opacity;
          delete nativePaint.type;
          if (opacity !== undefined && nativePaint) {
            const allowedNativePaint = allowedByType[type];
            const opacityProp = allowedNativePaint.find(
              (x) => x[0] === 'opacity',
            );
            if (opacityProp) {
              // TODO: check
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              nativePaint[maplibreGLType + '-' + opacityProp[1]];
            }
            for (const p in nativePaint) {
              if (p.indexOf('opacity') !== -1) {
                nativePaint[p] = opacity;
              }
            }
          }
        } else {
          typePaint = await this._createPaintForType(paint, type, name);
        }
        _paint = typePaint || nativePaint;
        if (this.map) {
          if ('icon-image' in _paint) {
            // If true, the icon will be visible even if it collides with other previously drawn symbols.
            _paint['icon-allow-overlap'] = true;
            for (const p in _paint) {
              try {
                this.map.setLayoutProperty(name, p, _paint[p]);
              } catch {
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
      const maplibreGLPaint: any = {};
      const paint_ = { ...PAINT, ...(paint || {}) };
      if (paint.type === 'icon' && paint.html) {
        await this._registerImage(paint);
        const image: Record<string, unknown> = {
          'icon-image': paint.html,
        };
        if (paint.rotate) {
          image['icon-rotate'] = paint.rotate;
        }
        if (paint.iconAnchor) {
          image['icon-anchor'] = 'bottom-right';
          image['icon-offset'] = paint.iconAnchor;
        }
        return image;
      } else {
        const pathPaint = paint_ as PathPaint;
        const maplibreGLType = maplibreGLTypeAlias[type];
        const allowed = allowedByType[type];
        if (allowed) {
          let p: keyof typeof pathPaint;
          for (p in pathPaint) {
            // Special case for strokeColor
            const polyStroke = type === 'polygon' && p === 'strokeColor';
            if (polyStroke && pathPaint.stroke) {
              maplibreGLPaint['fill-outline-color'] = pathPaint[p];
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
                if (
                  allowedType[1] &&
                  allowedType[1].includes('stroke') &&
                  !pathPaint.stroke
                ) {
                  continue;
                }
                const paramName = Array.isArray(allowedType)
                  ? allowedType[1]
                  : allowedType;

                const opacity = this.options.opacity;
                let prop = pathPaint[p];
                if (
                  opacity !== undefined &&
                  opacity !== null &&
                  paramName.indexOf('opacity') !== -1
                ) {
                  prop = Number(prop) * opacity;
                }

                maplibreGLPaint[maplibreGLType + '-' + paramName] = prop;
              }
            }
          }
        }
        maplibreGLPaint[maplibreGLType + '-opacity-transition'] = {
          duration: 0,
        };
        return maplibreGLPaint;
      }
    } else if (isPaintCallback(paint) && paint.paint) {
      return this._createPaintForType(paint.paint, type);
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

  protected _setFeatureIdsSelected(feature: Feature | Feature[]) {
    let selectedFeatureIds = this._selectedFeatureIds || [];
    if (this.options && !this.options.multiselect) {
      selectedFeatureIds = [];
    }
    let features: Feature[] = [];
    if (Array.isArray(feature)) {
      features = feature;
    } else {
      features = [feature];
    }
    features.forEach((f) => {
      const id = this._getFeatureFilterId(f);
      if (id !== undefined) {
        selectedFeatureIds.push(id);
      }
    });
    this._selectProperties = undefined;
    this._selectedFeatureIds = selectedFeatureIds;
    return features;
  }

  protected _selectFeature(
    feature: Feature | Feature[],
    opt?: { silent: boolean },
  ): Feature[] {
    const features = this._setFeatureIdsSelected(feature);
    this.select([
      [
        this.featureIdName,
        'in',
        features.map(
          (x) => (x.properties && x.properties[this.featureIdName]) || x.id,
        ),
      ],
    ]);
    return features;
  }

  protected _unselectFeature(
    feature?: Feature | Feature[],
    opt?: EventOptions,
  ): void {
    if (feature) {
      let features: Feature[] = [];
      if (Array.isArray(feature)) {
        features = feature;
      } else {
        features = [feature];
      }
      if (features.length) {
        for (const f of features) {
          const id = this._getFeatureFilterId(f);
          const selected = this._selectedFeatureIds;
          if (selected && id !== undefined) {
            const index = selected.indexOf(id);
            if (index !== -1) {
              selected.splice(index, 1);
            }
          }
          this._removeFeaturePopup(f, true);
        }
      }
    } else {
      this._selectedFeatureIds = false;
    }
    this._selectProperties = undefined;
    this._updateFilter(opt);
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
      for (const t of this._types) {
        const geomType = typeAliasForFilter[t];
        if (geomType) {
          const geomFilter: LegacyFilterSpecification = [
            '==',
            '$type',
            geomType,
          ];
          const layerName = this._getLayerNameFromType(t);
          const selLayerName = this._getSelectionLayerNameFromType(t);
          const selectProperties = this._selectProperties;
          const filterProperties = this._filterProperties;
          const propertyFilters =
            filterProperties &&
            this._convertToMaplibreGLFilter(filterProperties);
          if (this.map && layers.indexOf(selLayerName) !== -1) {
            if (this._selectionName) {
              let filters: any[] = [];
              if (selectProperties || this._selectedFeatureIds) {
                if (selectProperties) {
                  filters =
                    this._convertToMaplibreGLFilter(selectProperties) || [];
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
                this.map.setFilter(
                  selLayerName,
                  filters as FilterSpecification,
                );
              }
            }
          }
          if (this.map && layers.indexOf(layerName) !== -1) {
            const filters_: any[] = ['all', geomFilter];
            this._updateWithNativeFilter(filters_);
            if (selectProperties) {
              const selectFilters = this._convertToMaplibreGLFilter(
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
            this.map.setFilter(layerName, filters_ as FilterSpecification);
          }
        }
      }
    }
  }

  protected _convertToMaplibreGLFilter(
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
    if (refresh) {
      const openedPopup = this._openedPopup.find((x) => x[0].id === feature.id);
      if (openedPopup) {
        if (coordinates) {
          openedPopup[1].setLngLat(coordinates);
        }
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
    const { labelField, label } = this.options;
    if (map && (labelField || label)) {
      const popupOpt: maplibregl.PopupOptions = {
        closeButton: false,
        closeOnClick: false,
        closeOnMove: this.options.labelOnHover,
      };
      let text: string | undefined;
      if (labelField) {
        text = f.properties && f.properties[labelField];
      } else if (label) {
        text = label(this._createLayerOptions(f));
      }
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

  private _removeAllPopups() {
    for (const o of this._openedPopup) {
      this._removePopup(o[1], true);
    }
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
      const {
        onMouseOver,
        selectOnHover,
        selectable,
        interactive,
        labelOnHover,
        popupOnHover,
      } = this.options;
      const event = convertMapClickEvent(evt);
      if (
        onMouseOver ||
        selectOnHover ||
        interactive ||
        labelOnHover ||
        popupOnHover
      ) {
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
          if (labelOnHover || popupOnHover) {
            this._removeAllPopups();
            if (labelOnHover) {
              this._openLabel(feature, event.lngLat as [number, number]);
            } else if (popupOnHover) {
              this._openPopup({
                feature,
                type: 'api',
                options: this.options.popupOptions,
              });
            }
          }
        }
      }
      if (selectable || interactive) {
        map.getCanvas().style.cursor = 'pointer';
      }
    }
  }

  private _onLayerMouseLeave(evt: MapEventType['mousemove'] & MapMouseEvent) {
    const { onMouseOut, labelOnHover, popupOnHover, selectOnHover } =
      this.options;
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
    if (popupOnHover) {
      this._removeAllPopups();
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
      } catch {
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
