import { BoundingSphere, Ellipsoid, Math as CMath } from 'cesium';

export function getExtentFromBoundingSphere(
  boundingSphere: BoundingSphere
): number[] {
  const minBoundingSphere = boundingSphere.clone();
  const maxBoundingSphere = boundingSphere.clone();
  minBoundingSphere.center.x =
    minBoundingSphere.center.x - boundingSphere.radius;
  minBoundingSphere.center.y =
    minBoundingSphere.center.y - boundingSphere.radius;
  maxBoundingSphere.center.x =
    maxBoundingSphere.center.x + boundingSphere.radius;
  maxBoundingSphere.center.y =
    maxBoundingSphere.center.y + boundingSphere.radius;
  const cartoMin = Ellipsoid.WGS84.cartesianToCartographic(
    minBoundingSphere.center
  );
  const cartoMax = Ellipsoid.WGS84.cartesianToCartographic(
    maxBoundingSphere.center
  );
  const west = CMath.toDegrees(cartoMin.longitude);
  const south = CMath.toDegrees(cartoMin.latitude);
  const east = CMath.toDegrees(cartoMax.longitude);
  const north = CMath.toDegrees(cartoMax.latitude);
  return [west, south, east, north];
}
