import WebMap, {
  Type,
  LayerAdapter,
  LngLatBoundsArray,
  MapClickEvent
} from '@nextgis/webmap';
import NgwConnector, { WebmapResource, ResourceItem, FeatureLayersIdentify } from '@nextgis/ngw-connector';
import { createAsyncAdapter } from './createAsyncAdapter';
import { NgwLayerOptions, WebMapAdapterOptions, IdentifyRequestOptions, ResourceAdapter } from './interfaces';
import { WebMapLayerAdapter } from './WebMapLayerAdapter';
// @ts-ignore
import { toWgs84 as WGS84 } from 'reproject';
import { GeoJsonObject } from 'geojson';

const epsg = {
  // tslint:disable-next-line:max-line-length
  'EPSG:3857': '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'
};

export function toWgs84(geojson: GeoJsonObject) {
  return WGS84(geojson, epsg['EPSG:3857'], epsg);
}

export function fixUrlStr(url: string) {
  // remove double slash
  return url.replace(/([^:]\/)\/+/g, '$1');
}

export function updateWmsParams(params: any, resourceId: number) {
  const { bbox, width, height } = params;
  return {
    resource: resourceId,
    extent: bbox,
    size: width + ',' + height,
    timestamp: Date.now(),
  };
}

export function getLayerAdapterOptions(options: NgwLayerOptions, webMap: WebMap, baseUrl: string) {
  let adapter = options.adapter || 'IMAGE';
  let url: string;
  const layerAdapters = webMap.getLayerAdapters();
  const isImageAllowed = layerAdapters ? layerAdapters.IMAGE : true;
  if (adapter === 'IMAGE') {
    if (isImageAllowed) {
      url = baseUrl + '/api/component/render/image';
      return {
        url,
        resourceId: options.resourceId,
        headers: options.headers,
        updateWmsParams: (params: any) => updateWmsParams(params, options.resourceId)
      };
    } else {
      adapter = 'TILE';
    }
  }
  if (adapter === 'TILE') {
    url = baseUrl + '/api/component/render/tile?z={z}&x={x}&y={y}&resource=' + options.resourceId;
    return { url, adapter };
  }
}

export function addNgwLayer(options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string,
  connector: NgwConnector): Promise<Type<ResourceAdapter> | undefined> {

  const headers = connector.getAuthorizationHeaders();
  if (headers) {
    options.headers = headers;
  }

  return createAsyncAdapter(options, webMap, baseUrl, connector);
}

export function getWebMapExtent(webmap: WebmapResource): LngLatBoundsArray | undefined {
  const { extent_bottom, extent_left, extent_top, extent_right } = webmap;
  if (extent_bottom && extent_left && extent_top && extent_right) {
    const extent: LngLatBoundsArray = [extent_left, extent_bottom, extent_right, extent_top];
    if (extent[3] > 82) {
      extent[3] = 82;
    }
    if (extent[1] < -82) {
      extent[1] = -82;
    }
    return extent;
  }
}

export function getNgwLayerExtent(id: number, connector: NgwConnector): Promise<LngLatBoundsArray | undefined> {
  return connector.get('layer.extent', name, { id }).then((resp) => {
    if (resp) {
      const { maxLat, maxLon, minLat, minLon } = resp.extent;
      const extenrArray: LngLatBoundsArray =  [minLon, minLat, maxLon, maxLat];
      return extenrArray;
    }
  });
}

export async function getNgwResourceExtent(
  item: ResourceItem, connector: NgwConnector): Promise<LngLatBoundsArray | undefined> {
  if (item.webmap) {
    return getWebMapExtent(item.webmap);
  } else {
    const resource = item.resource;
    if (resource.cls.indexOf('style') !== -1) {
      return connector.get('resource.item', null, {
        id: resource.parent.id
      }).then((res) => {
        return getNgwLayerExtent(res.resource.id, connector);
      });
    } else {
      return getNgwLayerExtent(resource.id, connector);
    }
  }
}

interface FeatureIdentifyRequestOptions {
  /**
   * WKT Polygon geometry
   */
  geom: string;
  srs: 3857;
  layers: number[];
}

export function sendIdentifyRequest(
  ev: MapClickEvent,
  options: IdentifyRequestOptions): Promise<FeatureLayersIdentify> {

  // webMap.emitter.emit('start-identify', { ev });
  const geom = getCirclePoly(ev.latLng.lng, ev.latLng.lat, options.pixelRadius);

  // create wkt string
  const polygon: string[] = [];
  geom.forEach(([lng, lat]) => {
    const [x, y] = degrees2meters(lng, lat);
    polygon.push(x + ' ' + y);
  });
  const wkt = `POLYGON((${polygon.join(', ')}))`;

  const layers: number[] = options.layers;

  const data: FeatureIdentifyRequestOptions = {
    geom: wkt,
    srs: 3857,
    layers,
  };

  return options.connector.post('feature_layer.identify', { data });
}

const d2r = Math.PI / 180; // degrees to radians
const r2d = 180 / Math.PI; // radians to degrees
const earthsradius = 3963; // 3963 is the radius of the earth in miles

export function getCirclePoly(lng: number, lat: number, radius = 10, points = 6) {

  // find the radius in lat/lon
  const rlat = (radius / earthsradius) * r2d;
  const rlng = rlat / Math.cos(lat * d2r);

  const extp = [];
  for (let i = 0; i < points + 1; i++) {// one extra here makes sure we connect the

    const theta = Math.PI * (i / (points / 2));
    const ex = lng + (rlng * Math.cos(theta)); // center a + radius x * cos(theta)
    const ey = lat + (rlat * Math.sin(theta)); // center b + radius y * sin(theta)
    extp.push([ex, ey]);
  }

  // add the circle to the map
  return extp;
}

export function degrees2meters(lng: number, lat: number): [number, number] {
  const x = lng * 20037508.34 / 180;
  let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
  y = y * 20037508.34 / 180;
  return [x, y];
}

interface ExtendWebMapLayerAdapterOptions {
  webMap: WebMap;
  connector: NgwConnector;
  baseUrl?: string;
}

export function extendWebMapLayerAdapter(opt: ExtendWebMapLayerAdapterOptions): Type<WebMapLayerAdapter> {
  class A extends WebMapLayerAdapter {
    constructor(map: any, options: WebMapAdapterOptions) {
      options = { ...opt, ...options };
      super(map, options);
    }
  }
  return A;
}

let _pixelsInMeter: number;

export function pixelsInMeterWidth() {
  if (_pixelsInMeter === undefined) {
    const div = document.createElement('div');
    div.style.cssText = 'position: absolute;  left: -100%;  top: -100%;  width: 100cm;';
    document.body.appendChild(div);
    const px = div.offsetWidth;
    document.body.removeChild(div);
    _pixelsInMeter = px;
  }
  return _pixelsInMeter;
}

export function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      const descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
      if (descriptor) {
        Object.defineProperty(derivedCtor.prototype, name, descriptor);
      }
    });
  });
}
