import {
  LayerAdapter,
  GeoJsonAdapterOptions,
  GeoJsonAdapterLayerPaint,
  GeoJsonAdapterLayerType,
  IconOptions,
  GetPaintCallback
} from '@nextgis/webmap';
import {
  GeoJSON,
  CircleMarker, GeoJSONOptions,
  PathOptions,
  CircleMarkerOptions,
  DivIcon,
  Marker,
  GridLayer,
  Layer,
  DomEvent
} from 'leaflet';
import { BaseAdapter } from './BaseAdapter';
import { GeoJsonObject, GeoJsonGeometryTypes, FeatureCollection, Feature, GeometryCollection } from 'geojson';

let ID = 1;

const typeAlias: { [x: string]: GeoJsonAdapterLayerType } = {
  'Point': 'circle',
  'LineString': 'line',
  'MultiPoint': 'circle',
  'Polygon': 'fill',
  'MultiLineString': 'line',
  'MultiPolygon': 'fill'
};

const PAINT = {
  stroke: false,
  fillOpacity: 1
};

const backAliases = {};
for (const a in typeAlias) {
  if (typeAlias.hasOwnProperty(a)) {
    backAliases[typeAlias[a]] = backAliases[typeAlias[a]] || [];
    backAliases[typeAlias[a]].push(a);
  }
}

export class GeoJsonAdapter extends BaseAdapter implements LayerAdapter {
  options: GeoJsonAdapterOptions;
  name: string;
  paint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  selectedPaint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  layer: GeoJSON;
  type: GeoJsonAdapterLayerType;
  selected = false;

  private _selectedLayers: Layer[] = [];

  addLayer(options?: GeoJsonAdapterOptions) {
    this.options = options;
    this.paint = options.paint;

    this.selectedPaint = options.selectedPaint;
    options.paint = this.paint;

    this.name = options.id || 'geojson-' + ID++;

    let type: GeoJsonAdapterLayerType = options.type;

    if (!type) {
      const detectedType = detectType(options.data);
      type = typeAlias[detectedType];
    }
    this.type = type;

    const data = filterGeometries(options.data, type);
    if (data) {
      const layer = new GeoJSON(data, this.getGeoJsonOptions(options, type));
      this.layer = layer;
      return layer;
    }
  }

  select() {
    if (!this.selected) {
      this.selected = true;
      if (this.selectedPaint) {
        this.setPaintEachLayer(this.selectedPaint);
      }
    }
  }

  unselect() {
    if (this.selected) {
      this.selected = false;
      this.setPaintEachLayer(this.paint);
    }
  }

  private setPaintEachLayer(paint: GetPaintCallback | GeoJsonAdapterLayerPaint) {
    this.layer.eachLayer((l) => {
      this.setPaint(l, paint);
    });
  }

  private setPaint(l, paint: GetPaintCallback | GeoJsonAdapterLayerPaint) {
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
      l.setStyle(style);
    }
  }

  private preparePaint(paint): PathOptions {
    const path: CircleMarkerOptions | PathOptions = paint;
    if (path.opacity) {
      path.fillOpacity = path.opacity;
    }
    return path;
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
            return { ...PAINT, ...paint(feature) };
          }
        };
      }
    } else {
      lopt = this.createPaintOptions((paint as GeoJsonAdapterLayerPaint), type);
    }
    if (options.selectable) {
      lopt.onEachFeature = (feature, layer) => {
        layer.on('click', this._onLayerClick, this);
      };
    }
    return lopt;
  }

  private _onLayerClick(e) {
    DomEvent.stopPropagation(e);
    const layer = e.target as Layer;
    const isSelected = this._selectedLayers.indexOf(layer) !== -1;
    if (isSelected) {
      if (this.options.unselectOnSecondClick) {
        this._unselectLayer(layer);
      }
    } else {
      this._selectLayer(layer);
    }

  }

  private _selectLayer(layer) {
    if (!this.options.multipleSelection) {
      this._selectedLayers.forEach((x) => this._unselectLayer(x));
    }
    this._selectedLayers.push(layer);
    if (this.options.selectedPaint) {
      this.setPaint(layer, this.options.selectedPaint);
    }
  }

  private _unselectLayer(layer) {
    const index = this._selectedLayers.indexOf(layer);
    if (index !== -1) {
      this._selectedLayers.splice(index, 1);
    }
    this.setPaint(layer, this.options.paint);
  }

  private createDivIcon(icon: IconOptions) {
    const { type, ...toLIconOpt } = icon;
    return new DivIcon({ className: '', ...toLIconOpt });
  }

  private createPaintToLayer(icon: IconOptions) {
    const iconClassName = icon.className;
    const html = icon.html;
    if (iconClassName || html) {
      return (geoJsonPoint, latlng) => {
        const divIcon = this.createDivIcon(icon);
        return new Marker(latlng, { icon: divIcon });
      };
    }
  }

  private createPaintOptions(paintOptions: GeoJsonAdapterLayerPaint, type: GeoJsonAdapterLayerType): GeoJSONOptions {
    const geoJsonOptions: GeoJSONOptions = {};
    const paint = this.preparePaint(paintOptions);
    const isIcon = paintOptions.type === 'icon';
    if (paintOptions) {
      geoJsonOptions.style = (feature) => {
        return paint;
      };
    }
    if (type === 'circle') {
      if (!isIcon) {
        geoJsonOptions.pointToLayer = (geoJsonPoint, latlng) => {
          return new CircleMarker(latlng, paint);
        };
      } else if (Object.prototype.toString.call(paintOptions) === '[object Object]') {
        geoJsonOptions.pointToLayer = this.createPaintToLayer(paintOptions as IconOptions);
      }
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
  let maxName: string;
  for (const c in counts) {
    if (counts[c] > (counts[maxName] || 0)) {
      maxName = c;
    }
  }
  return maxName as GeoJsonGeometryTypes;
}

function geometryFilter(geometry: GeoJsonGeometryTypes, type: GeoJsonAdapterLayerType): boolean {
  return backAliases[type].indexOf(geometry) !== -1;
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
