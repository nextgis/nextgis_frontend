import type { GeoJSON, Geometry, Position } from 'geojson';

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
        for (const x of geom.coordinates) {
          x.forEach((y) => cb(y));
        }
      } else if (geom.type === 'MultiPolygon') {
        for (const x of geom.coordinates) {
          x.forEach((y) => y.forEach((z) => cb(z)));
        }
      } else if (geom.type === 'Point') {
        cb(geom.coordinates);
      } else if (geom.type === 'MultiPoint' || geom.type === 'LineString') {
        for (const x of geom.coordinates) {
          cb(x);
        }
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
        for (const x of geom.coordinates) {
          for (const y of x) {
            polygons.push(y);
          }
        }
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
    for (const f of geojson.features) {
      cb(f.geometry);
    }
  } else if (geojson.type === 'Feature') {
    cb(geojson.geometry);
  } else if ('coordinates' in geojson) {
    cb(geojson);
  }
}
