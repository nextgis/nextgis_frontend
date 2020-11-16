import { GeoJSON, Position, Geometry } from 'geojson';

export function eachCoordinates(
  geojson: GeoJSON,
  cb: (position: Position) => void
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

export function eachGeometry(
  geojson: GeoJSON,
  cb: (position: Geometry) => void
): void {
  if (geojson.type === 'FeatureCollection') {
    geojson.features.forEach((f) => {
      cb(f.geometry);
    });
  } else if (geojson.type === 'Feature') {
    cb(geojson.geometry);
  } else if ('geometry' in geojson) {
    cb(geojson);
  }
}
