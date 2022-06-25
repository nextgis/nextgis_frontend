import {
  GeoJsonGeometryTypes,
  GeoJsonObject,
  FeatureCollection,
  Feature,
  GeometryCollection,
} from 'geojson';
import { VectorAdapterLayerType } from '@nextgis/webmap';

export const allowedParams: ([string, string] | string)[] = [
  'color',
  'opacity',
];
export const allowedByType: {
  [key in VectorAdapterLayerType]: ([string, string] | string)[];
} = {
  point: [
    ['color', 'color'],
    ['fillColor', 'color'],
    ['opacity', 'opacity'],
    ['fillOpacity', 'opacity'],
    ['strokeColor', 'stroke-color'],
    ['strokeOpacity', 'stroke-opacity'],
    ['weight', 'stroke-width'],
    'radius',
  ],
  line: [
    ['color', 'color'],
    ['strokeColor', 'color'],
    ['opacity', 'opacity'],
    ['strokeOpacity', 'opacity'],
    ['weight', 'width'],
  ],
  polygon: [
    ['color', 'color'],
    ['fillColor', 'color'],
    ['opacity', 'opacity'],
    ['fillOpacity', 'opacity'],
  ],
};

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

export const typeAliasForFilter: {
  [key in VectorAdapterLayerType]: GeoJsonGeometryTypes;
} = {
  point: 'Point',
  line: 'LineString',
  polygon: 'Polygon',
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

// Static functions
export function geometryFilter(
  geometry: GeoJsonGeometryTypes,
  type: VectorAdapterLayerType,
): boolean {
  const backType = backAliases[type];
  if (backType) {
    return backType.indexOf(geometry) !== -1;
  }
  return false;
}
