import { Math as CesiumMath, Ellipsoid } from 'cesium';

import type { LngLatArray } from '@nextgis/utils';
import type { Cartesian3 } from 'cesium';

export function cartesian3ToLngLat(position: Cartesian3): LngLatArray {
  const cartographic = Ellipsoid.WGS84.cartesianToCartographic(position);
  return [
    CesiumMath.toDegrees(cartographic.longitude),
    CesiumMath.toDegrees(cartographic.latitude),
  ];
}
