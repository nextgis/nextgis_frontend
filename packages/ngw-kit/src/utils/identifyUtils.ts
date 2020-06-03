import { LayerFeature, CancelablePromise } from '@nextgis/ngw-connector';
import { Geometry, Feature } from 'geojson';
import { getNgwLayerFeature, createGeoJsonFeature } from './featureLayerUtils';
import {
  GetIdentifyGeoJsonOptions,
  NgwIdentify,
  NgwIdentifyItem,
} from '../interfaces';

export function getIdentifyItems(
  identify: NgwIdentify,
  multiple = false
): NgwIdentifyItem[] {
  let params:
    | { resourceId: number; featureId: number; feature: LayerFeature }
    | undefined;
  const resources = [];
  const paramsList = [];
  for (const l in identify) {
    const id = Number(l);
    if (!isNaN(id)) {
      resources.push(id);
    }
  }
  const sortingArr = identify.resources;
  if (sortingArr) {
    resources.sort((a, b) => {
      return sortingArr.indexOf(a) - sortingArr.indexOf(b);
    });
  }
  for (let fry = 0; fry < resources.length; fry++) {
    const l = resources[fry];
    const layerFeatures = identify[l].features;
    const resourceId = Number(l);
    const feature: LayerFeature | undefined = layerFeatures[0];
    if (feature) {
      params = {
        featureId: feature.id,
        resourceId,
        feature,
      };
      paramsList.push(params);
      if (!multiple) {
        break;
      }
    }
  }
  return paramsList;
}

// TODO: always return CancelablePromise
export function getIdentifyGeoJson<
  G extends Geometry | null = Geometry,
  P extends Record<string, any> = Record<string, any>
>(
  options: GetIdentifyGeoJsonOptions
): CancelablePromise<Feature<G, P>> | Feature<G, P> | undefined {
  const { connector, identify } = options;
  for (const l in identify) {
    const id = Number(l);
    if (!isNaN(id)) {
      const item = identify[l];
      const withGeom = item.features.find((x) => x.geom);

      if (withGeom && withGeom.geom) {
        const geom = withGeom.geom as Geometry;
        return createGeoJsonFeature({
          ...withGeom,
          geom,
        });
      }
    }
  }

  const params = getIdentifyItems(identify);
  if (params) {
    return getNgwLayerFeature({ connector, ...params[0] });
  }
}
