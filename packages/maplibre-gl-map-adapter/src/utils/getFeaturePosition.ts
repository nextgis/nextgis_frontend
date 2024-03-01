import { getCoordinates } from '@nextgis/utils';
import { LngLatBounds } from 'maplibre-gl';

import type { LngLatArray, LngLatBoundsArray } from '@nextgis/utils';
import type { FeaturePosition } from '@nextgis/webmap';
import type { Feature } from 'geojson';

function getFeatureLngLatBounds(
  featureOrFeatures: Feature | Feature[],
): LngLatBounds {
  const bounds = new LngLatBounds();
  const features = Array.isArray(featureOrFeatures)
    ? featureOrFeatures
    : [featureOrFeatures];
  for (const feature of features) {
    const coord = getCoordinates(feature);
    for (const x of coord) {
      bounds.extend(x as [number, number]);
    }
  }
  return bounds;
}

export function getFeatureBounds(
  featureOrFeatures: Feature | Feature[],
): LngLatBoundsArray {
  const bounds = getFeatureLngLatBounds(featureOrFeatures);
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();

  return [sw.lng, sw.lat, ne.lng, ne.lat];
}

export function getFeatureCenter(
  featureOrFeatures: Feature | Feature[],
): LngLatArray {
  const bounds = getFeatureLngLatBounds(featureOrFeatures);
  const { lng, lat } = bounds.getCenter();
  return [lng, lat];
}

export function createFeaturePositionOptions(
  featureOrFeatures: Feature | Feature[],
): FeaturePosition {
  return {
    getBounds: () => getFeatureBounds(featureOrFeatures),
    getCenter: () => getFeatureCenter(featureOrFeatures),
  };
}
