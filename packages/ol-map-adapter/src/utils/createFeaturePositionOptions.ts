import { getCenter } from 'ol/extent';
import GeoJSON from 'ol/format/GeoJSON';
import { transformExtent } from 'ol/proj';
import VectorSource from 'ol/source/Vector';

import type { LngLatArray, LngLatBoundsArray } from '@nextgis/utils';
import type { FeaturePosition } from '@nextgis/webmap';
import type { Feature } from 'geojson';
import type Geometry from 'ol/geom/Geometry';

interface GetFeaturePositionOptions {
  feature: Feature | Feature[];
  dataProjection: string;
  featureProjection: string;
}

function featuresSource({
  feature,
  dataProjection,
  featureProjection,
}: GetFeaturePositionOptions): VectorSource<Geometry> {
  const olFeatures = new GeoJSON().readFeatures(
    {
      type: 'FeatureCollection',
      features: Array.isArray(feature) ? feature : [feature],
    },
    {
      dataProjection,
      featureProjection,
    },
  );
  const source = new VectorSource();
  source.addFeatures(olFeatures);
  return source;
}

export function getFeaturesBounds(
  opt: GetFeaturePositionOptions,
): LngLatBoundsArray {
  const source = featuresSource(opt);
  const bounds = source.getExtent();
  const extent = transformExtent(
    bounds,
    opt.featureProjection,
    opt.dataProjection,
  );
  source.dispose();
  return extent as LngLatBoundsArray;
}

export function getFeaturesCenter(opt: GetFeaturePositionOptions): LngLatArray {
  const extent = getFeaturesBounds(opt);
  return getCenter(extent);
}

export function createFeaturePositionOptions(
  opt: GetFeaturePositionOptions,
): FeaturePosition {
  return {
    getBounds: () => getFeaturesBounds(opt),
    getCenter: () => getFeaturesCenter(opt),
  };
}
