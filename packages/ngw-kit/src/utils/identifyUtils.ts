import CancelablePromise from '@nextgis/cancelable-promise';
import {
  JsonMap,
  degrees2meters,
  getCirclePolygonCoordinates,
  deprecatedMapClick,
} from '@nextgis/utils';
import { createGeoJsonFeature } from './featureLayerUtils';
import { fetchNgwLayerFeature } from './fetchNgwLayerFeature';
import { fetchNgwLayerItem } from './fetchNgwLayerItem';

import type { Geometry, Feature } from 'geojson';
import type { MapClickEvent } from '@nextgis/webmap';
import type {
  LayerFeature,
  FeatureLayersIdentify,
  FeatureProperties,
} from '@nextgis/ngw-connector';
import type {
  GetIdentifyGeoJsonOptions,
  NgwIdentify,
  NgwIdentifyItem,
  IdentifyRequestOptions,
  FeatureIdentifyRequestOptions,
  NgwFeatureItemResponse,
  IdentifyItemOptions,
} from '../interfaces';
import { IdentifyItem } from '../IdentifyItem';

export function getIdentifyItems(
  identify: NgwIdentify,
  multiple = false,
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
    const identifyItem = identify[l];
    if ('features' in identifyItem) {
      const layerFeatures = identifyItem.features;
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
  }
  return paramsList;
}

export function fetchIdentifyGeoJson<
  G extends Geometry = Geometry,
  P extends JsonMap = JsonMap
>(
  options: GetIdentifyGeoJsonOptions,
): CancelablePromise<Feature<G, P> | undefined> {
  const { connector, identify } = options;
  for (const l in identify) {
    const id = Number(l);
    if (!isNaN(id)) {
      const item = identify[l];
      if ('features' in item) {
        const withGeom = item.features.find((x) => x.geom);

        if (withGeom && withGeom.geom) {
          const geom = withGeom.geom as Geometry;
          return CancelablePromise.resolve(
            createGeoJsonFeature({
              ...withGeom,
              geom,
            }),
          );
        }
      }
    }
  }

  const params = getIdentifyItems(identify);
  if (params && params.length) {
    return fetchNgwLayerFeature({ connector, ...params[0] });
  }
  return CancelablePromise.resolve(undefined);
}

export function fetchIdentifyItem<
  G extends Geometry = Geometry,
  P extends FeatureProperties = FeatureProperties
>(
  options: GetIdentifyGeoJsonOptions,
): CancelablePromise<NgwFeatureItemResponse<P, G> | undefined> {
  const { connector, identify } = options;

  const params = getIdentifyItems(identify);
  if (params && params.length) {
    return fetchNgwLayerItem({
      connector,
      ...options.requestOptions,
      ...params[0],
    });
  }
  return CancelablePromise.resolve(undefined);
}

/**
 * @deprecated use {@link fetchIdentifyGeoJson} instead
 */
export function getIdentifyGeoJson<
  G extends Geometry = Geometry,
  P extends JsonMap = JsonMap
>(
  options: GetIdentifyGeoJsonOptions,
): CancelablePromise<Feature<G, P> | undefined> {
  return fetchIdentifyGeoJson(options);
}

export function sendIdentifyRequest(
  ev: MapClickEvent,
  options: IdentifyRequestOptions,
  // webMap: WebMap
): CancelablePromise<FeatureLayersIdentify> {
  deprecatedMapClick(ev);
  const [lng, lat] = ev.lngLat;

  let geom: number[][] = [];

  if (options.geom) {
    const polygon =
      options.geom.type === 'Feature'
        ? options.geom.geometry
        : options.geom.type === 'Polygon'
        ? options.geom
        : false;
    if (polygon) {
      geom = polygon.coordinates[0];
    }
  }
  if (!geom.length) {
    geom = getCirclePolygonCoordinates(lng, lat, options.radius);
  }

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

export function createIdentifyItem<
  F = FeatureProperties,
  G extends Geometry = Geometry
>(opt: IdentifyItemOptions): IdentifyItem {
  return new IdentifyItem<F, G>(opt);
}
