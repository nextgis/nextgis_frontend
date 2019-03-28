import { GeoJsonObject, GeoJsonGeometryTypes, FeatureCollection, GeometryCollection, Feature } from 'geojson';
import {
  MapAdapter,
  Type,
  LayerAdapter,
  BaseLayerAdapter,
  GeoJsonAdapterLayerPaint,
  PathPaint,
  CirclePaint,
  Paint
} from '@nextgis/webmap';
import { icon } from 'leaflet';

export function fixUrlStr(url: string) {
  // remove double slash
  return url.replace(/([^:]\/)\/+/g, '$1');
}

export function deepmerge(target: any, src: any, mergeArray = false) {
  const array = Array.isArray(src);
  let dst: any = array && [] || {};

  if (array) {

    if (mergeArray) {
      target = target || [];
      dst = dst.concat(target);
      src.forEach(function (e: any, i: any) {
        if (typeof dst[i] === 'undefined') {
          dst[i] = e;
        } else if (typeof e === 'object') {
          dst[i] = deepmerge(target[i], e, mergeArray);
        } else {
          if (target.indexOf(e) === -1) {
            dst.push(e);
          }
        }
      });
    } else { // Replace array. Do not merge by default
      dst = src;
    }
  } else {
    if (target && typeof target === 'object') {
      Object.keys(target).forEach(function (key) {
        dst[key] = target[key];
      });
    }
    Object.keys(src).forEach(function (key) {
      if (typeof src[key] !== 'object' || !src[key]) {
        dst[key] = src[key];
      } else {
        if (typeof target[key] === 'object' && typeof src[key] === 'object') {
          dst[key] = deepmerge(target[key], src[key], mergeArray);
        } else {
          dst[key] = src[key];
        }
      }
    });
  }
  return dst;
}

export function detectGeometryType(geojson: GeoJsonObject): GeoJsonGeometryTypes {
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

export function findMostFrequentGeomType(arr: GeoJsonGeometryTypes[]): GeoJsonGeometryTypes {
  const counts: { [x: string]: number } = {};
  for (let fry = 0; fry < arr.length; fry++) {
    counts[arr[fry]] = 1 + (counts[arr[fry]] || 0);
  }
  let maxName;
  for (const c in counts) {
    if (counts.hasOwnProperty(c)) {
      const count = maxName !== undefined ? counts[maxName] : 0;
      if (counts[c] > (count || 0)) {
        maxName = c;
      }
    }
  }
  return maxName as GeoJsonGeometryTypes;
}

export function createAsyncAdapter<T extends string = string>(
  type: T, laodFunction: Promise<any>, map: MapAdapter): Type<LayerAdapter> {

  const webMapAdapter = map.layerAdapters[type] as Type<BaseLayerAdapter>;

  return class Adapter extends webMapAdapter {
    addLayer(options: any) {
      return laodFunction.then((opt) => {
        return super.addLayer({ ...options, ...opt });
      });
    }
  };
}
