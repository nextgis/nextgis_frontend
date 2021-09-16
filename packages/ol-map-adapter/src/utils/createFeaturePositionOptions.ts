import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { transformExtent } from 'ol/proj';
import { getCenter } from 'ol/extent';

import type { Feature } from 'geojson';
import type Geometry from 'ol/geom/Geometry';
import type { LayerPosition } from '@nextgis/webmap';
import type { LngLatArray, LngLatBoundsArray } from '@nextgis/utils';

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
): LayerPosition {
  return {
    getBounds: () => getFeaturesBounds(opt),
    getCenter: () => getFeaturesCenter(opt),
  };
}
