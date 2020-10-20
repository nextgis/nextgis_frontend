import {
  Scene,
  Cartesian3,
  Ray,
  IntersectionTests,
  defined,
  Ellipsoid,
} from 'cesium';

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
