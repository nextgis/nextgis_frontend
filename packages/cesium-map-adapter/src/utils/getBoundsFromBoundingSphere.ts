import { Ellipsoid, Math as CMath } from 'cesium';

import type { BoundingSphere } from 'cesium';

export function getBoundsFromBoundingSphere(
  boundingSphere: BoundingSphere,
): number[] | undefined {
  const minBS = boundingSphere.clone();
  const maxBS = boundingSphere.clone();
  minBS.center.x = minBS.center.x - boundingSphere.radius;
  minBS.center.y = minBS.center.y - boundingSphere.radius;
  maxBS.center.x = maxBS.center.x + boundingSphere.radius;
  maxBS.center.y = maxBS.center.y + boundingSphere.radius;
  const cartoMin = Ellipsoid.WGS84.cartesianToCartographic(minBS.center);
  const cartoMax = Ellipsoid.WGS84.cartesianToCartographic(maxBS.center);
  if (cartoMin && cartoMax) {
    const [west, east] = [cartoMin.longitude, cartoMax.longitude]
      .map(CMath.toDegrees)
      .sort((a, b) => a - b);
    const [south, north] = [cartoMin.latitude, cartoMax.latitude]
      .map(CMath.toDegrees)
      .sort((a, b) => a - b);
    return [west, south, east, north];
  }
}
