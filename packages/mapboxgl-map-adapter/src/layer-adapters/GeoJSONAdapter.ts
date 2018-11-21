import {
  LayerAdapter,
  GeoJsonAdapterOptions,
  GeoJsonAdapterLayerType,
  GeoJsonAdapterLayerPaint
} from '@nextgis/webmap';
import { BaseAdapter } from './BaseAdapter';
import { GeoJsonObject, GeoJsonGeometryTypes, Feature, FeatureCollection, GeometryCollection } from 'geojson';

let ID = 1;

const typeAlias: { [x: string]: GeoJsonAdapterLayerType } = {
  'Point': 'circle',
  'LineString': 'line',
  'MultiPoint': 'circle',
  'Polygon': 'fill',
  'MultiLineString': 'line',
  'MultiPolygon': 'fill'
};

const backAliases = {};
for (const a in typeAlias) {
  if (typeAlias.hasOwnProperty(a)) {
    backAliases[typeAlias[a]] = backAliases[typeAlias[a]] || [];
    backAliases[typeAlias[a]].push(a);
  }
}

const PAINT = {
  color: 'blue',
  opacity: 1
};

export class GeoJsonAdapter extends BaseAdapter implements LayerAdapter {

  addLayer(options?: GeoJsonAdapterOptions): string {
    this.name = options.id || 'geojson-' + ID++;
    const opt = { ...this.options, ...(options || {}) };

    let type: GeoJsonAdapterLayerType = options.type;

    if (!type) {
      const detectedType = detectType(options.data);
      type = typeAlias[detectedType];
    }

    const data = filterGeometries(options.data, type);
    if (data) {
      this.map.addLayer({
        id: String(this.name),
        type,
        source: {
          type: 'geojson',
          data
        },
        layout: {
          visibility: 'none',
        },
        paint: createPaintForType({ ...PAINT, ...(opt.paint || {}) }, type)
      });
      return this.name;
    } else {
      throw new Error('No geometry for given type');
    }
  }
}

function createPaintForType(paint: GeoJsonAdapterLayerPaint, type: GeoJsonAdapterLayerType) {
  const mapboxPaint = {};
  const allowedParams: Array<[string, string] | string> = ['color', 'opacity'];
  const allowedByType = {
    circle: allowedParams.concat(['radius']),
    line: allowedParams.concat([['weight', 'width']]),
    fill: allowedParams.concat([])
  };
  for (const p in paint) {
    if (paint.hasOwnProperty(p)) {
      const allowedType = allowedByType[type].find((x) => {
        if (typeof x === 'string') {
          return x === p;
        } else if (Array.isArray(x)) {
          return x[0] === p;
        }
      });
      if (allowedType) {
        const paramName = Array.isArray(allowedType) ? allowedType[1] : allowedType;
        mapboxPaint[type + '-' + paramName] = paint[p];
      }
    }
  }
  return mapboxPaint;
}

function geometryFilter(geometry: GeoJsonGeometryTypes, type: GeoJsonAdapterLayerType): boolean {
  return backAliases[type].indexOf(geometry) !== -1;
}

function filterGeometries(data: GeoJsonObject, type: GeoJsonAdapterLayerType): GeoJsonObject | boolean {
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

function detectType(geojson: GeoJsonObject): GeoJsonGeometryTypes {
  let geometry: GeoJsonGeometryTypes;
  if (geojson.type === 'FeatureCollection') {
    const featuresTypes = (geojson as FeatureCollection).features.map((f) => f.geometry.type);
    geometry = fingMostFrequentGeomType(featuresTypes);
  } else if (geojson.type === 'GeometryCollection') {
    const geometryTypes = (geojson as GeometryCollection).geometries.map((g) => g.type);
    geometry = fingMostFrequentGeomType(geometryTypes);
  } else if (geojson.type === 'Feature') {
    geometry = (geojson as Feature).geometry.type;
  } else {
    geometry = geojson.type;
  }
  return geometry;
}

function fingMostFrequentGeomType(arr: GeoJsonGeometryTypes[]): GeoJsonGeometryTypes {
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
