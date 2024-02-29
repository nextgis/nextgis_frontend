import { VectorLayer } from './VectorLayer';

import type { GeometryType } from '@nextgis/ngw-connector';
import type { Point } from 'geojson';

export class PointLayer extends VectorLayer<Point> {
  static geometryType: GeometryType = 'POINT';
}
