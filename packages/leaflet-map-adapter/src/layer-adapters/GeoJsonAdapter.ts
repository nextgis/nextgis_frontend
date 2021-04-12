import {
  CircleMarker,
  FeatureGroup,
  DomEvent,
  GeoJSON,
  DivIcon,
  Marker,
} from 'leaflet';
import { isPaintCallback, isPaint } from '@nextgis/paint';
import { BaseAdapter } from './BaseAdapter';
import {
  PAINT,
  typeAlias,
  detectType,
  filterGeometries,
  convertMapClickEvent,
} from '../utils/utils';

import type { GeoJsonObject, Feature, Point } from 'geojson';
import type {
  CircleMarkerOptions,
  LeafletMouseEvent,
  LatLngExpression,
  GeoJSONOptions,
  PathOptions,
  LatLng,
  Layer,
  Map,
} from 'leaflet';
import type {
  Paint,
  IconPaint,
  PathPaint,
  VectorAdapterLayerPaint,
} from '@nextgis/paint';
import type {
  VectorAdapterLayerType,
  GeoJsonAdapterOptions,
  VectorLayerAdapter,
  LngLatBoundsArray,
  LayerDefinition,
  DataLayerFilter,
  PopupOptions,
} from '@nextgis/webmap';

type LayerMem = LayerDefinition<Feature>;

export class GeoJsonAdapter
  extends BaseAdapter<GeoJsonAdapterOptions>
  implements VectorLayerAdapter<Map> {
  layer: FeatureGroup;
  selected = false;

  private paint?: Paint;
  private selectedPaint?: Paint;
  private type?: VectorAdapterLayerType;

  private _layers: LayerMem[] = [];
  private _selectedLayers: LayerMem[] = [];
  private _filteredLayers: LayerMem[] = [];
  private _filterFun?: DataLayerFilter<Feature>;

  constructor(map: L.Map, options: GeoJsonAdapterOptions) {
    super(map, options);
    this.layer = new FeatureGroup([], { pane: this.pane });
  }

  addLayer(options: GeoJsonAdapterOptions): FeatureGroup<any> | undefined {
    if (options) {
      this.options = options;
      this.paint = options.paint;

      this.selectedPaint = options.selectedPaint;
      options.paint = this.paint;

      if (options.data) {
        this.addData(options.data);
      }
      return this.layer;
    }
  }

  select(findFeatureFun?: DataLayerFilter): void {
    if (findFeatureFun) {
      const feature = this._layers.filter(findFeatureFun);
      feature.forEach((x) => {
        this._selectLayer(x.layer);
      });
    } else if (!this.selected) {
      this.selected = true;
      if (this.selectedPaint) {
        this.setPaintEachLayer(this.selectedPaint);
      }
    }
  }

  unselect(findFeatureFun?: DataLayerFilter): void {
    if (findFeatureFun) {
      const feature = this._layers.filter(findFeatureFun);
      feature.forEach((x) => {
        this._unSelectLayer(x.layer);
      });
    } else if (this.selected) {
      this.selected = false;
      if (this.paint) {
        this.setPaintEachLayer(this.paint);
      }
    }
  }

  getSelected(): LayerDefinition<Feature, LayerMem>[] {
    return this._selectedLayers.map((x) => {
      return { feature: x.feature, layer: x };
    });
  }

  getFiltered(): LayerMem[] {
    return this._filteredLayers;
  }

  filter(fun?: DataLayerFilter): LayerMem[] {
    // Some optimization
    this._filterFun = fun;
    // @ts-ignore
    const _map = this.layer._map;
    if (_map) {
      this.layer.remove();
    }
    const filteredLayers: LayerMem[] = [];
    this._layers.forEach(({ feature, layer }) => {
      if (layer) {
        const ok = fun ? fun({ feature, layer }) : true;
        if (ok) {
          this.layer.addLayer(layer);
          filteredLayers.push({ feature, layer });
        } else {
          this.layer.removeLayer(layer);
        }
      }
    });
    this._filteredLayers = filteredLayers;
    if (_map) {
      this.layer.addTo(_map);
    }
    return this._filteredLayers;
  }

  cleanFilter(): void {
    this.filter();
  }

  getLayers(): LayerDefinition<Feature, LayerMem>[] {
    return this._layers.map(({ layer, feature }) => {
      // @ts-ignore
      const visible = layer && layer._map;
      return {
        feature,
        layer,
        visible,
      };
    });
  }

  clearLayer(cb?: (feature: Feature) => boolean): void {
    if (cb) {
      for (let fry = this._layers.length; fry--; ) {
        const layerMem = this._layers[fry];
        const exist = layerMem.feature && cb(layerMem.feature);
        if (exist) {
          this.layer.removeLayer(layerMem.layer);
          this._layers.splice(fry, 1);
        }
      }
    } else {
      this.layer.clearLayers();
      this._layers = [];
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
          geoJsonOptions = this.getGeoJsonOptions(options, type);
        }
      }
      new GeoJSON(data || undefined, geoJsonOptions);
    }
  }

  openPopup(findFeatureFun: DataLayerFilter, options?: PopupOptions): void {
    if (findFeatureFun) {
      const feature = this._layers.filter(findFeatureFun);
      feature.forEach((x) => {
        this._openPopup(x.layer, options);
      });
    }
  }

  closePopup(findFeatureFun?: DataLayerFilter): void {
    const featuresToClosePopup = findFeatureFun
      ? this._layers.filter(findFeatureFun)
      : this._layers;

    featuresToClosePopup.forEach((x) => {
      this._closePopup(x.layer);
    });
  }

  updateTooltip(layerDef?: LayerDefinition): void {
    if (layerDef) {
      this._updateTooltip(layerDef);
    } else {
      this.getLayers().forEach((x) => this._updateTooltip(x));
    }
  }

  getExtent(): LngLatBoundsArray | undefined {
    const bounds = this.layer.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    if (ne && sw) {
      return [sw.lng, sw.lat, ne.lng, ne.lat];
    }
  }

  private _updateTooltip(layerDef: LayerDefinition) {
    const { feature, layer } = layerDef;
    if (this.options.labelField && feature && feature.properties) {
      layer.unbindTooltip();
      const message = feature.properties[this.options.labelField];
      if (message !== undefined) {
        layer.bindTooltip(String(message), { permanent: true }).openTooltip();
      }
    }
  }

  private async _openPopup(layer: Layer, options?: PopupOptions) {
    // @ts-ignore
    const feature = layer.feature;
    options = options || {};
    const { minWidth, autoPan } = { minWidth: 300, ...options };
    const content =
      options && options.createPopupContent
        ? await options.createPopupContent({ layer, feature, target: this })
        : '';
    if (content) {
      const popup = layer.bindPopup(content, { minWidth, autoPan });
      setTimeout(() => {
        popup.openPopup();
      }, 0);
    }
  }

  private _closePopup(layer: Layer) {
    layer.closePopup().unbindPopup();
  }

  private setPaintEachLayer(paint: Paint) {
    this.layer.eachLayer((l) => {
      this.setPaint(l, paint);
    });
  }

  private setPaint(l: any, paint: Paint) {
    let style: VectorAdapterLayerPaint | undefined = undefined;
    if (isPaintCallback(paint)) {
      style = paint(l.feature);
    } else if (isPaint(paint)) {
      style = paint;
    }
    if (style) {
      if (this.type === 'point' && style.type === 'icon') {
        const marker = l as Marker;
        const divIcon = this.createDivIcon(style);
        marker.setIcon(divIcon);
      } else if ('setStyle' in l) {
        l.setStyle(this.preparePaint(style));
      }
    }
  }

  private preparePaint(paint: VectorAdapterLayerPaint): PathOptions {
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
      aliases.forEach(([to, from]: [keyof PathOptions, keyof PathPaint]) => {
        const paintProp = (paint as PathPaint)[from];
        if (paintProp !== undefined) {
          Object.defineProperty(readyPaint, to, {
            enumerable: true,
            value: paintProp,
          });
        }
      });

      return readyPaint;
    }
    return PAINT;
  }

  private getGeoJsonOptions(
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
          const pointToLayer = this.createPaintToLayer(iconOpt as IconPaint);
          return pointToLayer(feature, latLng);
        };
      } else {
        lopt = {
          style: (feature) => {
            if (feature) {
              return this.preparePaint({ ...PAINT, ...paint(feature) });
            } else {
              return this.preparePaint({ ...PAINT, type: 'path' });
            }
          },
        };
      }
    } else {
      lopt = this.createPaintOptions(paint as VectorAdapterLayerPaint, type);
    }

    lopt.onEachFeature = (feature: Feature, layer) => {
      // @ts-ignore
      layer.options.pane = this.pane;
      this._layers.push({ feature, layer });
      let ok = true;
      if (this._filterFun) {
        ok = this._filterFun({ feature, layer });
      }
      if (ok) {
        // @ts-ignore
        layer.options.interactive =
          this.options.selectable || this.options.interactive;
        this.layer.addLayer(layer);
        if (options.selectable) {
          if (options.selectOnHover) {
            layer.on('mouseover', () => {
              this._selectLayer(layer);
            });
            layer.on('mouseout', () => {
              this._unSelectLayer(layer);
            });
          } else {
            layer.on(
              'click',
              (e) => this._onLayerClick(e as LeafletMouseEvent),
              this,
            );
          }
        }
        if (this.options.popup) {
          this._openPopup(layer, this.options.popupOptions);
        }
        this._updateTooltip({ layer, feature });
      }
    };

    return lopt;
  }

  private _onLayerClick(e: LeafletMouseEvent) {
    DomEvent.stopPropagation(e);
    const layer = e.target;
    let isSelected = this._selectedLayers.indexOf(layer) !== -1;
    if (isSelected) {
      if (this.options && this.options.unselectOnSecondClick) {
        this._unSelectLayer(layer);
        isSelected = false;
      }
    } else {
      this._selectLayer(layer);
      isSelected = true;
    }
    if (this.options.onLayerClick) {
      this.options.onLayerClick({
        layer: this,
        feature: layer.feature,
        selected: isSelected,
        event: convertMapClickEvent(e),
        source: e,
      });
    }
  }

  private _selectLayer(layer: any) {
    if (this.options && !this.options.multiselect) {
      this._selectedLayers.forEach((x) => this._unSelectLayer(x));
    }
    this._selectedLayers.push(layer);
    this.selected = true;
    if (this.options) {
      if (this.options.selectedPaint) {
        this.setPaint(layer, this.options.selectedPaint);
      }
      if (this.options.popupOnSelect) {
        this._openPopup(layer, this.options.popupOptions);
      }
    }
  }

  private _unSelectLayer(layer: any) {
    const index = this._selectedLayers.indexOf(layer);
    if (index !== -1) {
      this._selectedLayers.splice(index, 1);
    }
    this.selected = this._selectedLayers.length > 0;
    if (this.options) {
      if (this.options.paint) {
        this.setPaint(layer, this.options.paint);
      }

      if (this.options.popupOnSelect) {
        this._closePopup(layer);
      }
    }
  }

  private createDivIcon(icon: IconPaint) {
    const { ...toLIconOpt } = icon;
    return new DivIcon({ className: '', ...toLIconOpt });
  }

  private createPaintToLayer(icon: IconPaint) {
    if (icon && icon.type) {
      if (icon.type === 'icon') {
        const iconClassName = icon.className;
        const html = icon.html;
        if (iconClassName || html) {
          return (geoJsonPoint: any, latlng: LatLngExpression) => {
            const divIcon = this.createDivIcon(icon);
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
      return new CircleMarker(latlng, this.preparePaint({ ...p, ...icon }));
    };
  }

  private createPaintOptions(
    paintOptions: VectorAdapterLayerPaint,
    type: VectorAdapterLayerType,
  ): GeoJSONOptions {
    const geoJsonOptions: GeoJSONOptions = {};
    const paint = (paintOptions && this.preparePaint(paintOptions)) || {};
    if (paintOptions) {
      geoJsonOptions.style = () => {
        return paint;
      };
    }
    if (type === 'point') {
      (geoJsonOptions as any).pointToLayer = this.createPaintToLayer(
        paintOptions as IconPaint,
      );
    } else if (type === 'line') {
      paint.stroke = true;
    }
    return geoJsonOptions;
  }
}
