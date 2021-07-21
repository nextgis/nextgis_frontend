import { isPaint, isIcon } from '@nextgis/paint';
import { checkIfPropertyFilter } from '@nextgis/properties-filter';

import { getImage } from '../util/imageIcons';
import { getCentroid } from '../util/getCentroid';
import { makeHtmlFromString } from '../util/makeHtmlFromString';
import { convertMapClickEvent } from '../util/convertMapClickEvent';
import { typeAliasForFilter, allowedByType } from '../util/geomType';
import { BaseAdapter } from './BaseAdapter';

import type {
  GeoJsonProperties,
  GeometryObject,
  Feature as F,
  Geometry,
} from 'geojson';
import {
  Map,
  Layer,
  Popup,
  AnyLayer,
  AnyLayout,
  EventData,
  LngLatLike,
  MapEventType,
  AnySourceData,
  MapLayerMouseEvent,
} from 'maplibre-gl';
import type { Paint, IconPaint } from '@nextgis/paint';
import type {
  VectorAdapterLayerType,
  VectorAdapterOptions,
  VectorLayerAdapter,
  OnLayerSelectType,
  DataLayerFilter,
  FilterOptions,
  PopupOptions,
} from '@nextgis/webmap';
import type { TLayer } from '../MapboxglMapAdapter';
import type {
  PropertiesFilter,
  PropertyFilter,
  Operations,
} from '@nextgis/properties-filter';

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
  protected _openedPopup: [Feature, Popup][] = [];

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
    // @ts-ignore
    this.map._onMapClickLayers.push(this);
  }

  async addLayer(options: O): Promise<TLayer> {
    options = this.options = { ...this.options, ...(options || {}) };

    this.layer = [];
    const types = (this._types = options.type ? [options.type] : this._types);
    if (options.paint) {
      this._onAddLayer(this._sourceId);
      // const types = this._types;
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

          await this._addLayer(layer, type, [
            geomFilter,
            this._getNativeFilter(),
          ]);
          this.layer.push(layer);
          if (options.selectedPaint) {
            const selectionLayer = this._getSelectionLayerNameFromType(t);
            await this._addLayer(
              selectionLayer,
              type,
              [geomFilter, ['in', this.featureIdName, '']],
              this.options.selectedLayout,
            );
            this.layer.push(selectionLayer);
          }
        }
      }
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
      onSelect_({ layer: this, features: [], type: 'api' });
    }
  }

  unselect(): void {
    this._selectProperties = undefined;
    this._updateFilter();
    this.selected = false;
    const { onSelect, onLayerSelect } = this.options;
    const onSelect_ = onSelect || onLayerSelect;
    if (onSelect_) {
      onSelect_({ layer: this, features: undefined, type: 'api' });
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
      // @ts-ignore
      const index = map._onMapClickLayers.indexOf(this);
      if (index !== -1) {
        // @ts-ignore
        this.map._onMapClickLayers.splice(index, 1);
      }
    }
    this._removeEventListeners();
    this.$onLayerMouseLeave = undefined;
    this.$onLayerMouseMove = undefined;
    super.beforeRemove();
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
            feature,
            selected: isSelected,
            event: convertMapClickEvent(e),
            source: e,
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
    let isSelected = this.isFeatureSelected(feature);
    if (this.options.selectable) {
      let features: Feature[] | undefined = undefined;
      if (isSelected) {
        if (this.options && this.options.unselectOnSecondClick) {
          this._unselectFeature(feature, { silent: true });
        }
      } else {
        features = this._selectFeature(feature, { silent: true });
      }
      isSelected = this.isFeatureSelected(feature);
      if (this.options.onSelect) {
        this.options.onSelect({ layer: this, features, type: 'click' });
      }
    }
    if (this.options.popupOnSelect) {
      this._openPopup({
        coordinates,
        feature,
        options: this.options.popupOptions,
        type: 'click',
      });
    }
    return isSelected;
  }

  protected _updateWithNativeFilter(filter: any[]): any[] {
    const nativeFilter = this._getNativeFilter();
    if (nativeFilter.length) {
      filter.push(nativeFilter);
    }
    return filter;
  }

  protected _getNativeFilter(): PropertyFilter<GeoJsonProperties> {
    return (
      this.options.nativeFilter ? this.options.nativeFilter : []
    ) as PropertyFilter;
  }

  protected async _addLayer(
    name: string,
    type: VectorAdapterLayerType,
    filter?: any[],
    layout?: AnyLayout,
  ): Promise<void> {
    const { minZoom, maxZoom } = this.options;
    let mType: MapboxLayerType | undefined;

    if (this.options.paint) {
      if ('type' in this.options.paint && this.options.paint.type === 'icon') {
        mType = 'symbol';
      }
    }

    if (mType === undefined) {
      mType = mapboxTypeAlias[type];
    }
    layout = (layout || this.options.layout || {}) as AnyLayout;
    const layerOpt: Layer = {
      id: name,
      type: mType,
      source: this._sourceId,
      layout: {
        visibility: 'none',
        ...layout,
      },
      ...this._getAdditionalLayerOptions(),
    };
    if (this.options.nativeOptions) {
      Object.assign(layerOpt, this.options.nativeOptions);
    }
    if (minZoom) {
      layerOpt.minzoom = minZoom - 1;
    }
    if (maxZoom) {
      layerOpt.maxzoom = maxZoom - 1;
    }
    const map = this.map;
    if (map) {
      map.addLayer(layerOpt as AnyLayer);

      const filters = ['all', ...(filter || [])].filter((x) => x);
      if (filters.length > 1) {
        map.setFilter(layerOpt.id, filters);
      }
    }
  }

  protected _onAddLayer(sourceId: string, options?: AnySourceData): void {
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

  protected _getLayerNameFromType(type: VectorAdapterLayerType): string {
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
      const _paint = { ...PAINT, ...(paint || {}) };
      if (paint.type === 'icon' && paint.html) {
        await this._registerImage(paint);
        return {
          'icon-image': paint.html,
        };
      } else {
        const mapboxType = mapboxTypeAlias[type];
        for (const p in _paint) {
          const allowed = allowedByType[type];
          if (allowed) {
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
              // @ts-ignore
              mapboxPaint[mapboxType + '-' + paramName] = _paint[p];
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

  protected _updateFilter(): void {
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
      } else if (checkIfPropertyFilter(x)) {
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
    if (this._selectedFeatureIds) {
      const filterId = this._getFeatureFilterId(feature);
      if (filterId) {
        return this._selectedFeatureIds.indexOf(filterId) !== -1;
      }
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
  }: {
    coordinates?: LngLatLike;
    feature: Feature;
    options?: PopupOptions;
    type: OnLayerSelectType;
  }): Promise<void> {
    const map = this.map;
    if (!map) return;
    const { maxWidth, createPopupContent, popupContent } = options;
    const closeButton = !this.options.selectOnHover;

    const content = createPopupContent
      ? await createPopupContent({
          feature,
          target: this,
          type,
        })
      : popupContent;
    coordinates =
      coordinates || (feature && (getCentroid(feature) as [number, number]));
    if (content && coordinates) {
      const html =
        typeof content === 'string' ? makeHtmlFromString(content) : content;
      const popupOpt: maplibregl.PopupOptions = {
        closeButton,
        // closeOnClick: false,
      };
      if (maxWidth) {
        popupOpt.maxWidth = typeof maxWidth === 'number' ? maxWidth + 'px' : '';
      }
      const popup = new Popup(popupOpt);
      popup.setLngLat(coordinates).setDOMContent(html).addTo(map);
      this._openedPopup.push([feature, popup]);
    }
  }

  private _getFeatureFromPoint(
    evt: MapEventType['click'] & EventData,
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

  private _onLayerMouseMove(evt: MapEventType['mousemove'] & EventData) {
    const map = this.map;
    if (map) {
      if (this.options.onMouseOver || this.options.selectOnHover) {
        const feature = this._getFeatureFromPoint(evt);
        if (this.options.onMouseOver && this.layer) {
          this.options.onMouseOver({
            event: convertMapClickEvent(evt),
            layer: this,
            feature,
            source: evt,
          });
        }
        if (feature && this.options.selectOnHover) {
          this._featureSelect(feature);
        }
      }
      if (this.options.selectable) {
        map.getCanvas().style.cursor = 'pointer';
      }
    }
  }

  private _onLayerMouseLeave(evt: MapEventType['mousemove'] & EventData) {
    if (this.map) {
      if (this.options.onMouseOut) {
        this.options.onMouseOut({
          event: convertMapClickEvent(evt),
          layer: this,
          source: evt,
        });
      }
      this.map.getCanvas().style.cursor = '';
    }
    if (this.options.selectOnHover) {
      this.unselect();
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
