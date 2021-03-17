import type Map from 'ol/Map';
import type { AdapterOptions } from '@nextgis/webmap';

const DPI = 1000 / 39.37 / 0.28;
const IPM = 39.37;

function getResolutionForScale(scale: number, metersPerUnit: number) {
  return scale / (metersPerUnit * IPM * DPI);
}

interface ResolutionOptions {
  minResolution: number | undefined;
  maxResolution: number | undefined;
}

export function resolutionOptions(
  map: Map,
  opt: AdapterOptions,
): ResolutionOptions {
  return {
    minResolution:
      (opt.maxScale && getResolution(map, opt.maxScale)) || undefined,
    maxResolution:
      (opt.minScale && getResolution(map, opt.minScale)) || undefined,
  };
}

export function getResolution(map: Map, scale: number): number | undefined {
  if (scale) {
    return getResolutionForScale(
      scale,
      map.getView().getProjection().getMetersPerUnit() || 1,
    );
  }
}
