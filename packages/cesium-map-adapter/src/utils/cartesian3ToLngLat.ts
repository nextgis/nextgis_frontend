import { Cartesian3, Ellipsoid, Math as CesiumMath } from 'cesium';
import { LngLatArray } from '@nextgis/utils';

export function cartesian3ToLngLat(position: Cartesian3): LngLatArray {
  const cartographic = Ellipsoid.WGS84.cartesianToCartographic(position);
  return [
    CesiumMath.toDegrees(cartographic.longitude),
    CesiumMath.toDegrees(cartographic.latitude),
  ];
}
