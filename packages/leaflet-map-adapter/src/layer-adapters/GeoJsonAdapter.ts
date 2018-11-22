import {
  LayerAdapter,
  GeoJsonAdapterOptions,
  GeoJsonAdapterLayerPaint,
  GeoJsonAdapterLayerType
} from '@nextgis/webmap';
import { GeoJSON, CircleMarker, GeoJSONOptions, PathOptions } from 'leaflet';
import { BaseAdapter } from './BaseAdapter';
import { GeoJsonObject, GeoJsonGeometryTypes, FeatureCollection, Feature, GeometryCollection } from 'geojson';

let ID = 1;

const PAINT = {
  color: 'blue',
  opacity: 1,
  stroke: false
};

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

export class GeoJsonAdapter extends BaseAdapter implements LayerAdapter {

  name: string;

  addLayer(options?: GeoJsonAdapterOptions) {

    this.name = options.id || 'geojson-' + ID++;

    let type: GeoJsonAdapterLayerType = options.type;

    if (!type) {
      const detectedType = detectType(options.data);
      type = typeAlias[detectedType];
    }

    const data = filterGeometries(options.data, type);
    if (data) {
      const geoJsonOptions: GeoJSONOptions = {};
      const paint = preparePaint(options.paint);
      if (options.paint) {
        geoJsonOptions.style = (feature) => {
          return paint;
        };
      }
      if (type === 'circle') {
        geoJsonOptions.pointToLayer = (geoJsonPoint, latlng) => {
          return new CircleMarker(latlng, paint);
        };
      } else if (type === 'line') {
        paint.stroke = true;
      }

      const layer = new GeoJSON(data, geoJsonOptions);

      return layer;
    }
  }
}

function preparePaint(paint: GeoJsonAdapterLayerPaint): PathOptions {
  const path: PathOptions = { ...PAINT, ...paint };
  if (path.opacity) {
    path.fillOpacity = path.opacity;
  }
  return path;
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
