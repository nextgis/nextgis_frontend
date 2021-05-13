import type {
  GeoJsonObject,
  GeoJsonGeometryTypes,
  FeatureCollection,
  GeometryCollection,
  Feature,
} from 'geojson';

/**
 * @internal
 */
export function findMostFrequentGeomType(
  arr: GeoJsonGeometryTypes[],
): GeoJsonGeometryTypes {
  const counts: { [x: string]: number } = {};
  for (let fry = 0; fry < arr.length; fry++) {
    counts[arr[fry]] = 1 + (counts[arr[fry]] || 0);
  }
  let maxName;
  for (const c in counts) {
    const count = maxName !== undefined ? counts[maxName] : 0;
    if (counts[c] > (count || 0)) {
      maxName = c;
    }
  }
  return maxName as GeoJsonGeometryTypes;
}

/**
 * @internal
 */
export function detectGeometryType(
  geojson: GeoJsonObject,
): GeoJsonGeometryTypes {
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
