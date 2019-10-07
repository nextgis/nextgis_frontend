import { Map } from 'ol';

const DPI = 1000 / 39.37 / 0.28;
const IPM = 39.37;

function getResolutionForScale(scale: number, metersPerUnit: number) {
  return scale / (metersPerUnit * IPM * DPI);
}

export function getResolution(map: Map, scale: number) {
  if (scale) {
    return getResolutionForScale(
      scale,
      map
        .getView()
        .getProjection()
        .getMetersPerUnit() || 1
    );
  }
}
