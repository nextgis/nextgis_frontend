import WebMap, { LayerAdapter, Type } from '@nextgis/webmap';
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
        id: options.id,
        resourceId: options.id,
        updateWmsParams: (params: any) => updateWmsParams(params, options.id)
      };
    } else {
      adapter = 'TILE';
    }
  }
  if (adapter === 'TILE') {
    url = baseUrl + '/api/component/render/tile?z={z}&x={x}&y={y}&resource=' + options.id;
    return { url, id: options.id, adapter };
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
      const layerAdapterOptions = { ...opt, id: String(opt.id) };
      return webMap.addLayer(adapter, layerAdapterOptions);
    }
  } else {
    throw new Error(adapter + ' not supported yet. Only TILE');
  }
}

interface ExtendWebMapLayerAdapterOptions {
  webMap: WebMap;
  connector: NgwConnector;
  baseUrl: string;
}

export function extendWebMapLayerAdapter(opt: ExtendWebMapLayerAdapterOptions): Type<WebMapLayerAdapter> {
  class A extends WebMapLayerAdapter {
    constructor(map: any, options: WebMapAdapterOptions) {
      options = {...opt, ...options};
      super(map, options);
    }
  }
  return A;
}
