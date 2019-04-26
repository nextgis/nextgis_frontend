import { GeoJsonObject, GeoJsonGeometryTypes, FeatureCollection, GeometryCollection, Feature } from 'geojson';
import {
  MapAdapter,
  Type,
  LayerAdapter,
  BaseLayerAdapter,
} from '@nextgis/webmap';
import { CancelablePromise } from '@nextgis/ngw-connector';

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

export function createAsyncAdapter<T extends string = string>(
  type: T, loadFunction: CancelablePromise<any>, map: MapAdapter, onLoad: (data: any) => any): Type<LayerAdapter> {

  const webMapAdapter = map.layerAdapters[type] as Type<BaseLayerAdapter>;

  return class Adapter extends webMapAdapter {
    addLayer(options: any) {
      return loadFunction.then((data) => onLoad(data)).then((opt) => {
        return super.addLayer({ ...options, ...opt });
      });
    }
    beforeRemove() {
      loadFunction.cancel();
    }
  };
}
