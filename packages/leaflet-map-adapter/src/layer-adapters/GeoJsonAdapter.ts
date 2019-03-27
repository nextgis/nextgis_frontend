import {
  VectorLayerAdapter,
  GeoJsonAdapterOptions,
  GeoJsonAdapterLayerPaint,
  GeoJsonAdapterLayerType,
  IconOptions,
  GetPaintCallback,
  LayerDefinition,
  DataLayerFilter,
  PathPaint
} from '@nextgis/webmap';
import {
  GeoJSON,
  CircleMarker, GeoJSONOptions,
  PathOptions,
  CircleMarkerOptions,
  DivIcon,
  Marker,
  FeatureGroup,
  DomEvent,
  LatLngExpression,
  LeafletEvent,
  Map,
} from 'leaflet';
import { GeoJsonObject, GeoJsonGeometryTypes, FeatureCollection, Feature, GeometryCollection } from 'geojson';
import { BaseAdapter } from './BaseAdapter';

const typeAlias: { [key in GeoJsonGeometryTypes]: GeoJsonAdapterLayerType } = {
  'Point': 'circle',
  'LineString': 'line',
  'MultiPoint': 'circle',
  'Polygon': 'fill',
  'MultiLineString': 'line',
  'MultiPolygon': 'fill',
  'GeometryCollection': 'fill'
};

const PAINT = {
  stroke: false,
  opacity: 1
};

const backAliases: { [key in GeoJsonAdapterLayerType]?: GeoJsonGeometryTypes[] } = {};

for (const a in typeAlias) {
  if (typeAlias.hasOwnProperty(a)) {
    const layerType = typeAlias[a as GeoJsonGeometryTypes];
    const backAlias = backAliases[layerType] || [];
    backAlias.push(a as GeoJsonGeometryTypes);
    backAliases[layerType] = backAlias;
  }
}

type LayerMem = LayerDefinition<Feature>;

export class GeoJsonAdapter extends BaseAdapter<GeoJsonAdapterOptions> implements VectorLayerAdapter<Map> {

  layer: FeatureGroup;
  selected = false;

  private paint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  private selectedPaint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  private type?: GeoJsonAdapterLayerType;

  private _layers: LayerMem[] = [];
  private _selectedLayers: LayerMem[] = [];
  private _filterFun?: DataLayerFilter<Feature>;

  constructor(map: L.Map, options: GeoJsonAdapterOptions) {
    super(map, options);
    this.layer = new FeatureGroup([], { pane: this.pane });
  }

  addLayer(options: GeoJsonAdapterOptions) {
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

  select(findFeatureFun?: DataLayerFilter) {
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

  unselect(findFeatureFun?: DataLayerFilter) {
    if (findFeatureFun) {
      const feature = this._layers.filter(findFeatureFun);
      feature.forEach((x) => {
        this._unselectLayer(x.layer);
      });
    } else if (this.selected) {
      this.selected = false;
      if (this.paint) {
        this.setPaintEachLayer(this.paint);
      }
    }
  }

  getSelected() {
    return this._selectedLayers.map((x) => {
      return { feature: x.feature, layer: x };
    });
  }

  filter(fun?: DataLayerFilter) {
    // Some optimization
    this._filterFun = fun;
    // @ts-ignore
    const _map = this.layer._map;
    if (_map) {
      this.layer.remove();
    }

    this._layers.forEach(({ feature, layer }) => {
      if (layer) {
        const ok = fun ? fun({ feature, layer }) : true;
        if (ok) {
          this.layer.addLayer(layer);
        } else {
          this.layer.removeLayer(layer);
        }
      }
    });
    if (_map) {
      this.layer.addTo(_map);
    }
  }

  cleanFilter() {
    this.filter();
  }

  getLayers() {
    return this._layers.map(({ layer, feature }) => {
      // @ts-ignore
      const visible = layer && layer._map;
      return {
        feature,
        layer,
        visible
      };
    });
  }

  clearLayer(cb?: (feature: Feature) => boolean) {
    if (cb) {
      for (let fry = this._layers.length; fry--;) {
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

  setData(data: GeoJsonObject) {
    this.clearLayer();
    this.addData(data);
  }

  addData(data: GeoJsonObject | false) {
    const options = this.options;
    let geoJsonOptions: GeoJSONOptions | undefined;
    if (options) {

      if (data) {
        let type: GeoJsonAdapterLayerType;

        if (!options.type) {
          const detectedType = detectType(data);
          type = typeAlias[detectedType];
        } else {
          type = options.type;
        }
        this.type = type;

        data = filterGeometries(data, type);
        if (data) {
          geoJsonOptions = this.getGeoJsonOptions(options, type);
        }
      }

      const layer = new GeoJSON(data || undefined, geoJsonOptions);
    }
  }

  private setPaintEachLayer(paint: GetPaintCallback | GeoJsonAdapterLayerPaint) {
    this.layer.eachLayer((l) => {
      this.setPaint(l, paint);
    });
  }

  private setPaint(l: any, paint: GetPaintCallback | GeoJsonAdapterLayerPaint) {
    let style: GeoJsonAdapterLayerPaint;
    if (typeof paint === 'function') {
      style = paint(l.feature);
    } else {
      style = paint;
    }
    if (this.type === 'circle' && style.type === 'icon') {
      const marker = l as Marker;
      const divIcon = this.createDivIcon(style);
      marker.setIcon(divIcon);
    } else if ('setStyle' in l) {
      l.setStyle(this.preparePaint(style));
    }
  }

  private preparePaint(paint: GeoJsonAdapterLayerPaint): PathOptions {
    if (paint.type !== 'get-paint') {
      const path: CircleMarkerOptions | PathOptions = paint as CircleMarkerOptions | PathOptions;
      if (path.opacity) {
        path.fillOpacity = path.opacity;
      }
      const aliases: Array<[keyof PathOptions, keyof PathPaint]> = [
        ['color', 'strokeColor'],
        ['opacity', 'strokeOpacity'],
        ['stroke', 'stroke'],
        ['fillColor', 'color'],
        ['fillOpacity', 'opacity'],
        ['fill', 'fill']
      ];
      const readyPaint: PathOptions = {};
      aliases.forEach(([to, from ]: [keyof PathOptions, keyof PathPaint]) => {
        readyPaint[to] = (paint as any)[from];
      });
      return readyPaint;
    }
    return PAINT;
  }

  private getGeoJsonOptions(options: GeoJsonAdapterOptions, type: GeoJsonAdapterLayerType): GeoJSONOptions {
    const paint = options.paint;
    let lopt: GeoJSONOptions = {};

    if (typeof paint === 'function') {
      if (type === 'circle') {
        lopt = {
          pointToLayer: (feature, latLng) => {
            const iconOpt = paint(feature);
            const pointToLayer = this.createPaintToLayer(iconOpt as IconOptions);
            return pointToLayer(feature, latLng);

          }
        };
      } else {
        lopt = {
          style: (feature) => {
            if (feature) {
              return this.preparePaint({ ...PAINT, ...paint(feature) });
            } else {
              return this.preparePaint({ ...PAINT, type: 'path' });
            }
          }
        };
      }
    } else {
      lopt = this.createPaintOptions((paint as GeoJsonAdapterLayerPaint), type);
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
        this.layer.addLayer(layer);
        if (options.selectable) {
          layer.on('click', this._onLayerClick, this);
        }
      }
    };

    return lopt;
  }

  private _onLayerClick(e: LeafletEvent) {
    DomEvent.stopPropagation(e as Event);
    const layer = e.target;
    let isSelected = this._selectedLayers.indexOf(layer) !== -1;
    if (isSelected) {
      if (this.options && this.options.unselectOnSecondClick) {
        this._unselectLayer(layer);
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
        selected: isSelected
      });
    }
  }

  private _selectLayer(layer: any) {
    if (this.options && !this.options.multiselect) {
      this._selectedLayers.forEach((x) => this._unselectLayer(x));
    }
    this._selectedLayers.push(layer);
    this.selected = true;
    if (this.options && this.options.selectedPaint) {
      this.setPaint(layer, this.options.selectedPaint);
    }
  }

  private _unselectLayer(layer: any) {
    const index = this._selectedLayers.indexOf(layer);
    if (index !== -1) {
      this._selectedLayers.splice(index, 1);
    }
    this.selected = this._selectedLayers.length > 0;
    if (this.options && this.options.paint) {
      this.setPaint(layer, this.options.paint);
    }
  }

  private createDivIcon(icon: IconOptions) {
    const { type, ...toLIconOpt } = icon;
    return new DivIcon({ className: '', ...toLIconOpt });
  }

  private createPaintToLayer(icon: IconOptions) {
    if (icon.type === 'icon') {
      const iconClassName = icon.className;
      const html = icon.html;
      if (iconClassName || html) {
        return (geoJsonPoint: any, latlng: LatLngExpression) => {
          const divIcon = this.createDivIcon(icon);
          return new Marker(latlng, { icon: divIcon });
        };
      }
    }
    return (geoJsonPoint: any, latlng: LatLngExpression) => {
      const p: any = PAINT;
      return new CircleMarker(latlng, this.preparePaint({ ...p, ...icon }));
    };

  }

  private createPaintOptions(paintOptions: GeoJsonAdapterLayerPaint, type: GeoJsonAdapterLayerType): GeoJSONOptions {
    const geoJsonOptions: GeoJSONOptions = {};
    const paint = (paintOptions && this.preparePaint(paintOptions)) || {};
    if (paintOptions) {
      geoJsonOptions.style = (feature) => {
        return paint;
      };
    }
    if (type === 'circle') {
      geoJsonOptions.pointToLayer = this.createPaintToLayer(paintOptions as IconOptions);
    } else if (type === 'line') {
      paint.stroke = true;
    }
    return geoJsonOptions;
  }
}

function detectType(geojson: GeoJsonObject): GeoJsonGeometryTypes {
  let geometry: GeoJsonGeometryTypes;
  if (geojson.type === 'FeatureCollection') {
    const featuresTypes = (geojson as FeatureCollection).features.map((f) => f.geometry.type);
    geometry = findMostFrequentGeomType(featuresTypes);
  } else if (geojson.type === 'GeometryCollection') {
    const geometryTypes = (geojson as GeometryCollection).geometries.map((g) => g.type);
    geometry = findMostFrequentGeomType(geometryTypes);
  } else if (geojson.type === 'Feature') {
    geometry = (geojson as Feature).geometry.type;
  } else {
    geometry = geojson.type;
  }
  return geometry;
}

function findMostFrequentGeomType(arr: GeoJsonGeometryTypes[]): GeoJsonGeometryTypes {
  const counts: { [x: string]: number } = {};
  for (let fry = 0; fry < arr.length; fry++) {
    counts[arr[fry]] = 1 + (counts[arr[fry]] || 0);
  }
  let maxName: string = '';
  for (const c in counts) {
    if (counts.hasOwnProperty(c)) {
      const maxCount = maxName ? counts[maxName] : 0;
      if (counts[c] > maxCount) {
        maxName = c;
      }
    }
  }
  return maxName as GeoJsonGeometryTypes;
}

function geometryFilter(geometry: GeoJsonGeometryTypes, type: GeoJsonAdapterLayerType): boolean {
  const geoJsonGeometry = backAliases[type] || [];
  return geoJsonGeometry.indexOf(geometry) !== -1;
}

function filterGeometries(data: GeoJsonObject, type: GeoJsonAdapterLayerType): GeoJsonObject | false {
  if (data.type === 'FeatureCollection') {
    (data as FeatureCollection).features = (data as FeatureCollection).features
      .filter((f) => geometryFilter(f.geometry.type, type));
  } else if (data.type === 'Feature') {
    const allow = geometryFilter((data as Feature).geometry.type, type);
    if (!allow) {
      return false;
    }
  } else if (data.type === 'GeometryCollection') {
    (data as GeometryCollection).geometries = (data as GeometryCollection).geometries
      .filter((g) => geometryFilter(g.type, type));
  }
  return data;
}
