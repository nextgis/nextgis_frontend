import { GeoJSON } from 'leaflet';
import { boundsToArray } from './boundsToArray';

import type {
  Feature,
  GeoJsonObject,
  FeatureCollection,
  GeometryCollection,
  GeoJsonGeometryTypes,
} from 'geojson';
import type { LatLngBounds } from 'leaflet';
import type { LayerPosition, VectorAdapterLayerType } from '@nextgis/webmap';
import type { LngLatArray, LngLatBoundsArray } from '@nextgis/utils';

export const typeAlias: {
  [key in GeoJsonGeometryTypes]: VectorAdapterLayerType;
} = {
  Point: 'point',
  LineString: 'line',
  MultiPoint: 'point',
  Polygon: 'polygon',
  MultiLineString: 'line',
  MultiPolygon: 'polygon',
  GeometryCollection: 'polygon',
};

export const PAINT = {
  stroke: false,
  opacity: 1,
};

export const backAliases: {
  [key in VectorAdapterLayerType]?: GeoJsonGeometryTypes[];
} = {};

for (const a in typeAlias) {
  const layerType = typeAlias[a as GeoJsonGeometryTypes];
  const backAlias = backAliases[layerType] || [];
  backAlias.push(a as GeoJsonGeometryTypes);
  backAliases[layerType] = backAlias;
}

export function geometryFilter(
  geometry: GeoJsonGeometryTypes,
  type: VectorAdapterLayerType,
): boolean {
  const geoJsonGeometry = backAliases[type] || [];
  return geoJsonGeometry.indexOf(geometry) !== -1;
}

export function filterGeometries(
  data: GeoJsonObject,
  type: VectorAdapterLayerType,
): GeoJsonObject | false {
  if (data.type === 'FeatureCollection') {
    const _data = data as FeatureCollection;
    _data.features = _data.features.filter((f) =>
      geometryFilter(f.geometry.type, type),
    );
  } else if (data.type === 'Feature') {
    const allow = geometryFilter((data as Feature).geometry.type, type);
    if (!allow) {
      return false;
    }
  } else if (data.type === 'GeometryCollection') {
    const _data = data as GeometryCollection;
    _data.geometries = _data.geometries.filter((g) =>
      geometryFilter(g.type, type),
    );
  }
  return data;
}

function featuresBounds(features: Feature | Feature[]): LatLngBounds {
  const geoJsonLayer = new GeoJSON();
  const features_ = Array.isArray(features) ? features : [features];
  features_.forEach((f) => geoJsonLayer.addData(f));
  return geoJsonLayer.getBounds();
}

export function getFeaturesBounds(
  features: Feature | Feature[],
): LngLatBoundsArray {
  return boundsToArray(featuresBounds(features));
}

export function getFeaturesCenter(features: Feature | Feature[]): LngLatArray {
  const { lat, lng } = featuresBounds(features).getCenter();
  return [lng, lat];
}

export function createFeaturePositionOptions(
  features: Feature | Feature[],
): LayerPosition {
  return {
    getBounds: () => getFeaturesBounds(features),
    getCenter: () => getFeaturesCenter(features),
  };
}
