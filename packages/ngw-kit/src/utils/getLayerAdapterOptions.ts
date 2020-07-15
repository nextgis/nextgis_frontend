import {
  WebMap,
  RasterAdapterOptions,
  ImageAdapterOptions,
} from '@nextgis/webmap';

import { NgwLayerOptions, ResourceIdNgwLayerOptions } from '../interfaces';
import { updateImageParams } from './utils';

export function getLayerAdapterOptions(
  options: NgwLayerOptions,
  webMap: WebMap,
  baseUrl: string
): RasterAdapterOptions | ImageAdapterOptions | undefined {
  let adapter = options.adapter || 'IMAGE';
  let url: string;
  const layerAdapters = webMap.getLayerAdapters();
  const isImageAllowed = layerAdapters ? layerAdapters.IMAGE : true;

  const resourceId = (options as ResourceIdNgwLayerOptions).resourceId;

  if (resourceId) {
    if (adapter === 'IMAGE') {
      if (isImageAllowed) {
        url = baseUrl + '/api/component/render/image';
        return {
          url,
          resourceId,
          headers: options.headers,
          updateWmsParams: (params: any) =>
            updateImageParams(params, resourceId),
        };
      } else {
        adapter = 'TILE';
      }
    }
    if (adapter === 'WMS') {
      url = `${baseUrl}/api/resource/${resourceId}/wms`;
      return {
        url,
        format: 'image/png',
        version: '1.1.1',
        layers: options.layers,
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
        (options.simplification || 0);
      // url = baseUrl + '/api/resource/' + options.resourceId + '/{z}/{x}/{y}.mvt';
      return {
        url,
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
        resourceId;
      return { url, adapter };
    }
  } else {
    console.log('Option `resourceId` not set');
  }
}
