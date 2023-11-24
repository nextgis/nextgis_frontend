import type { Polygon } from 'geojson';
import type { GeometryType } from '@nextgis/ngw-connector';
import { VectorLayer } from './VectorLayer';

export class PolygonLayer extends VectorLayer<Polygon> {
  static geometryType: GeometryType = 'POLYGON';
}
