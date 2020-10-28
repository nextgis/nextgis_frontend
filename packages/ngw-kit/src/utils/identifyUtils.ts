import { Geometry, Feature } from 'geojson';
import { LayerFeature, FeatureLayersIdentify } from '@nextgis/ngw-connector';
import CancelablePromise from '@nextgis/cancelable-promise';
import { MapClickEvent } from '@nextgis/webmap';
import {
  JsonMap,
  degrees2meters,
  getCirclePolygonCoordinates,
} from '@nextgis/utils';
import {
  GetIdentifyGeoJsonOptions,
  NgwIdentify,
  NgwIdentifyItem,
  IdentifyRequestOptions,
  FeatureIdentifyRequestOptions,
} from '../interfaces';
import { createGeoJsonFeature } from './featureLayerUtils';
import { fetchNgwLayerFeature } from './fetchNgwLayerFeature';

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

export function getIdentifyGeoJson<
  G extends Geometry = Geometry,
  P extends JsonMap = JsonMap
>(
  options: GetIdentifyGeoJsonOptions
): CancelablePromise<Feature<G, P> | undefined> {
  const { connector, identify } = options;
  for (const l in identify) {
    const id = Number(l);
    if (!isNaN(id)) {
      const item = identify[l];
      const withGeom = item.features.find((x) => x.geom);

      if (withGeom && withGeom.geom) {
        const geom = withGeom.geom as Geometry;
        return CancelablePromise.resolve(
          createGeoJsonFeature({
            ...withGeom,
            geom,
          })
        );
      }
    }
  }

  const params = getIdentifyItems(identify);
  if (params) {
    return fetchNgwLayerFeature({ connector, ...params[0] });
  }
  return CancelablePromise.resolve(undefined);
}

export function sendIdentifyRequest(
  ev: MapClickEvent,
  options: IdentifyRequestOptions
  // webMap: WebMap
): Promise<FeatureLayersIdentify> {
  // webMap.emitter.emit('start-identify', { ev });
  const geom = getCirclePolygonCoordinates(
    ev.latLng.lng,
    ev.latLng.lat,
    options.radius
  );

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
