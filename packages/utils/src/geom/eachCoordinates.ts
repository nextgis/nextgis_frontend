import type { GeoJSON, Position, Geometry } from 'geojson';

export function coordinatesCount(geojson: GeoJSON): number {
  let count = 0;
  eachCoordinates(geojson, () => count++);
  return count;
}

export function getCoordinates(geojson: GeoJSON): Position[] {
  const coordinates: Position[] = [];
  eachCoordinates(geojson, (pos) => coordinates.push(pos));
  return coordinates;
}

export function eachCoordinates(
  geojson: GeoJSON,
  cb: (position: Position) => void,
): void {
  eachGeometry(geojson, (geom) => {
    if ('coordinates' in geom) {
      if (geom.type === 'Polygon' || geom.type === 'MultiLineString') {
        geom.coordinates.forEach((x) => {
          x.forEach((y) => cb(y));
        });
      } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach((x) => {
          x.forEach((y) => y.forEach((z) => cb(z)));
        });
      } else if (geom.type === 'Point') {
        cb(geom.coordinates);
      } else if (geom.type === 'MultiPoint' || geom.type === 'LineString') {
        geom.coordinates.forEach((x) => {
          cb(x);
        });
      }
    }
    return geom;
  });
}

export function getPolygons(geojson: GeoJSON): Position[][] {
  const polygons: Position[][] = [];
  eachGeometry(geojson, (geom) => {
    if ('coordinates' in geom) {
      if (geom.type === 'Polygon') {
        geom.coordinates.forEach((x) => polygons.push(x));
      } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach((x) => {
          x.forEach((y) => polygons.push(y));
        });
      }
    }
    return geom;
  });
  return polygons;
}

export function eachGeometry(
  geojson: GeoJSON,
  cb: (position: Geometry) => void,
): void {
  if (geojson.type === 'FeatureCollection') {
    geojson.features.forEach((f) => {
      cb(f.geometry);
    });
  } else if (geojson.type === 'Feature') {
    cb(geojson.geometry);
  } else if ('coordinates' in geojson) {
    cb(geojson);
  }
}
