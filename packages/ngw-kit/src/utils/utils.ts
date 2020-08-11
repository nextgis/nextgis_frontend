import {
  WebMap,
  Type,
  LngLatBoundsArray,
  VectorAdapterLayerType,
} from '@nextgis/webmap';
import NgwConnector, {
  WebmapResource,
  ResourceItem,
  GeometryType,
} from '@nextgis/ngw-connector';
import {
  NgwLayerOptions,
  NgwWebmapAdapterOptions,
  ResourceAdapter,
} from '../interfaces';
import { createAsyncAdapter } from '../adapters/createAsyncAdapter';
import { NgwWebmapLayerAdapter } from '../NgwWebmapLayerAdapter';

export function updateImageParams(
  params: Record<string, any>,
  resourceId: number
): Record<string, any> {
  const { bbox, width, height } = params;
  return {
    resource: resourceId,
    extent: bbox,
    size: width + ',' + height,
    timestamp: Date.now(),
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

export function addNgwLayer(
  options: NgwLayerOptions,
  webMap: WebMap,
  connector: NgwConnector
): Promise<Type<ResourceAdapter> | undefined> {
  const headers = connector.getAuthorizationHeaders();
  if (headers) {
    options.headers = headers;
  }

  return createAsyncAdapter(options, webMap, connector);
}

export function getNgwWebmapExtent(
  webmap: WebmapResource
): LngLatBoundsArray | undefined {
  const bottom = webmap['extent_bottom'];
  const left = webmap['extent_left'];
  const top = webmap['extent_top'];
  const right = webmap['extent_right'];
  if (bottom && left && top && right) {
    const extent: LngLatBoundsArray = [left, bottom, right, top];
    if (extent[3] > 82) {
      extent[3] = 82;
    }
    if (extent[1] < -82) {
      extent[1] = -82;
    }
    return extent;
  }
}

export function getNgwLayerExtent(
  id: number,
  connector: NgwConnector
): Promise<LngLatBoundsArray | undefined> {
  return connector.get('layer.extent', null, { id }).then((resp) => {
    if (resp) {
      const { maxLat, maxLon, minLat, minLon } = resp.extent;
      const extenrArray: LngLatBoundsArray = [minLon, minLat, maxLon, maxLat];
      return extenrArray;
    }
  });
}

export async function getNgwResourceExtent(
  item: ResourceItem,
  connector: NgwConnector
): Promise<LngLatBoundsArray | undefined> {
  if (item.webmap) {
    return getNgwWebmapExtent(item.webmap);
  } else {
    const resource = item.resource;
    if (resource.cls.indexOf('style') !== -1) {
      return connector.getResource(resource.parent.id).then((res) => {
        if (res) {
          return getNgwLayerExtent(res.resource.id, connector);
        }
      });
    } else {
      return getNgwLayerExtent(resource.id, connector);
    }
  }
}

export interface ExtendNgwWebmapLayerAdapterOptions {
  webMap: WebMap;
  connector: NgwConnector;
  baseUrl?: string;
}

export function extendNgwWebmapLayerAdapter(
  opt: ExtendNgwWebmapLayerAdapterOptions
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

type Ctor = any;

export function applyMixins(derivedCtor: Ctor, baseCtors: Ctor[]): void {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        baseCtor.prototype,
        name
      );
      if (descriptor) {
        Object.defineProperty(derivedCtor.prototype, name, descriptor);
      }
    });
  });
}

// Returns width of map in meters on specified latitude.
export function getMapWidthForLanInMeters(lat: number): number {
  return 6378137 * 2 * Math.PI * Math.cos((lat * Math.PI) / 180);
}

export function getZoomFromScale(scale: number): number {
  return Math.log(scale / 256) / Math.LN2;
}

export function setScaleRatio(scale: number, lat = 104): number {
  // TODO: get real center
  // webmap does not contain center yet
  // const center = [104, 45]; // this.webMap.getCenter();
  if (lat) {
    const centerLat = lat;
    const crsScale =
      (pixelsInMeterWidth() * getMapWidthForLanInMeters(centerLat)) / scale;
    const zoom = getZoomFromScale(crsScale);
    return zoom;
  }
  return Math.round(Math.log(591657550.5 / (scale / 2)) / Math.log(2));
}
