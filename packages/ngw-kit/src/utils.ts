import WebMap, { LayerAdapter, Type, ImageAdapterOptions, TileAdapterOptions } from '@nextgis/webmap';
import { NgwLayerOptions, WebMapAdapterOptions } from './interfaces';
import { WebMapLayerAdapter } from './WebMapLayerAdapter';
import NgwConnector from '@nextgis/ngw-connector';

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

export function addNgwLayer(
  options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string): Promise<LayerAdapter | undefined> | undefined {

  let adapter = options.adapter || 'IMAGE';
  const layerAdapters = webMap.getLayerAdapters();
  const isImageAllowed = layerAdapters ? layerAdapters.IMAGE : true;
  if (!isImageAllowed) {
    adapter = 'TILE';
  }
  if (adapter === 'IMAGE' || adapter === 'TILE') {
    const opt = getLayerAdapterOptions(options, webMap, baseUrl);
    if (opt) {
      if (opt.resourceId) {
        const layerAdapterOptions: ImageAdapterOptions = { ...opt, resourceId: opt.resourceId };
        return webMap.addLayer(adapter, layerAdapterOptions);
      }
      const tileAdapterOptions: TileAdapterOptions = opt;
      return webMap.addLayer(adapter, tileAdapterOptions);
    }
  } else {
    throw new Error(adapter + ' not supported yet. Only TILE');
  }
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
  baseUrl: string;
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
