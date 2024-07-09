import {
  degrees2meters,
  deprecatedMapClick,
  getCirclePolygonCoordinates,
} from '@nextgis/utils';

import { IdentifyItem } from '../IdentifyItem';

import { createGeoJsonFeature } from './featureLayerUtils';
import { fetchNgwLayerFeature } from './fetchNgwLayerFeature';
import { fetchNgwLayerItem } from './fetchNgwLayerItem';

import type {
  FeatureIdentifyRequestOptions,
  FeatureLayerIdentifyOptions,
  GetIdentifyGeoJsonOptions,
  IdentifyItemOptions,
  IdentifyRequestOptions,
  NgwFeatureItemResponse,
  NgwIdentifyItem,
} from '../interfaces';
import type {
  FeatureLayersIdentify,
  LayerFeature,
} from '@nextgis/ngw-connector';
import type { FeatureProperties, JsonMap } from '@nextgis/utils';
import type { MapClickEvent } from '@nextgis/webmap';
import type { Feature, Geometry, Position } from 'geojson';

export function getIdentifyItems(
  identify: FeatureLayersIdentify & { resources?: number[] },
  multiple = false,
): NgwIdentifyItem[] {
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
      const featureParams: NgwIdentifyItem[] = createParamsFromFeatures(
        layerFeatures,
        resourceId,
        multiple,
      );
      if (featureParams.length) {
        paramsList.push(...featureParams);
        if (!multiple) {
          break;
        }
      }
    }
  }
  return paramsList;
}

function createParamsFromFeatures(
  features: LayerFeature[],
  resourceId: number,
  multiple: boolean,
): NgwIdentifyItem[] {
  const featureParams: NgwIdentifyItem[] = [];
  for (const feature of features) {
    const params = {
      featureId: feature.id,
      resourceId,
      feature,
    };
    featureParams.push(params);
    if (!multiple) {
      break;
    }
  }
  return featureParams;
}

export function fetchIdentifyGeoJson<
  G extends Geometry = Geometry,
  P extends JsonMap = JsonMap,
>(options: GetIdentifyGeoJsonOptions): Promise<Feature<G, P> | undefined> {
  const { connector, identify, requestOptions } = options;
  for (const l in identify) {
    const id = Number(l);
    if (!isNaN(id)) {
      const item = identify[l];
      if ('features' in item) {
        const withGeom = item.features.find((x) => x.geom);

        if (withGeom && withGeom.geom) {
          const geom = withGeom.geom as Geometry;
          return Promise.resolve(
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
    return fetchNgwLayerFeature({ ...requestOptions, connector, ...params[0] });
  }
  return Promise.resolve(undefined);
}

export function fetchIdentifyItem<
  G extends Geometry = Geometry,
  P extends FeatureProperties = FeatureProperties,
>(
  options: GetIdentifyGeoJsonOptions<P>,
): Promise<NgwFeatureItemResponse<P, G> | undefined> {
  const { connector, identify } = options;

  const params = getIdentifyItems(identify);
  if (params && params.length) {
    return fetchNgwLayerItem<G, P>({
      connector,
      ...options.requestOptions,
      ...params[0],
    });
  }
  return Promise.resolve(undefined);
}

/**
 * @deprecated use {@link fetchIdentifyGeoJson} instead
 */
export function getIdentifyGeoJson<
  G extends Geometry = Geometry,
  P extends JsonMap = JsonMap,
>(options: GetIdentifyGeoJsonOptions): Promise<Feature<G, P> | undefined> {
  return fetchIdentifyGeoJson(options);
}

export function featureLayerIdentify(
  options: FeatureLayerIdentifyOptions,
): Promise<FeatureLayersIdentify> {
  const { geom, signal, cache, layers } = options;

  const wkt = typeof geom === 'string' ? geom : convertGeomToWKT(geom);

  if (!wkt) {
    throw new Error('Not valid geometry format to make intersection');
  }

  const data: FeatureIdentifyRequestOptions = {
    geom: wkt,
    srs: 3857,
    layers,
  };

  return options.connector.post('feature_layer.identify', {
    data,
    signal,
    cache,
  });
}

function convertGeomToWKT(
  geom: FeatureLayerIdentifyOptions['geom'],
): string | null {
  const coordinates = getPolygonCoordinates(geom);
  if (!coordinates) return null;

  const polygonStr = coordinates.map(([lng, lat]) => {
    const [x, y] = degrees2meters(lng, lat);
    return `${x} ${y}`;
  });

  return `POLYGON((${polygonStr.join(',')}))`;
}

function getPolygonCoordinates(
  geom: FeatureLayerIdentifyOptions['geom'],
): Position[] | null {
  if (Array.isArray(geom)) {
    return geom;
  }

  if (geom.type === 'Feature') {
    return geom.geometry?.coordinates[0];
  }

  if (geom.type === 'Polygon') {
    return geom.coordinates[0];
  }

  return null;
}

export function sendIdentifyRequest(
  ev: MapClickEvent,
  options: IdentifyRequestOptions,
): Promise<FeatureLayersIdentify> {
  deprecatedMapClick(ev);
  const [lng, lat] = ev.lngLat;
  const { geom, radius } = options;
  const geom_ = geom ?? getCirclePolygonCoordinates(lng, lat, radius);

  return featureLayerIdentify({ ...options, geom: geom_ });
}

export function createIdentifyItem<
  F extends FeatureProperties = FeatureProperties,
  G extends Geometry = Geometry,
>(opt: IdentifyItemOptions): IdentifyItem<F, G> {
  return new IdentifyItem<F, G>(opt);
}
