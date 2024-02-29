import { VectorLayer } from './VectorLayer';

import type { GeometryType } from '@nextgis/ngw-connector';
import type { Polygon } from 'geojson';

export class PolygonLayer extends VectorLayer<Polygon> {
  static geometryType: GeometryType = 'POLYGON';
}
