import { updateImageParams } from './utils';

import type { NgwLayerOptions, TileNoData } from '../interfaces';
import type {
  ImageAdapterOptions,
  MvtAdapterOptions,
  RasterAdapterOptions,
  WebMap,
  WmsAdapterOptions,
} from '@nextgis/webmap';

export interface GetLayerAdapterOptions {
  options: NgwLayerOptions;
  webMap?: WebMap;
  baseUrl?: string;
}

export interface GetImageAdapterOptionsParams {
  resourceId: number | number[];
  baseUrl?: string;
  nd?: TileNoData;
  headers: any;
}

export function getImageAdapterOptions({
  resourceId,
  baseUrl,
  nd,
  headers,
}: GetImageAdapterOptionsParams): ImageAdapterOptions {
  const url = baseUrl + '/api/component/render/image';
  const params: Record<string, any> = { resource: resourceId };
  if (nd) {
    params.nd = nd;
  }
  return {
    url,
    resourceId,
    headers,
    params,
    updateWmsParams: (params_: Record<string, any>) => {
      if (nd) {
        params_.nd = nd;
      }
      return updateImageParams(params_, resourceId);
    },
  } as ImageAdapterOptions;
}

export function ngwApiToAdapterOptions({
  options,
  webMap,
  baseUrl,
}: GetLayerAdapterOptions):
  | MvtAdapterOptions
  | RasterAdapterOptions
  | ImageAdapterOptions
  | undefined {
  let adapter = options.adapter || 'IMAGE';
  let url: string;
  const layerAdapters = webMap && webMap.getLayerAdapters();
  const isImageAllowed = layerAdapters ? layerAdapters.IMAGE : true;

  const resourceId = options.resource;
  const nd: TileNoData = options.tileNoData ? options.tileNoData : 200;

  if (typeof resourceId === 'number') {
    if (adapter === 'IMAGE') {
      if (isImageAllowed) {
        return getImageAdapterOptions({
          resourceId,
          headers: options.headers,
          nd,
          baseUrl,
        });
      } else {
        adapter = 'TILE';
      }
    }
    if (adapter === 'WMS') {
      url = `${baseUrl}/api/resource/${resourceId}/wms`;
      const adapterOptions = options.adapterOptions as WmsAdapterOptions;
      return {
        url,
        format: 'image/png',
        version: '1.1.1',
        layers: adapterOptions && adapterOptions.layers,
        headers: options.headers,
      };
    }
    if (adapter === 'MVT') {
      url =
        baseUrl +
        '/api/component/feature_layer/mvt?x={x}&y={y}&z={z}&' +
        'resource=' +
        resourceId +
        '&simplification=' +
        (options.simplification ?? 6);
      // url = baseUrl + '/api/resource/' + options.resourceId + '/{z}/{x}/{y}.mvt';
      return {
        url,
        sourceLayer: 'ngw:' + resourceId,
        featureIdName: '$id',
      };
    }
    if (adapter === 'TERRAIN') {
      url = baseUrl + `/api/resource/${resourceId}/terrain_provider`;
      // `/api/resource/${resourceId}/terrain_provider/{z}/{x}/{y}.terrain`;
      return { url, adapter };
    }
    if (adapter === 'MODEL_3D') {
      url = baseUrl + `/api/component/model_3d/${resourceId}/data.glb`;
      return { url };
    }
    if (adapter === 'TILE') {
      url =
        baseUrl +
        '/api/component/render/tile?z={z}&x={x}&y={y}&resource=' +
        resourceId +
        '&nd=' +
        nd;
      return { url, adapter };
    }
  } else if (resourceId !== undefined) {
    throw new Error(
      'Option `resource` must be number, not ' + typeof resourceId,
    );
  } else {
    console.log('Option `resource` not set');
  }
}

/** @deprecated use {@link ngwApiToAdapterOptions} instead */
export function getLayerAdapterOptions(
  options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string,
): RasterAdapterOptions | ImageAdapterOptions | undefined {
  return ngwApiToAdapterOptions({ options, webMap, baseUrl });
}
