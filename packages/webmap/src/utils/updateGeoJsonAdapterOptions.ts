/**
 * @module webmap
 */
import { isPaint } from '@nextgis/paint';
import {
  GeoJsonAdapterOptions,
  VectorAdapterLayerType,
} from '../interfaces/LayerAdapter';
import { detectGeometryType } from './geometryTypes';

export const paintTypeAlias: Record<VectorAdapterLayerType, any> = {
  polygon: 'path',
  line: 'path',
  point: 'circle',
};

export const typeAlias: { [x: string]: VectorAdapterLayerType } = {
  Point: 'point',
  LineString: 'line',
  MultiPoint: 'point',
  Polygon: 'polygon',
  MultiLineString: 'line',
  MultiPolygon: 'polygon',
};

export function updateGeoJsonAdapterOptions(
  opt: GeoJsonAdapterOptions
): GeoJsonAdapterOptions {
  if (opt.data) {
    const geomType = typeAlias[detectGeometryType(opt.data)];
    const p = opt.paint;
    if (p && isPaint(p)) {
      // define parameter if not specified
      p.type = p.type
        ? p.type
        : geomType === 'polygon' || geomType === 'line'
        ? 'path'
        : 'html' in p || 'className' in p
        ? 'icon'
        : paintTypeAlias[geomType];
    }
    opt.type = opt.type || geomType;
  }
  return opt;
}
