import NgwConnector, { GeometryType } from '@nextgis/ngw-connector';
import { createAsyncAdapter } from '../adapters/createAsyncAdapter';
import { NgwWebmapLayerAdapter } from '../NgwWebmapLayerAdapter';

import type { Type } from '@nextgis/utils';
import type { WebMap, VectorAdapterLayerType } from '@nextgis/webmap';
import type {
  ResourceAdapter,
  NgwLayerOptions,
  NgwWebmapAdapterOptions,
} from '../interfaces';

export function updateImageParams(
  params: Record<string, any>,
  resourceId: number,
): Record<string, any> {
  const { bbox, width, height, nd } = params;
  return {
    resource: resourceId,
    extent: bbox,
    size: width + ',' + height,
    timestamp: Date.now(),
    nd,
  };
}

export const vectorLayerGeomToPaintTypeAlias: Record<
  GeometryType,
  VectorAdapterLayerType
> = {
  POINT: 'point',
  LINESTRING: 'line',
  POLYGON: 'polygon',
  MULTIPOINT: 'point',
  MULTILINESTRING: 'line',
  MULTIPOLYGON: 'polygon',
  POINTZ: 'point',
  LINESTRINGZ: 'line',
  POLYGONZ: 'polygon',
  MULTIPOINTZ: 'point',
  MULTILINESTRINGZ: 'line',
  MULTIPOLYGONZ: 'polygon',
};

export function createNgwLayerAdapter(
  options: NgwLayerOptions,
  webMap: WebMap,
  connector: NgwConnector,
): Promise<Type<ResourceAdapter> | undefined> {
  const headers = connector.getAuthorizationHeaders();
  if (headers) {
    options.headers = headers;
  }

  return createAsyncAdapter(options, webMap, connector);
}

/** @deprecated use {@link createNgwLayerAdapter} instead */
export function addNgwLayer(
  options: NgwLayerOptions,
  webMap: WebMap,
  connector: NgwConnector,
): Promise<Type<ResourceAdapter> | undefined> {
  return createNgwLayerAdapter(options, webMap, connector);
}

export interface ExtendNgwWebmapLayerAdapterOptions {
  webMap: WebMap;
  connector: NgwConnector;
  baseUrl?: string;
}

export function extendNgwWebmapLayerAdapter(
  opt: ExtendNgwWebmapLayerAdapterOptions,
): Type<NgwWebmapLayerAdapter> {
  class A extends NgwWebmapLayerAdapter {
    constructor(map: any, options: NgwWebmapAdapterOptions) {
      options = { ...opt, ...options };
      super(map, options);
    }
  }
  return A;
}

let _pixelsInMeter: number;

export function pixelsInMeterWidth(): number {
  if (_pixelsInMeter === undefined) {
    const div = document.createElement('div');
    div.style.cssText =
      'position: absolute;  left: -100%;  top: -100%;  width: 100cm;';
    document.body.appendChild(div);
    const px = div.offsetWidth;
    document.body.removeChild(div);
    _pixelsInMeter = px;
  }
  return _pixelsInMeter;
}

// Returns width of map in meters on specified latitude.
export function getMapWidthForLanInMeters(lat: number): number {
  return 6378137 * 2 * Math.PI * Math.cos((lat * Math.PI) / 180);
}

export function getZoomFromScale(scale: number): number {
  return Math.log(scale / 256) / Math.LN2;
}

export function setScaleRatio(scale: number, lat = 0): number {
  // TODO: get real center
  // webmap does not contain center yet
  // const center = [104, 45]; // this.webMap.getCenter();

  const centerLat = lat;
  const crsScale =
    (pixelsInMeterWidth() * getMapWidthForLanInMeters(centerLat)) / scale;
  const zoom = getZoomFromScale(crsScale);
  return zoom;

  // return Math.round(Math.log(591657550.5 / (scale / 2)) / Math.log(2));
}
