import {
  CircleMarker,
  FeatureGroup,
  DomEvent,
  GeoJSON,
  DivIcon,
  Marker,
  Layer,
} from 'leaflet';
import { debounce, defined } from '@nextgis/utils';

import { isPaintCallback, isPaint } from '@nextgis/paint';
import {
  PAINT,
  typeAlias,
  filterGeometries,
  createFeaturePositionOptions,
} from '../utils/geometries';
import { createMouseEvent } from '../utils/createMouseEvent';
import { boundsToArray } from '../utils/boundsToArray';
import { detectType } from '../utils/detectType';
import { BaseAdapter } from './BaseAdapter';

import type { GeoJsonObject, Feature, Point } from 'geojson';
import type {
  PopupOptions as LPopupOptions,
  CircleMarkerOptions,
  LeafletMouseEvent,
  LatLngExpression,
  GeoJSONOptions,
  LeafletEvent,
  PathOptions,
  LatLng,
  Path,
  Map,
} from 'leaflet';
import type {
  Paint,
  IconPaint,
  PathPaint,
  VectorAdapterLayerPaint,
} from '@nextgis/paint';
import type { LngLatBoundsArray } from '@nextgis/utils';
import type {
  VectorAdapterLayerType,
  GeoJsonAdapterOptions,
  PopupOnCloseFunction,
  OnLayerMouseOptions,
  VectorLayerAdapter,
  OnLayerSelectType,
  LayerDefinition,
  DataLayerFilter,
  PopupOptions,
} from '@nextgis/webmap';

export type LayerDef = LayerDefinition<Feature, Layer>;

export class GeoJsonAdapter
  extends BaseAdapter<GeoJsonAdapterOptions>
  implements VectorLayerAdapter<Map> {
  layer?: FeatureGroup;
  selected = false;

  private paint?: Paint;
  private selectedPaint?: Paint;
  private type?: VectorAdapterLayerType;

  private _layers: LayerDef[] = [];
  private _selectedLayers: LayerDef[] = [];
  private _filteredLayers: LayerDef[] = [];
  private _filterFun?: DataLayerFilter<Feature>;
  private _openedPopup: [Layer, PopupOnCloseFunction[], LayerDef][] = [];

  private $updateTooltip = debounce(() => {
    this.updateTooltip();
  }, 300);

  constructor(map: L.Map, options: GeoJsonAdapterOptions) {
    super(map, options);
  }

  addLayer(options: GeoJsonAdapterOptions): FeatureGroup<any> | undefined {
    Object.assign(this.options, options);
    this.paint = options.paint;
    this.layer = new FeatureGroup([], {
      ...options.nativeOptions,
      pane: this.pane,
    });
    this.selectedPaint = options.selectedPaint;
    options.paint = this.paint;

    if (options.data) {
      this.addData(options.data);
    }

    this._addMapListener();

    return this.layer;
  }

  beforeRemove(): void {
    this._removeMapListener();
  }

  select(findFeatureFun?: DataLayerFilter): void {
    if (findFeatureFun) {
      const def = this._layers.filter(findFeatureFun);
      def.forEach((x) => {
        this._selectLayer(x, 'api');
      });
    } else if (!this.selected) {
      this.selected = true;
      if (this.selectedPaint) {
        this._setPaintEachLayer(this.selectedPaint);
      }
    }
  }

  unselect(findFeatureFun?: DataLayerFilter): void {
    if (findFeatureFun) {
      const feature = this._layers.filter(findFeatureFun);
      feature.forEach((x) => {
        this._unSelectLayer(x);
      });
    } else if (this.selected) {
      for (const p of this._openedPopup) {
        this._removePopup(p[0]);
      }
      if (this.paint) {
        this._setPaintEachLayer(this.paint);
      }
      this._selectedLayers.length = 0;
      this.selected = false;
    }
  }

  getSelected(): LayerDefinition<Feature, LayerDef>[] {
    return this._selectedLayers.map((x) => {
      return {
        target: this,
        feature: x.feature,
        layer: x,
        ...createFeaturePositionOptions(x.feature),
      };
    });
  }

  getFiltered(): LayerDef[] {
    return this._filteredLayers;
  }

  filter(fun?: DataLayerFilter): LayerDef[] {
    // Some optimization
    this._filterFun = fun;
    const layer_ = this.layer;
    const map = layer_ && (layer_ as any)._map;
    if (layer_ && map) {
      layer_.remove();

      const filteredLayers: LayerDef[] = [];
      this._layers.forEach(({ feature, layer }) => {
        if (layer) {
          const ok = fun
            ? fun({
                target: this,
                feature,
                layer,
                ...createFeaturePositionOptions(feature),
              })
            : true;
          if (ok) {
            layer_.addLayer(layer);
            filteredLayers.push({
              target: this,
              feature,
              layer,
              ...createFeaturePositionOptions(feature),
            });
          } else {
            layer_.removeLayer(layer);
          }
        }
      });
      this._filteredLayers = filteredLayers;

      layer_.addTo(map);
    }
    return this._filteredLayers;
  }

  cleanFilter(): void {
    this.filter();
  }

  getLayers(): LayerDef[] {
    return this._layers.map(({ layer, feature }) => {
      const visible = layer && !!(layer as any)._map;
      return {
        feature,
        layer,
        visible,
        target: this,
        ...createFeaturePositionOptions(feature),
      };
    });
  }

  clearLayer(cb?: (feature: Feature) => boolean): void {
    this.unselect();
    const layer_ = this.layer;
    if (layer_) {
      if (cb) {
        for (let fry = this._layers.length; fry--; ) {
          const def = this._layers[fry];
          if (def) {
            const { feature, layer } = def;
            if (feature && layer) {
              const exist = cb(feature);
              if (exist) {
                layer_.removeLayer(layer);
                this._layers.splice(fry, 1);
              }
            }
          }
        }
      } else {
        layer_.clearLayers();
        this._layers = [];
      }
    }
  }

  setData(data: GeoJsonObject): void {
    this.clearLayer();
    this.addData(data);
  }

  addData(data: GeoJsonObject | false): void {
    const options = this.options;
    let geoJsonOptions: GeoJSONOptions | undefined;
    if (options) {
      if (data) {
        let type: VectorAdapterLayerType;

        if (!options.type) {
          const detectedType = detectType(data);
          type = typeAlias[detectedType];
        } else {
          type = options.type;
        }
        if (this.type && this.type !== type) {
          console.warn('no other data type than layer can be added');
          return;
        }
        this.type = type;

        data = filterGeometries(data, type);
        if (data) {
          geoJsonOptions = this._getGeoJsonOptions(options, type);
        }
      }
      new GeoJSON(data || undefined, geoJsonOptions);
    }
  }

  openPopup(findFeatureFun: DataLayerFilter, options?: PopupOptions): void {
    if (findFeatureFun) {
      const def = this._layers.filter(findFeatureFun);
      def.forEach((x) => {
        this._openPopup(x, options, 'api');
      });
    }
  }

  closePopup(findFeatureFun?: DataLayerFilter): void {
    const popupToClose = findFeatureFun
      ? this._openedPopup.filter((x) => findFeatureFun(x[2]))
      : this._openedPopup;

    popupToClose.forEach((x) => {
      this._removePopup(x[0]);
    });
  }

  updateTooltip(layerDef?: LayerDefinition): void {
    if (layerDef) {
      this._updateTooltip(layerDef);
    } else {
      this.getLayers().forEach((x) =>
        this._updateTooltip({ feature: x.feature, layer: x.layer }),
      );
    }
  }

  /** @deprecated use {@link GeoJsonAdapter.getBounds} instead */
  getExtent(): LngLatBoundsArray | undefined {
    return this.getBounds();
  }

  getBounds(): LngLatBoundsArray | undefined {
    if (this.layer) {
      const bounds = this.layer.getBounds();
      if (bounds.isValid()) {
        return boundsToArray(bounds);
      }
    }
  }

  setOpacity(value: number): void {
    this.options.opacity = value;
    this.setPaint(this.paint);
    this.setSelectedPaint(this.selectedPaint);
  }

  setPaint(paint?: Paint | null): void {
    if (paint) {
      this.paint = paint;
      for (const l of this._layers) {
        this._setPaint(l, paint);
      }
    }
  }
  setSelectedPaint(paint?: Paint | null): void {
    if (paint) {
      this.selectedPaint = paint;
      for (const l of this._selectedLayers) {
        this._setPaint(l, paint);
      }
    }
  }
  updatePaint(paint: Partial<Paint>): void {
    this.paint = { ...this.paint, ...paint } as Paint;
    for (const l of this._layers) {
      this._setPaint(l, this.paint);
    }
  }
  updateSelectedPaint(paint: Partial<Paint>): void {
    this.selectedPaint = { ...this.selectedPaint, ...paint } as Paint;
    for (const l of this._selectedLayers) {
      this._setPaint(l, this.selectedPaint);
    }
  }

  private $unselect = () => {
    this.unselect();
  };

  private _updateTooltip(layerDef: Pick<LayerDef, 'feature' | 'layer'>) {
    const { feature, layer } = layerDef;
    if (feature && layer && feature.properties && this.options.labelField) {
      layer.unbindTooltip();
      const message = feature.properties[this.options.labelField];
      if (message !== undefined) {
        const permanent = !this.options.labelOnHover;

        layer.bindTooltip(String(message), { permanent, sticky: false });
      }
    }
  }

  private async _openPopup(
    def: LayerDef,
    options: PopupOptions = {},
    type: OnLayerSelectType,
    latLng?: LatLngExpression,
  ) {
    const { feature, layer } = def;
    const { minWidth, autoPan, maxWidth, closeButton: closeButton_ } = {
      minWidth: 300,
      ...options,
    };
    const closeButton = closeButton_ ?? !this.options.selectOnHover;
    let popup: Layer;
    const _closeHandlers: PopupOnCloseFunction[] = [];
    const onClose = (handler: PopupOnCloseFunction) => {
      _closeHandlers.push(handler);
    };
    const close = () => {
      if (popup) {
        this._removePopup(popup);
      }
    };
    let content;
    if (options.createPopupContent) {
      content = await options.createPopupContent({
        layer,
        feature,
        target: this,
        type,
        close,
        onClose,
        ...createFeaturePositionOptions(feature),
      });
    } else {
      content = options.popupContent;
    }

    if (content && layer) {
      const popupOptions: LPopupOptions = {
        minWidth,
        autoPan,
        // maxWidth,
        closeButton,
        closeOnClick: false,
        autoClose: false,
      };
      if (defined(maxWidth)) {
        popupOptions.maxWidth = maxWidth;
      }
      popup = layer.bindPopup(content, popupOptions);

      const unselectOnClose =
        this.options.popupOptions?.unselectOnClose ?? true;
      if (unselectOnClose) {
        const p = layer.getPopup();
        p &&
          p.once(
            'remove',
            () => {
              close();
            },
            this,
          );
      }
      this._openedPopup.push([popup, _closeHandlers, def]);
      popup.openPopup(latLng);
    }
  }

  private _removePopup(popup: Layer) {
    const map = this.map;
    if (map) {
      popup.closePopup().unbindPopup();
      const index = this._openedPopup.findIndex((x) => x[0] === popup);
      if (index !== -1) {
        const unselectOnClose =
          this.options.popupOptions?.unselectOnClose ?? true;
        const [, closeHandlers, def] = this._openedPopup[index];
        for (const h of closeHandlers) {
          h(def);
        }
        closeHandlers.length = 0;
        if (unselectOnClose) {
          this._unSelectLayer(def);
        }
        this._openedPopup.splice(index, 1);
      }
    }
  }

  private _setPaintEachLayer(paint: Paint) {
    this._layers.forEach((l) => {
      this._setPaint(l, paint);
    });
  }

  private _setPaint(def: LayerDef, paint: Paint) {
    let style: VectorAdapterLayerPaint | undefined = undefined;
    const { layer, feature } = def;
    if (layer && feature) {
      if (isPaintCallback(paint)) {
        style = paint(feature);
      } else if (isPaint(paint)) {
        style = paint;
      }
      if (style) {
        if (this.type === 'point' && style.type === 'icon') {
          const marker = layer as Marker;
          const divIcon = this._createDivIcon(style);
          marker.setIcon(divIcon);
        } else if ('setStyle' in layer) {
          (layer as Path).setStyle(this._preparePaint(style));
        }
      }
    }
  }

  private _preparePaint(paint: VectorAdapterLayerPaint): PathOptions {
    if (paint.type !== 'get-paint') {
      // const path: CircleMarkerOptions | PathOptions = paint as CircleMarkerOptions | PathOptions;
      // if (path.opacity) {
      //   path.fillOpacity = path.opacity;
      // }

      const paintAliases: [keyof PathOptions, keyof PathPaint][] = [
        // ['color', 'color'],
        ['color', 'strokeColor'],
        ['opacity', 'strokeOpacity'],
        ['stroke', 'stroke'],
        ['fillColor', 'fillColor'],
        ['fillOpacity', 'fillOpacity'],
        ['fill', 'fill'],
        ['weight', 'weight'],
      ];
      const aliases: [keyof PathOptions, keyof PathPaint][] =
        this.type === 'line'
          ? [
              ['color', 'strokeColor'],
              ['opacity', 'strokeOpacity'],
              ['weight', 'weight'],
            ]
          : paintAliases;

      const readyPaint: PathOptions & CircleMarkerOptions = {};

      if ('radius' in paint && typeof paint.radius === 'number') {
        readyPaint.radius = paint.radius;
      }
      for (const [to, from] of aliases) {
        let paintProp = (paint as PathPaint)[from];
        if (
          defined(this.options.opacity) &&
          from.toLowerCase().indexOf('opacity') !== -1
        ) {
          paintProp = Number(paintProp) * this.options.opacity;
        }

        if (paintProp !== undefined) {
          Object.defineProperty(readyPaint, to, {
            enumerable: true,
            value: paintProp,
          });
        }
      }

      return readyPaint;
    }
    return PAINT;
  }

  private _getGeoJsonOptions(
    options: GeoJsonAdapterOptions,
    type: VectorAdapterLayerType,
  ): GeoJSONOptions {
    const paint = options.paint;
    let lopt: GeoJSONOptions = {};

    if (typeof paint === 'function') {
      if (type === 'point') {
        // TODO: fix types (@geoman-io/leaflet-geoman-free)
        (lopt as any).pointToLayer = (
          feature: Feature<Point, any>,
          latLng: LatLng,
        ) => {
          const iconOpt = paint(feature);
          const pointToLayer = this._createPaintToLayer(iconOpt as IconPaint);
          return pointToLayer(feature, latLng);
        };
      } else {
        lopt = {
          style: (feature) => {
            if (feature) {
              return this._preparePaint({ ...PAINT, ...paint(feature) });
            } else {
              return this._preparePaint({ ...PAINT, type: 'path' });
            }
          },
        };
      }
    } else {
      lopt = this._createPaintOptions(paint as VectorAdapterLayerPaint, type);
    }

    lopt.onEachFeature = (feature: Feature, layer) => {
      this._onEachFeature(feature, layer);
    };

    return lopt;
  }

  private _onEachFeature(feature: Feature, layer: Layer) {
    const layer_ = this.layer;
    if (layer_) {
      const def = {
        target: this,
        feature,
        layer,
        ...createFeaturePositionOptions(feature),
      };

      // @ts-ignore
      layer.options.pane = this.pane;
      this._layers.push(def);
      let ok = true;
      if (this._filterFun) {
        ok = this._filterFun(def);
      }
      if (ok) {
        const {
          popup,
          popupOptions,
          selectable,
          interactive,
          selectOnHover,
        } = this.options;
        // @ts-ignore
        layer.options.interactive = defined(interactive) ? interactive : true;
        layer_.addLayer(layer);
        if (selectable) {
          if (selectOnHover) {
            layer.on('mouseover', () => {
              this._selectLayer(def, 'hover');
            });
            layer.on('mouseout', () => {
              this._unSelectLayer(def);
            });
          } else {
            layer.on(
              'click',
              (e) => this._selectOnLayerClick(e as LeafletMouseEvent),
              this,
            );
          }
        }
        this._handleMouseEvents(layer);
        // The timeout is needed to display the popup immediately when adding a layer to the map.
        // Without a timeout, the layer may not yet have a _map object
        setTimeout(() => {
          if (popup) {
            this._openPopup(
              {
                target: this,
                layer,
                feature,
                ...createFeaturePositionOptions(feature),
              },
              popupOptions,
              'api',
            );
          }
          this._updateTooltip({ layer, feature });
        });
      }
    }
  }

  private _handleMouseEvents(layer: Layer) {


    const { onClick, onLayerClick, onMouseOut, onMouseOver } = this.options;
    // TODO: remove backward compatibility for onLayerClick
    const onClick_ = onClick || onLayerClick;
    if (onClick_) {
      layer.on(
        'click',
        (e) => {
          const selected = !!this._getSelected(layer);
          onClick_({
            selected,
            ...this._createMouseEvent(e),
          });
        },
        this,
      );
    }
    if (onMouseOut) {
      layer.on(
        'mouseout',
        (e) => {
          onMouseOut(this._createMouseEvent(e));
        },
        this,
      );
    }
    if (onMouseOver) {
      layer.on(
        'mouseover',
        (e) => {
          onMouseOver(this._createMouseEvent(e));
        },
        this,
      );
    }
  }

  private _createMouseEvent(source: LeafletEvent): OnLayerMouseOptions {
    return createMouseEvent({
      layer: this,
      source: source as LeafletMouseEvent,
    });
  }

  private _getSelected(layer: LayerDef["layer"]) {
    return this._selectedLayers.find((x) => x.layer === layer);
  }

  private _selectOnLayerClick(e: LeafletMouseEvent) {
    DomEvent.stopPropagation(e);
    const layer = e.target as Layer;
    const feature = (layer as any).feature;
    const def: LayerDef = {
      target: this,
      layer,
      feature,
      ...createFeaturePositionOptions(feature),
    };
    const isSelected = this._getSelected(layer);
    if (isSelected) {
      if (this.options && this.options.unselectOnSecondClick) {
        this._unSelectLayer(isSelected);
      }
    } else {
      this._selectLayer(def, 'click', e.latlng);
    }
  }

  private _selectLayer(
    def: LayerDef,
    type: OnLayerSelectType,
    latlng?: LatLngExpression,
  ) {
    this.map._addUnselectCb(() => {
      this._unSelectLayer(def);
    });
    if (this.options && !this.options.multiselect) {
      this._selectedLayers.forEach((x) => this._unSelectLayer(x));
    }
    this._selectedLayers.push(def);
    this.selected = true;
    const { selectedPaint, popupOnSelect, popupOptions } = this.options;

    if (selectedPaint && def.layer) {
      this._setPaint(def, selectedPaint);
    }
    if (popupOnSelect) {
      this._openPopup(def, popupOptions, type, latlng);
    }
    if (this.options.onSelect) {
      const features = def.feature ? [def.feature] : [];
      this.options.onSelect({
        type,
        layer: this,
        features,
        ...createFeaturePositionOptions(features),
      });
    }
  }

  private _unSelectLayer(def: LayerDef) {
    const index = this._selectedLayers.indexOf(def);
    if (index !== -1) {
      this._selectedLayers.splice(index, 1);
      if (this.options) {
        if (this.options.paint) {
          this._setPaint(def, this.options.paint);
        }

        if (this.options.popupOnSelect && def.layer) {
          this._removePopup(def.layer);
        }
      }
    }
    this.selected = this._selectedLayers.length > 0;
  }

  private _createDivIcon(icon: IconPaint) {
    const { ...toLIconOpt } = icon;
    return new DivIcon({ className: '', ...toLIconOpt });
  }

  private _createPaintToLayer(icon: IconPaint) {
    if (icon && icon.type) {
      if (icon.type === 'icon') {
        const iconClassName = icon.className;
        const html = icon.html;
        if (iconClassName || html) {
          return (geoJsonPoint: any, latlng: LatLngExpression) => {
            const divIcon = this._createDivIcon(icon);
            return new Marker(latlng, { icon: divIcon });
          };
        }
      } else if (icon.type === 'pin') {
        return (geoJsonPoint: any, latlng: LatLngExpression) => {
          // const divIcon = this.createDivIcon(icon);
          return new Marker(latlng);
        };
      }
    }
    return (geoJsonPoint: any, latlng: LatLngExpression) => {
      const p: any = PAINT;
      return new CircleMarker(latlng, this._preparePaint({ ...p, ...icon }));
    };
  }

  private _createPaintOptions(
    paintOptions: VectorAdapterLayerPaint,
    type: VectorAdapterLayerType,
  ): GeoJSONOptions {
    const geoJsonOptions: GeoJSONOptions = {};
    const paint = (paintOptions && this._preparePaint(paintOptions)) || {};
    if (paintOptions) {
      geoJsonOptions.style = () => {
        return paint;
      };
    }
    if (type === 'point') {
      (geoJsonOptions as any).pointToLayer = this._createPaintToLayer(
        paintOptions as IconPaint,
      );
    } else if (type === 'line') {
      paint.stroke = true;
    }
    return geoJsonOptions;
  }

  private _addMapListener() {
    const map = this.map;
    if (map) {
      const { labelField, labelOnHover, unselectOnClick } = this.options;
      const uoc = unselectOnClick ?? true;
      if (uoc) {
        map.on('click', this.$unselect);
      }
      if (labelField && !labelOnHover) {
        map.on('zoomend', this.$updateTooltip);
        map.on('moveend', this.$updateTooltip);
      }
    }
  }

  private _removeMapListener() {
    this.map.off('zoomend', this.$updateTooltip);
    this.map.off('moveend', this.$updateTooltip);
    this.map.off('click', this.$unselect);
  }
}
