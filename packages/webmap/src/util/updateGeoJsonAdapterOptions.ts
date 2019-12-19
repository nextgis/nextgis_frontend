import {
  GeoJsonAdapterOptions,
  VectorAdapterLayerType
} from '../interfaces/LayerAdapter';
import { detectGeometryType } from './geometryTypes';

export const typeAlias: { [x: string]: VectorAdapterLayerType } = {
  Point: 'circle',
  LineString: 'line',
  MultiPoint: 'circle',
  Polygon: 'fill',
  MultiLineString: 'line',
  MultiPolygon: 'fill'
};

export function updateGeoJsonAdapterOptions(
  opt: GeoJsonAdapterOptions
): GeoJsonAdapterOptions {
  if (opt.data) {
    const geomType = typeAlias[detectGeometryType(opt.data)];
    const p = opt.paint;
    if (typeof p === 'object') {
      // define parameter if not specified
      p.type = p.type
        ? p.type
        : geomType === 'fill' || geomType === 'line'
        ? 'path'
        : 'html' in p || 'className' in p
        ? 'icon'
        : geomType;
    }
    opt.type = opt.type || geomType;
  }
  return opt;
}
