// import wellknown from 'wellknown';
// @ts-ignore
// import { reproject } from 'reproject';
// @ts-ignore
// import proj4 from 'proj4';
import { GeometryObject } from 'geojson';

export function prepareGeomToNgw(feature: GeometryObject): GeometryObject {
  // const reprojected = reproject(feature, proj4.WGS84, 'EPSG:3857');
  // return wellknown.stringify(reprojected);
  return feature;
}
