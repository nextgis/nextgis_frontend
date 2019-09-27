import wellknown from 'wellknown';
// @ts-ignore
import { reproject } from 'reproject';
import proj4 from 'proj4';
import { GeoJsonObject } from 'geojson';

export function prepareGeomToNgw(feature: GeoJsonObject) {
  const reprojected = reproject(feature, proj4.WGS84, 'EPSG:3857');
  return wellknown.stringify(reprojected);
}
