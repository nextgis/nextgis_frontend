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
  Marker
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

  name: string;
  paint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  selectedPaint?: GeoJsonAdapterLayerPaint | GetPaintCallback;
  layer: GeoJSON;
  type: GeoJsonAdapterLayerType;
  selected = false;

  addLayer(options?: GeoJsonAdapterOptions) {
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
        this.setPaint(this.selectedPaint);
      }
    }
  }

  unselect() {
    if (this.selected) {
      this.selected = false;
      this.setPaint(this.paint);
    }
  }

  private setPaint(paint: GetPaintCallback | GeoJsonAdapterLayerPaint) {
    this.layer.eachLayer((l) => {

      if (this.type === 'circle') {
        const marker = l as Marker;
        let icon;
        if (typeof paint === 'function') {
          icon = paint(marker.feature);
        } else {
          icon = paint;
        }
        const divIcon = this.createDivIcon(icon);
        marker.setIcon(divIcon);
      }
    });

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

    if (typeof paint === 'function') {
      if (type === 'circle') {
        return {
          pointToLayer: (feature, latLng) => {
            const iconOpt = paint(feature);
            const pointToLayer = this.createPaintToLayer(iconOpt as IconOptions);
            return pointToLayer(feature, latLng);
          }
        };
      } else {
        return {
          style: (feature) => {
            return {...PAINT, ...paint(feature)};
          }
        };
      }
    } else {
      return this.createPaintOptions((paint as GeoJsonAdapterLayerPaint), type);
    }
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
