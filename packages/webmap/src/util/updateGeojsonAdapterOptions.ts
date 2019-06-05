import { GeoJsonAdapterOptions, GeoJsonAdapterLayerType } from '../interfaces/LayerAdapter';
import { detectGeometryType } from './geometryTypes';

export const typeAlias: { [x: string]: GeoJsonAdapterLayerType } = {
  'Point': 'circle',
  'LineString': 'line',
  'MultiPoint': 'circle',
  'Polygon': 'fill',
  'MultiLineString': 'line',
  'MultiPolygon': 'fill'
};

export function updateGeojsonAdapterOptions(opt: GeoJsonAdapterOptions): GeoJsonAdapterOptions {
  if (opt.data) {
    const geomType = typeAlias[detectGeometryType(opt.data)];
    const p = opt.paint;
    if (typeof p === 'object') {
      // define parameter if not specified
      p.type = p.type ? p.type :
        (geomType === 'fill' || geomType === 'line') ?
          'path' :
          ('html' in p || 'className' in p) ?
            'icon' :
            geomType;
    }
    opt.type = geomType;
  }
  return opt;
}
