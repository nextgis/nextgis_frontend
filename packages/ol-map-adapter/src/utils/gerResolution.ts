import type Map from 'ol/Map';
import type { AdapterOptions } from '@nextgis/webmap';

const DPI = 1000 / 39.37 / 0.28;
const IPM = 39.37;

function getResolutionForScale(scale: number, metersPerUnit: number) {
  return scale / (metersPerUnit * IPM * DPI);
}

interface ResolutionOptions {
  minResolution?: number;
  maxResolution?: number;
  minZoom?: number;
  maxZoom?: number;
}

export function resolutionOptions(
  map: Map,
  opt: AdapterOptions,
): ResolutionOptions {
  const resOpt: ResolutionOptions = {
    minZoom: opt.minZoom,
    maxZoom: opt.maxZoom,
  };
  if (opt.maxScale) {
    resOpt.minResolution = getResolution(map, opt.maxScale);
  }
  if (opt.minScale) {
    resOpt.maxResolution = getResolution(map, opt.minScale);
  }
  return resOpt;
}

export function getResolution(map: Map, scale: number): number | undefined {
  if (scale) {
    return getResolutionForScale(
      scale,
      map.getView().getProjection().getMetersPerUnit() || 1,
    );
  }
}
