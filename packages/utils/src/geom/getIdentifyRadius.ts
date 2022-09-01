import { LngLatArray } from '@nextgis/utils';

export function getIdentifyRadius(
  center: LngLatArray,
  zoom: number,
  pixelRadius: number,
): number {
  pixelRadius = pixelRadius ?? 10;
  const metresPerPixel =
    (40075016.686 * Math.abs(Math.cos((center[1] * 180) / Math.PI))) /
    Math.pow(2, zoom + 8);
  const radius = pixelRadius * metresPerPixel * 0.0005;
  return radius;
}
