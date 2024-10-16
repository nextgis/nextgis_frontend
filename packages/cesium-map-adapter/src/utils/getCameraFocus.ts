import { defined, Ellipsoid, IntersectionTests, Ray } from 'cesium';

import type { Cartesian3, Scene } from 'cesium';

export function getCameraFocus(scene: Scene): Cartesian3 {
  const ray = new Ray(scene.camera.positionWC, scene.camera.directionWC);
  const intersections = IntersectionTests.rayEllipsoid(ray, Ellipsoid.WGS84);
  if (defined(intersections)) {
    return Ray.getPoint(ray, intersections.start);
  }
  // Camera direction is not pointing at the globe, so use the ellipsoid horizon point as
  // the focal point.
  return IntersectionTests.grazingAltitudeLocation(ray, Ellipsoid.WGS84);
}
