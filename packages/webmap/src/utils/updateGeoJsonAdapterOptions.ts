import { isPaint } from '@nextgis/paint';
import { detectGeometryType } from './geometryTypes';

import type {
  GeoJsonAdapterOptions,
  VectorAdapterLayerType,
} from '../interfaces/LayerAdapter';

/**
 * @internal
 */
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

/**
 * @internal
 */
export function updateGeoJsonAdapterOptions<
  O extends GeoJsonAdapterOptions = GeoJsonAdapterOptions,
>(opt: O): O {
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
