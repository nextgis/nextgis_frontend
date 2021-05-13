import { VectorAdapterLayerType, MapClickEvent } from '@nextgis/webmap';
import {
  GeoJsonObject,
  GeoJsonGeometryTypes,
  FeatureCollection,
  Feature,
  GeometryCollection,
} from 'geojson';
import { LeafletMouseEvent } from 'leaflet';

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

export function findMostFrequentGeomType(
  arr: GeoJsonGeometryTypes[],
): GeoJsonGeometryTypes {
  const counts: { [x: string]: number } = {};
  for (let fry = 0; fry < arr.length; fry++) {
    counts[arr[fry]] = 1 + (counts[arr[fry]] || 0);
  }
  let maxName = '';
  for (const c in counts) {
    const maxCount = maxName ? counts[maxName] : 0;
    if (counts[c] > maxCount) {
      maxName = c;
    }
  }
  return maxName as GeoJsonGeometryTypes;
}

export function detectType(geojson: GeoJsonObject): GeoJsonGeometryTypes {
  let geometry: GeoJsonGeometryTypes;
  if (geojson.type === 'FeatureCollection') {
    const featuresTypes = (geojson as FeatureCollection).features.map(
      (f) => f.geometry.type,
    );
    geometry = findMostFrequentGeomType(featuresTypes);
  } else if (geojson.type === 'GeometryCollection') {
    const geometryTypes = (geojson as GeometryCollection).geometries.map(
      (g) => g.type,
    );
    geometry = findMostFrequentGeomType(geometryTypes);
  } else if (geojson.type === 'Feature') {
    geometry = (geojson as Feature).geometry.type;
  } else {
    geometry = geojson.type;
  }
  return geometry;
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

export function convertMapClickEvent(evt: LeafletMouseEvent): MapClickEvent {
  const coord = evt.containerPoint;
  const latLng = evt.latlng;
  const { lat, lng } = latLng;
  return {
    latLng,
    lngLat: [lng, lat],
    pixel: { left: coord.x, top: coord.y },
    source: evt,
  };
}
