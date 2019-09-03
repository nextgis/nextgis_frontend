import { LayerFeature } from '@nextgis/ngw-connector';
import { getNgwLayerFeature } from './featureLayerUtils';
import { GetIdentifyGeoJsonOptions, GeoJsonIdentify } from '../interfaces';

export function getIdentifyGeoJson(options: GetIdentifyGeoJsonOptions) {
  const { connector, identify } = options;
  const params = getIdentifyGeoJsonParams(identify);
  if (params) {
    return getNgwLayerFeature({ connector, ...params });
  }
}

export function getIdentifyGeoJsonParams(identify: GeoJsonIdentify) {
  let params: { resourceId: number; featureId: number } | undefined;
  const resources = [];
  for (const l in identify) {
    const id = Number(l);
    if (!isNaN(id)) {
      resources.push(id);
    }
  }
  const sortingArr = identify.resources;
  if (sortingArr) {
    resources.sort(function(a, b) {
      return sortingArr.indexOf(a) - sortingArr.indexOf(b);
    });
  }
  for (let fry = 0; fry < resources.length; fry++) {
    const l = resources[fry];
    const layerFeatures = identify[l].features;
    const resourceId = Number(l);
    const f: LayerFeature | undefined = layerFeatures[0];
    if (f) {
      // select only one feature from first layer
      params = {
        featureId: f.id,
        resourceId
      };
      break;
    }
  }
  return params;
}
